import React, { useState, useEffect } from "react";
import "./Samplepage8reserve.css";

const Samplepage8reserve = ({ item, imageurl, closemodal }) => {
  const [daylist, setDaylist] = useState([]);
  const [monthinfo, setMonthinfo] = useState({
    beforemonth: "",
    curmonth: "",
  });

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState("2025.01");
  const movies = [
    { id: 1, age: 15, name: "하얼빈" },
    { id: 2, age: 15, name: "보고타: 마지막 기회의 땅" },
    { id: 3, age: "ALL", name: "러브레터 [30주년 에디션]" },
    { id: 4, age: "ALL", name: "스펙 소닉3" },
    { id: 5, age: 15, name: "동참: 청불입니다" },
  ];

  const theaters = [
    { id: 1, name: "서울", count: 20 },
    { id: 2, name: "경기", count: 31 },
    { id: 3, name: "인천", count: 4 },
    { id: 4, name: "대전/충청/세종", count: 15 },
    { id: 5, name: "부산/대구/경상", count: 24 },
    { id: 6, name: "광주/전라", count: 9 },
    { id: 7, name: "강원", count: 3 },
    { id: 8, name: "제주", count: 3 },
  ];

  const times = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09"];

  const getNext14DaysWithWeekdays = () => {
    const days = [];
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    let beforemonth = "";
    let curmonth = "";

    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i); // 오늘 날짜에 i일 추가

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
      const day = String(date.getDate()).padStart(2, "0");
      const weekday = weekdays[date.getDay()]; // 요일 가져오기

      days.push(`${day} : (${weekday})`);
      curmonth = year + "." + month;
    }

    const bdate = new Date();
    bdate.setMonth(bdate.getMonth() - 1); // 현재 월에서 1개월 빼기

    beforemonth =
      bdate.getFullYear() + "." + String(bdate.getMonth() + 1).padStart(2, "0");

    setMonthinfo((prev) => ({
      ...prev,
      beforemonth: beforemonth,
      curmonth: curmonth,
    }));

    return days;
  };

  useEffect(() => {
    setDaylist(getNext14DaysWithWeekdays());
  }, []);

  return (
    <div className="fast-reservation">
      <h1 className="title">빠른예매</h1>

      {/* Date Tabs */}
      <div className="date-tabs">
        <button
          className={`date-tab ${selectedDate === "2024.12" ? "active" : ""}`}
          onClick={() => setSelectedDate("2024.12")}
        >
          {monthinfo.beforemonth}
        </button>
        <button
          className={`date-tab ${selectedDate === "2025.01" ? "active" : ""}`}
          onClick={() => setSelectedDate("2025.01")}
        >
          {monthinfo.curmonth}
        </button>
        <div className="date-buttons">
          {daylist.map((date, index) => (
            <button key={index}>{date}</button>
          ))}
        </div>
      </div>

      {/* Reservation Columns */}
      <div className="reservation-container">
        {/* Movie List */}
        <div className="column movie-list">
          <h2>영화</h2>
          <ul className="movie-items">
            {movies.map((movie) => (
              <li
                key={movie.id}
                className={`movie-item ${
                  selectedMovie === movie.id ? "selected" : ""
                }`}
                onClick={() => setSelectedMovie(movie.id)}
              >
                <span className={`age-rating age-${movie.age}`}>
                  {movie.age}
                </span>{" "}
                {movie.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Theater List */}
        <div className="column theater-list">
          <h2>극장</h2>
          <div className="theater-category">
            <button className="category-button active">전체</button>
            <button className="category-button">특별관</button>
          </div>
          <ul className="theater-items">
            {theaters.map((theater) => (
              <li key={theater.id}>
                {theater.name} ({theater.count})
              </li>
            ))}
          </ul>
          <div className="info-box">전체극장 목록에서 극장을 선택하세요.</div>
        </div>

        {/* Time List */}
        <div className="column time-list">
          <h2>시간</h2>
          <div className="time-options">
            {times.map((time, index) => (
              <button key={index} className="time-button">
                {time}
              </button>
            ))}
          </div>
          <div className="no-selection">
            <p>
              영화와 극장을 선택하시면 상영시간표를 비교하여 볼 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Samplepage8reserve;
