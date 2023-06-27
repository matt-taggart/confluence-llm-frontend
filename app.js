// Entry point for the app

// Express is the underlying that atlassian-connect-express uses:
// https://expressjs.com
import express from "express";

// https://expressjs.com/en/guide/using-middleware.html
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import errorHandler from "errorhandler";
import morgan from "morgan";
import cors from "cors";
import * as jwt from "atlassian-jwt";

// atlassian-connect-express also provides a middleware
import ace from "atlassian-connect-express";

// Use Handlebars as view engine:
// https://npmjs.org/package/express-hbs
// http://handlebarsjs.com
import hbs from "express-hbs";

// We also need a few stock Node modules
import http from "http";
import path from "path";
import os from "os";
import helmet from "helmet";
import nocache from "nocache";
import { v4 as uuidv4 } from "uuid";

// Routes live here; this is the C in MVC
import routes from "./routes";
import { addServerSideRendering } from "./server-side-rendering";

// Supabase client
import { supabase } from "./services/supabase-client";

// Bootstrap Express and atlassian-connect-express
const app = express();
const addon = ace(app);

// See config.json
const port = addon.config.port();
app.set("port", port);

// Allow CORs requests from frontend
app.use(cors());

// Log requests, using an appropriate formatter by env
const devEnv = app.get("env") === "development";
app.use(morgan(devEnv ? "dev" : "combined"));

// We don't want to log JWT tokens, for security reasons
morgan.token("url", redactJwtTokens);

// Configure Handlebars
const viewsDir = path.join(__dirname, "views");
const handlebarsEngine = hbs.express4({ partialsDir: viewsDir });
app.engine("hbs", handlebarsEngine);
app.set("view engine", "hbs");
app.set("views", viewsDir);

// Configure jsx (jsx files should go in views/ and export the root component as the default export)
addServerSideRendering(app, handlebarsEngine);

// Atlassian security policy requirements
// http://go.atlassian.com/security-requirements-for-cloud-apps
// HSTS must be enabled with a minimum age of at least one year
app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: false,
  })
);
app.use(
  helmet.referrerPolicy({
    policy: ["origin"],
  })
);

// Include request parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Gzip responses when appropriate
app.use(compression());

// Include atlassian-connect-express middleware
app.use(addon.middleware());

addon.on("host_settings_saved", async function (_, clientInfo) {
  console.log("New host settings were saved!");
  const { clientKey, publicKey, sharedSecret, baseUrl } = clientInfo;

  try {
    const { data: companyData } = await supabase
      .from("companies")
      .select("id")
      .eq("client_key", clientKey);

    const existingCompanyId = companyData[0].id;

    try {
      if (existingCompanyId) {
        const { data: updatedData } = await supabase
          .from("companies")
          .update({
            client_key: clientKey,
            shared_secret: sharedSecret,
            base_url: baseUrl,
            public_key: publicKey,
          })
          .eq("id", existingCompanyId);
      } else {
        await supabase.from("companies").insert({
          id: uuidv4(),
          client_key: clientKey,
          shared_secret: sharedSecret,
          base_url: baseUrl,
          public_key: publicKey,
        });
      }
    } catch (error) {
      console.log("%cerror", "color:cyan; ", error);
    }

    const req = jwt.fromMethodAndUrl(
      "GET",
      "/api/v2/pages?body-format=storage"
    );

    const now = Math.floor(Date.now() / 1000);

    const tokenData = {
      iss: clientInfo.key,
      iat: now,
      exp: now + 180,
      qsh: jwt.createQueryStringHash(req),
    };

    const token = jwt.encodeSymmetric(tokenData, sharedSecret);

    const projectPilotBaseUrl = process.env.PROJECT_PILOT_BASE_URL;
    await fetch(`${projectPilotBaseUrl}/initialize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-project-pilot-api-key": process.env.PROJECT_PILOT_API_KEY,
      },
      body: JSON.stringify({
        clientKey,
        baseUrl,
      }),
    });

    const res = await response.text();
    console.log("%cres", "color:cyan; ", res);
  } catch (error) {
    console.log("%cerror", "color:cyan; ", error);
    return;
  }
});

// Mount the static files directory
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

// Atlassian security policy requirements
// http://go.atlassian.com/security-requirements-for-cloud-apps
app.use(nocache());

// Show nicer errors in dev mode
if (devEnv) app.use(errorHandler());

// Wire up routes
routes(app, addon);

// Boot the HTTP server
http.createServer(app).listen(port, () => {
  console.log("App server running at http://" + os.hostname() + ":" + port);

  // Enables auto registration/de-registration of app into a host in dev mode
  if (devEnv) addon.register();
});

function redactJwtTokens(req) {
  const url = req.originalUrl || req.url || "";
  const params = new URLSearchParams(url);
  let redacted = url;
  params.forEach((value, key) => {
    if (key.toLowerCase() === "jwt") {
      redacted = redacted.replace(value, "redacted");
    }
  });
  return redacted;
}
