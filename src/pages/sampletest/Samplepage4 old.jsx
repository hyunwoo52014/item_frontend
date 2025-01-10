import React, { useState, useEffect, useRef, use } from "react";

import "./SamplePage1.css";
import axios from "axios";
import Modal from "react-modal";
import ReactPaginate from "react-paginate";

const SamplePage4 = () => {
  const [stype, setStype] = useState("");
  const [searchword, setSearchword] = useState("");
  const [useyn, setUseyn] = useState("");
  const [cpage, setCpage] = useState(1);
  const [pagesize] = useState(5);
  const [listtable, setListtable] = useState([]);
  const [totalcnt, setTotalcnt] = useState(0);

  const [dcpage, setDcpage] = useState(1);
  const [dlisttable, setDlisttable] = useState([]);
  const [dtotalcnt, setDtotalcnt] = useState(0);
  // const [sgroupcode, setSgroupcode] = useState('')

  // 모달
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [dmodalIsOpen, setDmodalIsOpen] = useState(false);

  const [igroupcode, setIgroupcode] = useState("");
  const [igroupname, setIgroupname] = useState("");
  const [inote, setInote] = useState("");
  const [iuseyn, setIuseyn] = useState("Y");
  const [modtype, setModtype] = useState(true);
  const [delyn, setDelyn] = useState("");

  const [readonly, setReadonly] = useState(false);

  const [data, setData] = useState(0);
  const [ddata, setDdata] = useState(0);

  const detail = useRef("");

  const [dmodtype, setDmodtype] = useState(true);
  const [idetailcode, setIdetailcode] = useState("");
  const [idetailname, setIdetailname] = useState("");
  const [idnote, setIdnote] = useState("");
  const [dreadonly, setDreadonly] = useState(false);
  const [iduseyn, setIduseyn] = useState("Y");

  useEffect(() => {
    search();
    console.log("useEffect 동작");
    console.log(data);
  }, [data]);

  useEffect(() => {
    detailcodelist();
    console.log("useEffect 동작");
    console.log(ddata);
  }, [ddata]);

  const searchpage = (data) => {
    data = data || 1;
    setData(data);
    setCpage(data);
    search();
  };

  const search = async () => {
    //alert(stype + ' : ' + searchword + ' : ' + useyn)
    let params = new URLSearchParams();
    params.append("stype", stype);
    params.append("searchword", searchword);
    params.append("useyn", useyn);
    params.append("cpage", cpage);
    params.append("pagesize", pagesize);

    await axios
      .post("/system/listgroupcode", params)
      .then((res) => {
        console.log(res);

        setListtable(res.data.commcodeModel);
        setTotalcnt(res.data.totalcnt);
      })
      .catch((err) => {
        console.log("noticeUpdate catch start");
        alert(err.message);
      });
  };

  const newreg = () => {
    setModtype(true);
    setReadonly(false);
    setIgroupcode("");
    setIgroupname("");
    setInote("");
    setIuseyn("Y");

    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const modify = async (e) => {
    //alert(e.target.id)

    let params = new URLSearchParams();
    params.append("groupcode", e.target.id);

    await axios
      .post("/system/selectgroupcode", params)
      .then((res) => {
        console.log(res);

        setIgroupcode(res.data.commcodeModel.group_code);
        setIgroupname(res.data.commcodeModel.group_name);
        setInote(res.data.commcodeModel.note);
        setIuseyn(res.data.commcodeModel.use_yn);
        setDelyn(res.data.commcodeModel.delyn);
        setReadonly(true);
        setModtype(false);
        setModalIsOpen(true);
      })
      .catch((err) => {
        console.log("noticeUpdate catch start");
        alert(err.message);
      });
  };

  const modalStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const save = async (proc) => {
    //alert(igroupcode + ' : ' + igroupname + ' : ' + inote + ' : ' + iuseyn)

    let params = new URLSearchParams();
    params.append("igroupcode", igroupcode);
    params.append("igroupname", igroupname);
    params.append("inote", inote);
    params.append("iuseyn", iuseyn);

    if (modtype) {
      params.append("action", "I");
    } else {
      if (proc === "D") {
        params.append("action", "D");
      } else {
        params.append("action", "U");
      }
    }

    await axios
      .post("/system/savegroupcode", params)
      .then((res) => {
        console.log(res);

        if (res.data.result === "SUCCESS") {
          alert("저장 되었습니다.");
          closeModal();
          search();
        } else {
          alert(res.data.resultmsg);
        }
      })
      .catch((err) => {
        console.log("noticeUpdate catch start");
        alert(err.message);
      });
  };

  const del = () => {
    if (delyn === "N") {
      alert("상세 코드가 있어 삭제 할수 없습니다.");
      return;
    }

    save("D");
  };

  const dsearchpage = (cpage) => {
    setDcpage(cpage);
    setDdata(cpage);
    detailcodelist();
  };

  const dsearch = (e) => {
    //alert(e.target.id)

    detail.current = e.target.id;
    // setSgroupcode(e.target.id)
    detailcodelist();
  };

  const detailcodelist = async () => {
    //alert(e.target.id)

    if (detail.current === "") return;

    let params = new URLSearchParams();
    params.append("groupcode", detail.current);
    params.append("cpage", dcpage);
    params.append("pagesize", pagesize);

    await axios
      .post("/system/listdetailcode", params)
      .then((res) => {
        console.log(res);

        if (res.data.result === "Y") {
          setDlisttable(res.data.commcodeModel);
          setDtotalcnt(res.data.totalcnt);

          if (res.data.totalcnt === 0) {
            alert("상세 코드가 없습니다.");
          }
        } else {
          alert("조회 중 오류 발생 했습니다.");
        }
      })
      .catch((err) => {
        console.log("noticeUpdate catch start");
        alert(err.message);
      });
  };

  const dnewreg = () => {
    setDmodtype(true);
    setReadonly(true);
    setDreadonly(false);
    setIgroupcode(detail.current);
    setIdetailcode("");
    setIdetailname("");
    setIdnote("");
    setIduseyn("Y");

    setDmodalIsOpen(true);
  };

  const dcloseModal = () => {
    setDmodalIsOpen(false);
  };

  const dsave = async (proc) => {
    let params = new URLSearchParams();
    params.append("igroupcode", igroupcode);
    params.append("idetailcode", idetailcode);
    params.append("idetailname", idetailname);
    params.append("idnote", idnote);
    params.append("iduseyn", iduseyn);

    if (dmodtype) {
      params.append("action", "I");
    } else {
      if (proc === "D") {
        params.append("action", "D");
      } else {
        params.append("action", "U");
      }
    }

    await axios
      .post("/system/savedetailcode", params)
      .then((res) => {
        console.log(res);

        if (res.data.result === "SUCCESS") {
          alert("저장 되었습니다.");
          dcloseModal();
          detailcodelist();
        } else {
          alert(res.data.resultmsg);
        }
      })
      .catch((err) => {
        console.log("noticeUpdate catch start");
        alert(err.message);
      });
  };

  const dmodify = async (e) => {
    alert(e.target.id);

    setIgroupcode(detail.current);

    let params = new URLSearchParams();
    params.append("groupcode", detail.current);
    params.append("detailcode", e.target.id);

    await axios
      .post("/system/selectdetailcode", params)
      .then((res) => {
        console.log(res);

        setIgroupcode(res.data.commcodeModel.group_code);
        setIdetailcode(res.data.commcodeModel.detail_code);
        setIdetailname(res.data.commcodeModel.detail_name);

        setIdnote(res.data.commcodeModel.note);
        setIduseyn(res.data.commcodeModel.use_yn);

        setDreadonly(true);
        setReadonly(true);
        setDmodtype(false);
        setDmodalIsOpen(true);
      })
      .catch((err) => {
        console.log("noticeUpdate catch start");
        alert(err.message);
      });
  };

  const ddel = () => {
    dsave("D");
  };

  return (
    <>
      <div className="content">
        <p className="conTitle">
          <span> 공통 코드</span>{" "}
          <span className="fr" style={{ textAlign: "left", display: "block" }}>
            <select
              id="stype"
              name="stype"
              onChange={(e) => {
                setStype(e.target.value);
              }}
            >
              <option value="">전체</option>
              <option value="code">코드</option>
              <option value="name">코드명</option>
            </select>
            <input
              type="text"
              className="form-control"
              id="searchword"
              name="searchword"
              style={{ width: 150 }}
              onChange={(e) => {
                setSearchword(e.target.value);
              }}
            />{" "}
            사용 여부
            <select
              id="useyn"
              name="useyn"
              onChange={(e) => {
                setUseyn(e.target.value);
              }}
            >
              <option value="">전체</option>
              <option value="Y">사용</option>
              <option value="N">미사용</option>
            </select>
            <a
              className="btn btn-primary mx-2"
              id="btnSearchGrpcod"
              name="btn"
              onClick={search}
            >
              <span> 검 색 </span>{" "}
            </a>{" "}
            <a className="btn btn-light mx-2" name="modal" onClick={newreg}>
              {" "}
              <span> 신규등록 </span>{" "}
            </a>{" "}
          </span>{" "}
        </p>{" "}
        <div style={{ marginTop: "50px" }}>
          <span>
            총건수 : {totalcnt} 현재 페이지번호 : {cpage}
          </span>
          <table className="col">
            <thead>
              <tr>
                <th scope="col"> 그룹 코드 </th>
                <th scope="col"> 그룸 명 </th> <th scope="col"> 사용 여부 </th>
                <th scope="col"></th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody>
              {" "}
              {listtable.map((list, index) => {
                return (
                  <tr>
                    <td id={list.group_code} onClick={dsearch}>
                      {" "}
                      {list.group_code}{" "}
                    </td>
                    <td> {list.group_name} </td>
                    <td> {list.use_yn} </td>
                    <td>
                      {" "}
                      <button id={list.group_code} onClick={modify}>
                        수정{" "}
                      </button>
                    </td>{" "}
                  </tr>
                );
              })}{" "}
            </tbody>{" "}
          </table>{" "}
          {/* 페이징 처리 */}{" "}
          <div>
            {" "}
            {[...Array(Math.ceil(totalcnt / pagesize))].map((n, index) => {
              let data = index + 1;
              return (
                <button
                  style={{ width: "30px", marginLeft: "5px" }}
                  onClick={() => searchpage(data)}
                >
                  {" "}
                  {index + 1}{" "}
                </button>
              );
            })}{" "}
          </div>{" "}
        </div>{" "}
        <div style={{ marginTop: "50px" }}>
          <span>
            총건수 : {dtotalcnt} 현재 페이지번호 : {dcpage}
            <span className="fr">
              <a className="btn btn-light mx-2" name="modal" onClick={dnewreg}>
                {" "}
                <span> 신규등록 </span>{" "}
              </a>{" "}
            </span>{" "}
          </span>
          <table className="col">
            <thead>
              <tr>
                <th scope="col"> 살세 코드 </th>
                <th scope="col"> 상세코드 명 </th>
                <th scope="col"> 사용 여부 </th>
                <th scope="col"> 등록자 </th>
                <th scope="col"></th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody>
              {" "}
              {dlisttable.map((list, index) => {
                return (
                  <tr>
                    <td> {list.detail_code}</td>
                    <td> {list.detail_name} </td>
                    <td> {list.use_yn} </td>
                    <td> {list.regId} </td>
                    <td>
                      {" "}
                      <button id={list.detail_code} onClick={dmodify}>
                        수정{" "}
                      </button>
                    </td>{" "}
                  </tr>
                );
              })}{" "}
            </tbody>{" "}
          </table>{" "}
          {/* 페이징 처리 */}{" "}
          <div>
            {" "}
            {[...Array(Math.ceil(dtotalcnt / pagesize))].map((n, index) => {
              let data = index + 1;
              return (
                <button
                  style={{ width: "30px", marginLeft: "5px" }}
                  onClick={() => dsearchpage(data)}
                >
                  {" "}
                  {index + 1}{" "}
                </button>
              );
            })}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <Modal
        style={modalStyle}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
      >
        <br />

        <table className="row modal-content">
          <tbody>
            <tr>
              <th>그룹코드</th>
              <td>
                <input
                  type="text"
                  id="group_code"
                  name="group_code"
                  value={igroupcode}
                  readOnly={readonly}
                  onChange={(e) => {
                    setIgroupcode(e.target.value);
                  }}
                />
              </td>
              <th>그룹명</th>
              <td>
                <input
                  type="text"
                  id="group_name"
                  name="group_name"
                  value={igroupname}
                  readOnly={readonly}
                  onChange={(e) => {
                    setIgroupname(e.target.value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <th>내용</th>
              <td colspan="3">
                <textarea
                  id="note"
                  name="note"
                  cols="20"
                  rows="3"
                  value={inote}
                  onChange={(e) => {
                    setInote(e.target.value);
                  }}
                ></textarea>
              </td>
            </tr>
            <tr>
              <th>사용 유무</th>
              <td colspan="3">
                사용{" "}
                <input
                  type="radio"
                  id="usey"
                  name="useyn"
                  value="Y"
                  checked={iuseyn === "Y"}
                  onChange={(e) => {
                    setIuseyn(e.target.value);
                  }}
                />
                미사용{" "}
                <input
                  type="radio"
                  id="usen"
                  name="useyn"
                  value="N"
                  checked={iuseyn === "N"}
                  onChange={(e) => {
                    setIuseyn(e.target.value);
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="modal-button">
          {modtype && <button onClick={save}> 등록 </button>}
          {!modtype && <button onClick={save}> 수정 </button>}
          {!modtype && <button onClick={del}> 삭제 </button>}
          <button onClick={closeModal}> 닫기 </button>
        </div>
      </Modal>{" "}
      <Modal
        style={modalStyle}
        isOpen={dmodalIsOpen}
        onRequestClose={dcloseModal}
      >
        <br />

        <table className="row modal-content">
          <tbody>
            <tr>
              <th>그룹코드</th>
              <td colspan="3">
                <input
                  type="text"
                  id="group_code"
                  name="group_code"
                  value={igroupcode}
                  readOnly={readonly}
                />
              </td>
            </tr>
            <tr>
              <th>상세 코드</th>
              <td>
                <input
                  type="text"
                  id="detail_code"
                  name="detail_code"
                  value={idetailcode}
                  readOnly={dreadonly}
                  onChange={(e) => {
                    setIdetailcode(e.target.value);
                  }}
                />
              </td>
              <th>상세 코드 명</th>
              <td>
                <input
                  type="text"
                  id="detail_name"
                  name="detail_name"
                  value={idetailname}
                  onChange={(e) => {
                    setIdetailname(e.target.value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <th>내용</th>
              <td colspan="3">
                <textarea
                  id="note"
                  name="note"
                  cols="20"
                  rows="3"
                  value={idnote}
                  onChange={(e) => {
                    setIdnote(e.target.value);
                  }}
                ></textarea>
              </td>
            </tr>
            <tr>
              <th>사용 유무</th>
              <td colspan="3">
                사용{" "}
                <input
                  type="radio"
                  id="usey"
                  name="useyn"
                  value="Y"
                  checked={iduseyn === "Y"}
                  onChange={(e) => {
                    setIduseyn(e.target.value);
                  }}
                />
                미사용{" "}
                <input
                  type="radio"
                  id="usen"
                  name="useyn"
                  value="N"
                  checked={iduseyn === "N"}
                  onChange={(e) => {
                    setIduseyn(e.target.value);
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="modal-button">
          {dmodtype && <button onClick={dsave}> 등록 </button>}
          {!dmodtype && <button onClick={dsave}> 수정 </button>}
          {!dmodtype && <button onClick={ddel}> 삭제 </button>}
          <button onClick={dcloseModal}> 닫기 </button>
        </div>
      </Modal>{" "}
    </>
  );
};

export default SamplePage4;
