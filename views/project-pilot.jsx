import React, { useState, useEffect } from "react";
import ArrowRightCircleIcon from "@atlaskit/icon/glyph/arrow-right-circle";
import { token } from "@atlaskit/tokens";
import { B500, N50 } from "@atlaskit/theme/colors";
import Heading from "@atlaskit/heading";
import Image from "@atlaskit/image";
import { PulseLoader } from "react-spinners";
import { v4 as uuidv4 } from "uuid";

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
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);

  async function onSubmit() {
    setMessages((prevMessages) => {
      return [
        ...prevMessages,
        {
          id: uuidv4(),
          type: "user",
          value: query,
          isLoading: false,
        },
      ];
    });

    AP.context.getToken(function (token) {
      const botMessageId = uuidv4();
      setMessages((prevMessages) => {
        return [
          ...prevMessages,
          {
            id: botMessageId,
            type: "bot",
            value: "",
            isLoading: true,
          },
        ];
      });

      fetch("/ask", {
        method: "POST",
        headers: {
          Authorization: "JWT " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, messages }),
      })
        .then((response) => response.json())
        .then((data) => {
          setMessages((prevMessages) => {
            return prevMessages.map((message) => {
              if (message.id === botMessageId) {
                return { ...message, value: data.answer, isLoading: false };
              }

              return message;
            });
          });
        })
        .catch((_) => {
          setMessages((prevMessages) => {
            return prevMessages.map((message) => {
              if (message.id === botMessageId) {
                return {
                  ...message,
                  value:
                    "We apologize, but there was an issue processing your request. Could you kindly try again? If the problem persists, we're here to help. Please reach out to our support team at support@redelklabs.com, and we'll promptly assist you.",
                  isLoading: false,
                };
              }

              return message;
            });
          });
        });
    });

    setQuery("");
  }

  const isLoading = messages.some((message) => message.isLoading);
  const isDisabled = !query || isLoading;

  useEffect(() => {
    window.scroll({
      top: document.body.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
  }, [messages]);

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
            <ChatMessages id="chat-messages">
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
                        <div
                          dangerouslySetInnerHTML={{ __html: question.value }}
                        />
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
              onChange={(event) => setQuery(event.target.value)}
              onKeyPress={(event) => {
                if (query && event.key === "Enter") {
                  onSubmit();
                }
              }}
              value={query}
              placeholder="Send a message"
              elemAfterInput={
                <UnstyledButton disabled={isDisabled} onClick={onSubmit}>
                  <ArrowRightCircleIcon
                    size="large"
                    primaryColor={
                      isDisabled
                        ? token("color.chart.neutral", N50)
                        : token("color.icon.brand", B500)
                    }
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
