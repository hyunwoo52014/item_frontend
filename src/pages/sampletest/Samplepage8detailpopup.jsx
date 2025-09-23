import { useState, useRef } from "react";
// import axios from "axios";

import "./Samplepage8detailpopup.css";

const Samplepage8detailpopup = ({
  item, 
  imageurl,
  closemodal,
  openreserve,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const descriptionRef = useRef(null);

  const handleToggleDescription = () => {
    setShowFullDescription((prev) => !prev);
    // 상태(showFullDescription)가 변경된 후 DOM이 업데이트되기까지 약간의 시간이 필요
    // setTimeout을 사용해 DOM 업데이트가 완료된 후 scrollIntoView를 호출하도록 보장
    // 여기서 DOM 업데이트 란 접은 상태 혹은 펼친 상태의 Html 랜더링 업데이트
    setTimeout(() => {
      if (descriptionRef.current) {
        descriptionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };

  //부모창에 전달
  const movereserve = () => {
    closemodal();
    openreserve();
  };

  return (
    <div className="movie-detail">
      <div className="background-overlay">
        <div className="movie-info-container">
          <div className="text-content">
            <div className="reservation-status">
              <span className="status-badge">{item.genre_nm}</span>
            </div>
            <h1 className="movie-title">{item.movie_name}</h1>
            <h2 className="movie-subtitle">{item.appearance}</h2>
            <div className="social-actions">
              <div className="likes">
                <span className="heart">♡</span>
                <span className="like-count">{item.like_num}</span>
              </div>
              <button className="share-button">공유하기</button>
            </div>
            <div className="additional-info">
              <div className="info-block">
                <span className="label">예매율</span>
                <span className="value">23.1 %</span>
              </div>
              <div className="info-block">
                <span className="label">누적관객수</span>
                <span className="value">20.3 k</span>
              </div>
              <button className="reserve-button" onClick={movereserve}>
                예매
              </button>
            </div>
          </div>
          <div className="poster-section">
            <img
              src={imageurl}
              alt={item.movie_name}
              className="poster-image"
            />{" "}
          </div>
        </div>

        <div className="movie-description" style={{ color: "#000000" }}>
          <button
            className="more-button"
            onClick={handleToggleDescription}
            ref={descriptionRef}
          >
            {showFullDescription ? "접기 ▴" : "더보기 ▾"}
          </button>
          <div style={{ height: 10 }}>
            <p className="sub-description">{item.summary}</p>
          </div>

          {showFullDescription && (
            <div className="expanded-description" ref={descriptionRef}>
              <p>{item.summary}</p>
              <div className="movie-details">
                <p>
                  <strong>상영타입 :</strong> {item.movie_type_nm}
                </p>
                <p>
                  <strong>감독 :</strong> {item.movie_director} &nbsp;&nbsp;
                  <strong>장르 :</strong> {item.genre_nm} / {item.runing_time}분
                  &nbsp;&nbsp;
                  <strong>등급 :</strong>{" "}
                  {(function () {
                    if (item.movie_age >= 18) return "18세 이상";
                    if (item.movie_age >= 15) return "15세 이상";
                    if (item.movie_age >= 12) return "12세 이상";
                    if (item.movie_age === 0) return "전체 관람가";
                  })()}{" "}
                  &nbsp;&nbsp;
                  <strong>개봉일 :</strong> {item.open_date}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Samplepage8detailpopup;
