import fetch from "node-fetch";

export default function routes(app, addon) {
  // Redirect root path to /atlassian-connect.json,
  // which will be served by atlassian-connect-express.
  app.get("/", (req, res) => {
    res.redirect("/atlassian-connect.json");
  });

  // This is an example route used by "generalPages" module (see atlassian-connect.json).
  // Verify that the incoming request is authenticated with Atlassian Connect.
  app.get("/project-pilot", addon.authenticate(), (req, res) => {
    // Rendering a template is easy; the render method takes two params: the name of the component or template file, and its props.
    // Handlebars and jsx are both supported, but please note that jsx changes require `npm run watch-jsx` in order to be picked up by the server.
    res.render(
      "project-pilot.jsx", // change this to 'hello-world.jsx' to use the Atlaskit & React version
      {
        title: "Atlassian Connect",
        //, issueId: req.query['issueId']
        browserOnly: true, // you can set this to disable server-side rendering for react views
      }
    );
  });

  app.post("/ask", addon.authenticate(true), async (req, res) => {
    try {
      const clientKey = req.context.clientKey;
      const ctxToken = req.context.token;
      const response = await fetch("http://127.0.0.1:5000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ctxToken}`,
          "x-project-pilot-api-key": process.env.PROJECT_PILOT_API_KEY,
        },
        body: JSON.stringify({ ...req.body, clientKey }),
      });

      if (!response.ok) {
        res.status(response.status).send({ message: "Invalid request" });
        return;
      }

      const { answer } = await response.json();

      res.send({ answer: answer });
    } catch (error) {
      res.status(500).send({ message: "Something went wrong" });
    }
  });
}
