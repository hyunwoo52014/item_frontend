import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Samplepage8list from "./Samplepage8list";
import ReactPaginate from "react-paginate";

import "./Samplepage8list.css";
import "./SamplePage1.css"; 

const SamplePage8 = () => {
  const [searchinfo, setSearchinfo] = useState({
    pagesize: 3,
    cpage: 1,
    blocksize: 5,
  });

  const [movielist, setMovielist] = useState({
    mlist: [],
    totalcnt: 0,
  });

  const fetchmovielist = useCallback(async () => {
    try {
      const param = new URLSearchParams();
      param.append("pagesize", searchinfo.pagesize);
      param.append("cpage", searchinfo.cpage);

      const res = await axios.post("/movie/movielist", param);
      console.log("Movie List Response:", res.data);

      setMovielist((prev) => ({
        ...prev,
        mlist: res.data.movielist || [],
        totalcnt: res.data.totalcnt,
      }));
    } catch (err) {
      console.error("Error fetching product list:", err);
    }
  }, [searchinfo.cpage, searchinfo.pagesize]);

  useEffect(() => {
    fetchmovielist(); //시작점
  }, [fetchmovielist, searchinfo.cpage, searchinfo.pagesize]);

  const pagebutton = (event) => {
    //searchlist(parseInt(event.selected) + 1);
    setSearchinfo({
      ...searchinfo,
      cpage: parseInt(event.selected) + 1,
    });
  };

  const pagenavicss = {
    margin: "20px 0",
    display: "flex",
    justifycontent: "center",
    alignitems: "center",
    liststyletype: "none",
    padding: "10px",
  };

  return (
    <div>
      <div className="movie-list">
        <h1 style={{ color: "#000000" }}>참조 사이트 :</h1>
        <a
          href="https://www.megabox.co.kr/movie"
          target="_blank"
          rel="noreferrer noopener"
        >
          <h1>메가박스</h1>
        </a>{" "}
      </div>
      <div className="movie-list">
        <h5 style={{ color: "#000000" }}>조회 수 : </h5>
        <select
          style={{ color: "#000000" }}
          value={searchinfo.pagesize}
          onChange={(e) => {
            setSearchinfo({
              ...searchinfo,
              pagesize: e.target.value,
              cpage: 1,
            });
          }}
        >
          <option value="3">3</option>
          <option value="6">6</option>
          <option value="9">9</option>
          <option value="12">12</option>
        </select>
      </div>
      <div>
        <ReactPaginate
          claaaName={pagenavicss}
          breakLabel="..."
          nextLabel="다음 >"
          onClick={pagebutton}
          pageRangeDisplayed={searchinfo.blocksize}
          pageCount={
            movielist.totalcnt % searchinfo.pagesize === 0
              ? parseInt(movielist.totalcnt / searchinfo.pagesize)
              : parseInt(movielist.totalcnt / searchinfo.pagesize) + 1
          }
          previousLabel="< 이전"
          renderOnZeroPageCount={null}
          pageClassName={"pageItem"}
          activeClassName={"currentPagecss"}
          previousClassName={"pageLabelBtn"}
          nextClassName={"pageLabelBtn"}
        />
      </div>
      <br />
      {/*gridTemplateRows, gridTemplateColumns라는 속성으로 그리드를 만들어 준 뒤
         ("1fr 2fr 1fr" => 1 : 2 : 1의 비율이라는 의미!) */}
      <div
        className="movie-list-container"
        style={{
          display: "grid",
          gridTemplateRows: "1fr ",
          gridTemplateColumns: "1fr 1fr 1fr",
        }}
      >
        {movielist.mlist.map((item, index) => {
          return (
            <Samplepage8list key={item.movie_no} item={item} index={index} />
          );
        })}
      </div>
    </div>
  );
};

export default SamplePage8;
