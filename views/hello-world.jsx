import React, { useState } from "react";
import styled from "styled-components";

import TextField from "@atlaskit/textfield";
import ArrowRightCircleIcon from "@atlaskit/icon/glyph/arrow-right-circle";
import { token } from "@atlaskit/tokens";
import { B500 } from "@atlaskit/theme/colors";
import Heading from "@atlaskit/heading";
import Image from "@atlaskit/image";

import Airplane from "../assets/airplane.png";

const StyledTextField = styled(TextField)`
  // container style
  padding: ${token("space.1", "6px")};
  > input {
    font-size: 16px;
  }
`;

const UnstyledButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  cursor: pointer;
  font: inherit;
  outline: inherit;

  &:hover {
    cursor: pointer;
  }
`;

const App = () => {
  const [value, setValue] = useState("");
  console.log("%cvalue", "color:cyan; ", value);

  function onSubmit() {
    console.log("click");
    setValue("");
  }

  return (
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
      <div
        style={{
          margin: "0 auto",
          width: "70vw",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Heading level="h900">ProjectPilot</Heading>
          <Image src={Airplane} style={{ height: "100px", width: "100px" }} />
        </div>
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
            onChange={(event) => setValue(event.target.value)}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                onSubmit();
              }
            }}
            value={value}
            placeholder="Send a message"
            elemAfterInput={
              <UnstyledButton onClick={onSubmit}>
                <ArrowRightCircleIcon
                  size="large"
                  primaryColor={token("color.icon.brand", B500)}
                  label="end"
                />
              </UnstyledButton>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default App;
