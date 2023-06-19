import React, { useState } from "react";
import ArrowRightCircleIcon from "@atlaskit/icon/glyph/arrow-right-circle";
import { token } from "@atlaskit/tokens";
import { B500 } from "@atlaskit/theme/colors";
import Heading from "@atlaskit/heading";
import Image from "@atlaskit/image";
import { PulseLoader } from "react-spinners";

import { delay } from "../utils/test-utils";
import {
  UserBubble,
  BotBubble,
  ChatMessages,
  ChatBubbleContainer,
  FixedFooter,
  SearchBar,
  LogoContainer,
  ChatContainer,
} from "../components/chat";
import { Page, UnstyledButton, StyledTextField } from "../components/common";
import Airplane from "../assets/airplane.png";

const App = () => {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);

  async function onSubmit() {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: messages.length + 1, type: "user", value, isLoading: false },
    ]);

    const nextMessageIndex = messages.length + 1;
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: nextMessageIndex, type: "bot", value, isLoading: true },
    ]);

    await delay();

    setMessages((prevMessages) => {
      return prevMessages.map((message) => {
        if (message.id === nextMessageIndex) {
          return { ...message, isLoading: false };
        }

        return message;
      });
    });
    setValue("");
  }

  return (
    <div style={{ height: "100vh" }}>
      <Page>
        <ChatContainer>
          {messages.length === 0 ? (
            <LogoContainer>
              <Heading level="h900">ProjectPilot</Heading>
              <Image
                src={Airplane}
                style={{ height: "100px", width: "100px" }}
              />
            </LogoContainer>
          ) : (
            <ChatMessages>
              {messages.map((question) => {
                return question.type === "user" ? (
                  <ChatBubbleContainer key={question.id}>
                    <UserBubble>{question.value}</UserBubble>
                  </ChatBubbleContainer>
                ) : (
                  <ChatBubbleContainer key={question.id}>
                    <BotBubble>
                      {question.isLoading ? (
                        <PulseLoader
                          color="white"
                          size={12}
                          speedMultiplier={0.75}
                        />
                      ) : (
                        <>{question.value}</>
                      )}
                    </BotBubble>
                  </ChatBubbleContainer>
                );
              })}
            </ChatMessages>
          )}
        </ChatContainer>
        <FixedFooter>
          <SearchBar>
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
          </SearchBar>
        </FixedFooter>
      </Page>
    </div>
  );
};

export default App;
