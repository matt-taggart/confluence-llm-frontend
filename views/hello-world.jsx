import React from "react";
import styled from "styled-components";

import TextField from "@atlaskit/textfield";
import ArrowRightCircleIcon from "@atlaskit/icon/glyph/arrow-right-circle";
import { token } from "@atlaskit/tokens";
import { B500 } from "@atlaskit/theme/colors";
import Heading from "@atlaskit/heading";

const StyledTextField = styled(TextField)`
  // container style
  padding: ${token("space.1", "6px")};
  > input {
    font-size: 16px;
  }
`;

const FormFieldExample = () => (
  <div
    style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      alignItems: "space-around",
    }}
  >
    <div style={{ margin: "0 auto", width: "70vw", textAlign: "center" }}>
      <Heading level="h900">ProjectPilot</Heading>
    </div>
    <div
      style={{
        position: "absolute",
        bottom: 20,
        width: "100%",
      }}
    >
      <div style={{ width: "70vw", margin: "0 auto" }}>
        <StyledTextField
          placeholder="Send a message"
          elemAfterInput={
            <ArrowRightCircleIcon
              primaryColor={token("color.icon.brand", B500)}
              label="end"
            />
          }
        />
      </div>
    </div>
  </div>
);

export default FormFieldExample;