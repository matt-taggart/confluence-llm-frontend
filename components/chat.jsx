import styled from "styled-components";
import { token } from "@atlaskit/tokens";
import { B300, N100 } from "@atlaskit/theme/colors";

export const ChatContainer = styled.div`
  margin: 0 auto;
  width: 70vw;
  textalign: center;
  height: 100%;
`;

export const ChatBubbleContainer = styled.div`
  display: flex;
  margin: 1rem auto;
`;

export const UserBubble = styled.div`
  font-size: 16px;
  margin-bottom: 8px;
  padding: 13px 14px;
  border-radius: 5px;
  color: white;
  background: ${token("color.background.selected.bold", B300)};
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 75px;
`;

export const BotBubble = styled.div`
  font-size: 16px;
  margin-bottom: 8px;
  padding: 13px 14px;
  border-radius: 5px;
  color: white;
  margin-left: auto;
  background: ${token("color.chart.neutral", N100)};
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 75px;
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
