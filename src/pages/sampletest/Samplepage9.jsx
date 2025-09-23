import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Model from "react-modal";
import Samplepage9popup from "./Samplepage9popup";
import "./SamplePage1.css";

const Samplepage9 = () => {
  // 변수, 함수 잡는 영역

  const [searcharea, setSearcharea] = useState({
    searchloginID: "",
    susertype: "",
    ssdate: "",
    sedate: "",
    currentpage: 1,
    pagesize: 10,
    blacksize: 10,
  });

  const [listdata, setListdata] = useState({
    userlist: [],
    totalcnt: 0,
    pagenumcnt: 0,
  });

  const [modalflag, setModalflag] = useState({
    isOpen: false,
    action: "",
    item: Object,
  });

  const pagebutton = (event) => {
    // alert(event.selected);
    searchlist(parseInt(event.selected) + 1);
  };

  const searchlist = useCallback(
    async (cpage) => {
      cpage = cpage || 1;

      console.log(cpage);

      const param = new URLSearchParams(Object.entries(searcharea));
      param.set("currentpage", cpage);

      /*
    const param = new URLSearchParams();
    param.append("currentpage", cpage);
    param.append("searchloginID", searcharea.searchloginID);
    param.append("searchusertype", searcharea.searchusertype);
    param.append("searchStartdate", searcharea.searchStartdate);
    param.append("searchEnddate", searcharea.searchEnddate);
    param.append("pagesize", searcharea.pagesize);
    */

      await axios
        .post("/usermgr/userListvue.do", param)
        .then((res) => {
          console.log(res);

          setSearcharea((prev) => ({ ...prev, currentpage: cpage }));

          setListdata({
            ...listdata,
            userlist: res.data.listdate,
            totalcnt: res.data.totalcnt,
            pagenumcnt:
              res.data.totalcnt % searcharea.pagesize === 0
                ? res.data.totalcnt / searcharea.pagesize
                : parseInt(res.data.totalcnt / searcharea.pagesize) + 1,
          });
        })
        .catch((err) => {
          console.log("attachfileproc catch start");
          alert(err.message);
        });
    },
    [
      searcharea.searchloginID,
      searcharea.susertype,
      searcharea.ssdate,
      searcharea.sedate,
    ]
  );

  useEffect(() => {
    searchlist();
  }, [
    searcharea.searchloginID,
    searcharea.susertype,
    searcharea.ssdate,
    searcharea.sedate,
    searchlist,
  ]);

  const newReg = () => {
    setModalflag((prev) => ({
      ...prev,
      isOpen: true,
      action: "I",
    }));
  };

  const modify = (item) => {
    setModalflag((prev) => ({
      ...prev,
      isOpen: true,
      action: "U",
      item: item,
    }));
  };

  const closeModal = (flag) => {
    setModalflag((prev) => ({
      ...prev,
      isOpen: false,
    }));

    if (flag) searchlist();
  };

  const searchstyle = {
    fontsize: "15px",
    fontweight: "bold",
  };

  const searchstylewidth = {
    height: "28px",
    width: "200px",
  };

  const modalStyle = {
    content: {
      top: "50%", // 모달 창의 상단 위치를 뷰포트 기준으로 50%로 설정.
      left: "50%", // 모달 창의 왼쪽 위치를 뷰포트 기준으로 50%로 설정.
      right: "auto", // 오른쪽 위치는 자동으로 설정 (좌우 비율 무시).
      bottom: "auto", // 하단 위치는 자동으로 설정 (상하 비율 무시).
      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", // 모달 창에 그림자를 추가해 입체감을 부여.
      transform: "translate(-50%, -50%)", // 모달 창을 정확히 가운데로 배치하기 위해 사용.
    },
  };

  const pagenavicss = {
    margin: "20px 0",
    display: "flex",
    justifycontent: "center",
    alignitems: "center",
    liststyletype: "none",
    padding: "10px",
  };

  const pageItem = {
    display: "flex",
    justifycontent: "center",
    alignitems: "center",
    width: "40px",
    height: "40px",
    padding: "10px",
    borderradius: "50%",
    cursor: "pointer",
    textalign: "center",
  };

  const currentPagecss = {
    textalign: "center",
    color: "white",
    backgroundcolor: "blue",
  };

  const pageLabelBtn = {
    margin: "0 15px",
    fontsize: "20px",
    color: "tellow",
  };

  return (
    <div className="content">
      <p className="conTitle">
        <span>사용자관리 </span>{" "}
        <span className="fr">
          <span style={searchstyle}>loginID </span>
          <input
            type="text"
            id="searchloginID"
            name="searchloginID"
            className="form-control"
            style={{ width: 150 }}
            placeholder=""
            value={searcharea.searchloginID}
            onChange={(e) => {
              setSearcharea((prev) => ({
                ...prev,
                searchloginID: e.target.value,
              }));
            }}
          />
          <span style={searchstyle}>사용자구분 &nbsp; </span>
          <select
            id="searchusertype"
            name="searchusertype"
            style={{ width: 80 }}
            value={searcharea.susertype}
            onChange={(e) => {
              setSearcharea((prev) => ({ ...prev, susertype: e.target.value }));
            }}
          >
            <option value="">전체</option>
            <option value="A">관리자</option>
            <option value="B">사용자</option>
          </select>
          <span style={searchstyle}>등록일자 &nbsp; </span>
          <input
            type="date"
            id="searchStartdate"
            name="searchStartdate"
            className="form-control"
            style={{ width: 150 }}
            placeholder="2025.01.01"
            value={searcharea.ssdate}
            onChange={(e) => {
              setSearcharea((prev) => ({ ...prev, ssdate: e.target.value }));
            }}
          />
          ~
          <input
            type="date"
            id="searchEnddate"
            name="searchEnddate"
            className="form-control"
            style={{ width: 150 }}
            placeholder="2025.12.31"
            value={searcharea.sedate}
            onChange={(e) => {
              setSearcharea((prev) => ({ ...prev, sedate: e.target.value }));
            }}
          />
          <button
            className="btn btn-primary"
            name="searchbtn"
            id="searchbtn"
            onClick={() => searchlist()}
          >
            <span>검색</span>
          </button>
          <button
            className="btn btn-primary"
            name="newReg"
            id="newReg"
            onClick={() => newReg()}
          >
            <span>신규등록</span>
          </button>
        </span>
      </p>

      <div>
        <br />
        <br />
        <br />
        <b>
          총건수 : {listdata.totalcnt} 현재 페이지 번호 :{" "}
          {searcharea.currentpage} : {searcharea.searchloginID} :{" "}
          {searcharea.susertype} : {searcharea.ssdate} : {searcharea.sedate}
        </b>
        <table className="col">
          <colgroup>
            <col width="15%" />
            <col width="15%" />
            <col width="25%" />
            <col width="25%" />
            <col width="20%" />
          </colgroup>
          <thead>
            <tr>
              <th>LoginID</th>
              <th>사용자구분</th>
              <th>이름</th>
              <th>연락처</th>
              <th>등록일자</th>
            </tr>
          </thead>
          <tbody>
            {listdata.totalcnt === 0 ? (
              <tr>
                <td colSpan="5"> 조회된 데이터가 없습니다.</td>
              </tr>
            ) : (
              listdata.userlist.map((item, index) => {
                return (
                  <tr key={index} onClick={() => modify(item)}>
                    <td>{item.loginID}</td>
                    <td>{item.user_type}</td>
                    <td>{item.name}</td>
                    <td>{item.hp}</td>
                    <td>{item.regdate}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <br />
        <ReactPaginate
          claaaName={pagenavicss}
          breakLabel="..."
          nextLabel="다음 >"
          onClick={pagebutton}
          pageRangeDisplayed={searcharea.blocksize}
          pageCount={listdata.pagenumcnt}
          previousLabel="< 이전"
          renderOnZeroPageCount={null}
          pageClassName={"pageItem"}
          activeClassName={"currentPagecss"}
          previousClassName={"pageLabelBtn"}
          nextClassName={"pageLabelBtn"}
        />
      </div>

      <Model
        isOpen={modalflag.isOpen}
        style={modalStyle}
        onRequestClose={closeModal}
        ariaHideApp={false}
      >
        <Samplepage9popup
          title={modalflag.action === "I" ? "사용자 등록" : "사용자 수정"}
          closeModal={closeModal}
          modalflag={modalflag}
        />
      </Model>
    </div>
  );
};

export default Samplepage9;
