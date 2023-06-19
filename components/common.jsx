import styled from "styled-components";
import { token } from "@atlaskit/tokens";
import TextField from "@atlaskit/textfield";

export const UnstyledButton = styled.button`
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

export const StyledTextField = styled(TextField)`
  padding: ${token("space.1", "6px")};
  > input {
    font-size: 16px;
  }
`;

export const Page = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;
