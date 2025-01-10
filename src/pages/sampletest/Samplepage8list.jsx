import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Modal from "react-modal";

import "./Samplepage8list.css";
import Samplepage8detailpopup from "./Samplepage8detailpopup";
import Samplepage8reserve from "./Samplepage8reserve";

const Samplepage8list = ({ item, index }) => {
  const [imageurl, setImageurl] = useState("");

  const [isopen, setIsopen] = useState(false);

  const [risopen, setRisopen] = useState(false);

  const imageroad = useCallback(async () => {
    try {
      const param = new URLSearchParams();
      param.append("movie_no", item.movie_no);

      const res = await axios.post("/movie/imageblob", param, {
        responseType: "blob",
      });

      setImageurl(window.URL.createObjectURL(res.data));
    } catch (err) {
      console.error("Error fetching product list:", err);
    }
  }, [item]);

  useEffect(() => {
    imageroad();
  }, [item, imageroad]);

  const modalStyle = {
    content: {
      width: "800px", // 팝업 너비
      height: "700px", // 높이를 내용에 맞게 자동 조정
      margin: "auto", // 중앙 정렬
      maxHeight: "90vh", // 최대 높이를 화면 높이에 맞게 제한
      padding: "0px", // 내부 여백
      backgroundColor: "#fff", // 배경 흰색
      border: "2px", // 테두리 제거
      solid: "#000",
      borderRadius: "8px", // 둥근 모서리
      boxShadow: "none",
      overflow: true, // 내용이 넘치면 스크롤 활성화
    },
    overlay: {
      backgroundColor: "transparent", // 외부 배경 투명화
      display: "flex", // 팝업 중앙 정렬
      alignItems: "center", // 수직 중앙 정렬
      justifyContent: "center", // 수평 중앙 정렬
    },
  };

  const rmodalStyle = {
    content: {
      width: "1200px", // 팝업 너비
      height: "800px", // 높이를 내용에 맞게 자동 조정
      margin: "auto", // 중앙 정렬
      maxHeight: "90vh", // 최대 높이를 화면 높이에 맞게 제한
      padding: "0px", // 내부 여백
      backgroundColor: "#fff", // 배경 흰색
      border: "2px", // 테두리 제거
      solid: "#000",
      borderRadius: "8px", // 둥근 모서리
      boxShadow: "none",
      overflow: true, // 내용이 넘치면 스크롤 활성화
    },
    overlay: {
      backgroundColor: "transparent", // 외부 배경 투명화
      display: "flex", // 팝업 중앙 정렬
      alignItems: "center", // 수직 중앙 정렬
      justifyContent: "center", // 수평 중앙 정렬
    },
  };

  const openpopup = () => {
    setIsopen(true);
  };

  const closemodal = () => {
    setIsopen(false);
  };

  const ropenpopup = () => {
    setRisopen(true);
  };

  const rclosemodal = () => {
    setRisopen(false);
  };

  return (
    <div>
      <div className="movie-card">
        <div className="rank">1</div>
        <div className="poster">
          <img src={imageurl} alt={item.movie_name} />
          <p className="quick-view">
            {item.summary}
            <button style={{ color: "#000000" }} onClick={openpopup}>
              상세보기
            </button>
          </p>
        </div>

        <div className="movie-info">
          <div className="age-rating">
            {(function () {
              if (item.movie_age >= 18) return "18";
              if (item.movie_age >= 15) return "15";
              if (item.movie_age >= 12) return "12";
              if (item.movie_age === 0) return "ALL";
            })()}
          </div>
          <h2 className="title">{item.movie_name}</h2>
          <p className="details">예매율 28.9% / 개봉일 {item.open_date}</p>
        </div>
        <div className="actions">
          <div className="like">
            <span className="heart">♡</span>
            <span className="like-count">{item.like_num}</span>
          </div>
          <button className="reserve-button" onClick={ropenpopup}>
            예매
          </button>
        </div>
      </div>
      <Modal style={modalStyle} isOpen={isopen} onRequestClose={closemodal}>
        <Samplepage8detailpopup
          item={item}
          imageurl={imageurl}
          closemodal={closemodal}
          openreserve={ropenpopup}
        />
      </Modal>
      <Modal style={rmodalStyle} isOpen={risopen} onRequestClose={rclosemodal}>
        <Samplepage8reserve
          item={item}
          imageurl={imageurl}
          closemodal={rclosemodal}
        />
      </Modal>
    </div>
  );
};

export default Samplepage8list;
