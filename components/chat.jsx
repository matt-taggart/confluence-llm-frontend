import styled from "styled-components";
import { token } from "@atlaskit/tokens";
import { B300, N30 } from "@atlaskit/theme/colors";

export const ChatContainer = styled.div`
  margin: 0 auto;
  width: 70vw;
  height: 100%;
`;

export const ChatBubbleContainer = styled.div`
  display: flex;
  margin: 1rem auto;
`;

const BaseBubble = styled.div`
  font-size: 16px;
  margin-bottom: 8px;
  padding: 13px 14px;
  border-radius: 5px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 75px;
  max-width: 60%;
`;

export const UserBubble = styled(BaseBubble)`
  margin-left: auto;
  background: ${token("color.background.selected.bold", B300)};
`;

export const BotBubble = styled(BaseBubble)`
  color: rgba(0, 0, 0, 0.8);
  background: ${token("color.chart.neutral", N30)};
  a {
    color: blue;
  }
`;

export const ChatMessages = styled.div`
  padding: 2rem 0 6rem 0;
`;

export const FixedFooter = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  background: white;
`;

export const SearchBar = styled.div`
  margin: 0 15vw 1rem 15vw;
  background: white;
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
