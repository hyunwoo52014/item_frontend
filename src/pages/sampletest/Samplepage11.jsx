import React, { useState } from "react";
import axios from "axios";

import "./SamplePage11.css";

const ChatGPT = () => {
  /*
1. 사람 관련 이모티콘
🙋‍♂️, 🙋‍♀️: 손을 든 사람
👤, 👥: 한 사람, 여러 사람
🧑, 👩, 👨: 일반 사람
🧑‍💻, 👨‍💻, 👩‍💻: 컴퓨터 작업 중인 사람
🕵️‍♂️, 🕵️‍♀️: 탐정
👮‍♂️, 👮‍♀️: 경찰
👨‍🎓, 👩‍🎓: 졸업한 사람
👨‍⚕️, 👩‍⚕️: 의사
👨‍🏫, 👩‍🏫: 교사
2. 로봇 및 기계
🤖: 로봇
💻: 노트북
📡: 안테나
🛠️: 도구(공구)
🔧, 🔨: 공구
🔌: 플러그
📟: 호출기
🕹️: 조이스틱
🖥️: 데스크톱 컴퓨터
3. 감정 표현
😄, 😊, 😀: 미소 짓는 얼굴
😢, 😭: 울고 있는 얼굴
🤔, 😕: 생각하는 얼굴
😎, 🥸: 멋진 표정
😍, 🥰: 사랑스러운 표정
😱, 😨: 놀란 얼굴
🤬, 😠: 화난 얼굴
4. 동물
🐶, 🐱: 개, 고양이
🐻, 🐼: 곰, 판다
🦁, 🐯: 사자, 호랑이
🦊, 🦝: 여우, 너구리
🦄: 유니콘
🐔, 🐧: 닭, 펭귄
5. 음식 및 음료
🍎, 🍏: 사과
🍕: 피자
🍔: 햄버거
🍣: 스시
🍩: 도넛
🍵: 차
☕: 커피
🍺, 🍷: 맥주, 와인
6. 자연
🌞, 🌙: 태양, 달
🌧️, ☔: 비
🌈: 무지개
🌲, 🌴: 나무
🌸, 🌼: 꽃
7. 사물
✏️: 연필
📖: 책
✂️: 가위
🗑️: 쓰레기통
📱: 스마트폰
8. 스포츠 및 활동
⚽, 🏀: 축구공, 농구공
🏓, 🎳: 탁구, 볼링
🏄‍♂️, 🚴‍♀️: 서핑, 자전거 타기
🏋️‍♂️, 🤸‍♀️: 역도, 체조
🎮: 게임 컨트롤러
9. 교통
🚗, 🚌: 자동차, 버스
🚀, ✈️: 로켓, 비행기
🚤, 🛳️: 배
🚲: 자전거
🛴, 🛵: 킥보드, 스쿠터

참고 이모지 : https://emojipedia.org/, https://getemoji.com/
*/

  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);

  let restext = "";

  const sendMessage = async () => {
    if (userMessage.trim() === "") return;

    // 사용자의 메시지 추가
    const newMessages = [...messages, { sender: "user", text: userMessage }];
    setMessages(newMessages);

    let params = new URLSearchParams();
    params.append("sendmsg", userMessage);

    try {
      await axios
        .post("/chatgpt/connectchatgpt.do", params)
        .then((res) => {
          console.log(res);
          // 봇의 응답 추가
          const parsedAnswer = JSON.parse(res.data.answer);
          restext = parsedAnswer.choices[0].message.content;

          setMessages([...newMessages, { sender: "bot", text: restext }]);
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
          <div
            className={`${
              message.sender === "user" ? "user-message" : "chatgpt-message"
            }`}
            key={index}
          >
            <strong>{message.sender === "user" ? "🙋‍♂️ : " : "🤖 : "}</strong>{" "}
            {message.text}
          </div>
        ))}
      </div>
      <input
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        onKeyUp={(e) => e.key === "Enter" && sendMessage()}
        placeholder="메시지를 입력하세요"
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
};

export default ChatGPT;
