import React, { useState } from "react";
import axios from "axios";

import "./SamplePage11.css";

const ChatGPT = () => {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (userMessage.trim() === "") return;

    // 사용자의 메시지 추가
    const newMessages = [...messages, { sender: "user", text: userMessage }];
    setMessages(newMessages);

    try {
      await axios
        .post(
          "/chatgpt/connectchatgpt.do",
          { message: userMessage },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log(JSON.stringify(res));
          // 봇의 응답 추가
          setMessages([
            ...newMessages,
            { sender: "bot", text: res.data.response },
          ]);
        })
        .catch((err) => {
          console.log("attachfileproc catch start");
          alert(err.message);
        });
    } catch (error) {
      alert("에러! API 요청에 오류가 있습니다. " + error);
    }

    // 메시지 초기화
    setUserMessage("");
  };

  return (
    <div>
      <p className="conTitle">
        <span>chatGPT</span>
      </p>
      <div className="chat-window">
        {messages.map((message, index) => (
          <div className="message" key={index}>
            <strong>{message.sender === "user" ? "사용자:" : "봇:"}</strong>{" "}
            {message.text}
          </div>
        ))}
      </div>
      <input
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        placeholder="메시지를 입력하세요"
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
};

export default ChatGPT;
