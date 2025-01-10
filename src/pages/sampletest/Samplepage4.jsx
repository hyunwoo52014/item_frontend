import React, { useState, useEffect, useCallback } from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Modal from "react-modal";
import "./SamplePage1.css";

import * as commonjs from "../../components/common/commonfunction.js";
import Samplepage4detailpopup from "./Samplepage4detailpopup.jsx";

/////////////////////////// 그룹 코드 //////////////////////////////////

const SamplePage4 = () => {
  // 애플리케이션의 루트 요소를 설정
  Modal.setAppElement("#root");

  const [searchdata, setSearchdata] = useState({
    stype: "",
    searchword: "",
    useyn: "",
    cpage: 1,
    pagesize: 5,
    blocksize: 10,
  });

  const [groupdata, setGroupdata] = useState({
    grouplist: [],
    totalcnt: 0,
  });

  const [groupmodalopen, setGroupmodalopen] = useState({
    isopen: false,
  });

  const [groupeditdata, setGroupeditdata] = useState({
    readonly: false,
    group_code: "",
    group_name: "",
    note: "",
    useyn: "Y",
    modtype: false,
    action: "I",
    title: "",
    delyn: "N",
  });

  const groupsearch = useCallback(() => {
    // 상세 코드 목록 초기화
    setDetaildata((prevdetaildata) => ({
      ...prevdetaildata,
      detaillist: [],
      totalcnt: 0,
      grpcd: "",
      cpage: 1,
    }));

    // URLSearchParams 생성 및 한번에 추가
    // Object.entries : { stype: "", searchword: "" } → [["stype", ""], ["searchword", ""]]
    // 배열 형식으로 전달된 키-값 쌍을 이용해 URLSearchParams 객체를 생성
    const param = new URLSearchParams(Object.entries(searchdata));

    console.log(" groupsearch : ", searchdata.cpage);

    fetch("/system/listgroupcode", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // x-www-form-urlencoded 방식
      },
      body: param.toString(),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Group Code Data 요청 중 Error 발생");
        }

        // 응답 데이터를 JSON으로 변환  fetch는 response.data 가 없고,
        // 받은 response 를 가공 해야 함
        // Json 형태 : response.json()   text 형태 : response.text()   blob 형태 : response.blob()
        return response.json(); // 응답 데이터를 JSON으로 변환  fetch는 response.data 가 없고,
      })
      .then((data) => {
        // data는 위에서 수행한 response.json() 결과 임.
        console.log("받은 Data", data);

        setGroupdata((prevGroupdata) => ({
          ...prevGroupdata,
          grouplist: data.commcodeModel,
          totalcnt: data.totalcnt,
        }));
        // groupdata를 직접 참조하면 React는 의존성 배열에 groupdata를 추가하도록 요구
        // 그렇지 않으면 groupdata가 최신 상태를 유지하지 못할 수 있음.
        /*
        setGroupdata({
          ...groupdata,
          grouplist: data.commcodeModel,
          totalcnt: data.totalcnt,
        });
        */
      })
      .catch((error) => {
        console.error(error);
      });
  }, [searchdata]);

  // useCallback으로 메모이제이션된 groupsearch는 searchdata를 의존성으로 가지기 때문에,
  // 의존성 배열에 추가하지 않으면 groupsearch의 최신 버전을 참조하지 않을 수 있음.
  useEffect(() => {
    //console.log(" useEffect : ", searchdata.cpage);
    groupsearch();
  }, [searchdata.cpage, searchdata.useyn, groupsearch]);

  const groupreg = () => {
    // console.log(groupdata.grouplist);

    setGroupmodalopen({ ...groupmodalopen, isopen: true });
    setGroupeditdata({ ...groupeditdata, action: "I", title: "그룹코드 등록", readonly: false });
  };

  const groupcodemodify = (grpcd) => {
    const param = new URLSearchParams();
    param.append("groupcode", grpcd);

    axios
      .post("/system/selectgroupcode", param)
      .then((res) => {
        console.log(res);

        setGroupeditdata((prev) => ({
          ...prev,
          ...res.data.commcodeModel, // commcodeModel의 키-값을 groupeditdata에 병합
          action: "U",
          modtype: true,
          readonly: true,
        }));
        setGroupmodalopen({ ...groupmodalopen, isopen: true });
      })
      .catch((err) => {
        console.log("noticeUpdate catch start");
        alert(err.message);
      });
  };

  const groupeditinit = () => {
    setGroupeditdata((prev) => ({
      ...prev,
      readonly: false,
      action: "",
      group_code: "",
      group_name: "",
      note: "",
      useyn: "Y",
      modtype: false,
      title: "",
      delyn: "N",
    }));
  };

  const groupsave = (proc) => {
    const checklist = [
      { inval: groupeditdata.group_code, msg: "그룹 코드를 입력해 주세요" },
      { inval: groupeditdata.group_name, msg: "그룹 코드 명를 입력해 주세요" },
    ];

    if (!commonjs.nullcheck(checklist)) return;

    const param = new URLSearchParams();
    param.append("igroupcode", groupeditdata.group_code);
    param.append("igroupname", groupeditdata.group_name);
    param.append("inote", groupeditdata.note);
    param.append("iuseyn", groupeditdata.useyn);

    if (proc === "D") {
      param.append("action", "D");
    } else {
      param.append("action", groupeditdata.action);
    }

    axios
      .post("/system/savegroupcode", param)
      .then((res) => {
        console.log(res);

        if (res.data.result === "SUCCESS") {
          if (proc === "D") {
            alert("삭제 되었습니다.");
          } else {
            alert("저장 되었습니다.");
          }

          groupclosemodal();
          groupsearch();
        } else {
          alert(res.data.resultmsg);
        }

        groupeditinit();
      })
      .catch((err) => {
        console.log("noticeUpdate catch start");
        alert(err.message);
      });
  };

  const groupdel = () => {
    if (groupeditdata.delyn === "N") {
      alert("상세 코드가 있어 삭제 할수 없습니다.");
      return;
    }

    groupsave("D");
  };

  const pagebutton = (event) => {
    // alert(event.selected);
    //groupsearch(parseInt(event.selected) + 1);

    const pcpage = parseInt(event.selected) + 1;
    setSearchdata({ ...searchdata, cpage: pcpage });
  };

  const groupclosemodal = () => {
    groupeditinit();

    setGroupmodalopen((prevgroupmodalopen) => ({
      ...prevgroupmodalopen,
      isopen: false,
    }));
  };

  /////////////////////////////상세 코드//////////////////////////////
  const [detaildata, setDetaildata] = useState({
    detaillist: [],
    totalcnt: 0,
    grpcd: "",
    cpage: 1,
    pagesize: 5,
  });

  const [detailmodalopen, setDetailmodalopen] = useState({
    isopen: false,
    action: "",
    detailcode: "",
    title: "",
  });

  const grpclick = (pgrpcd) => {
    setDetaildata((prevdetaildata) => ({
      ...prevdetaildata,
      grpcd: pgrpcd,
    }));
  };

  const detailsearch = useCallback(() => {
    const param = new URLSearchParams();
    param.append("groupcode", detaildata.grpcd);
    param.append("cpage", detaildata.cpage);
    param.append("pagesize", detaildata.pagesize);

    axios
      .post("/system//listdetailcode", param)
      .then((response) => {
        console.log(response);
        setDetaildata((prevdetaildata) => ({
          ...prevdetaildata,
          detaillist: response.data.commcodeModel,
          totalcnt: response.data.totalcnt,
        }));
      })
      .catch((err) => {
        console.log("Detail Code List Search Error !!");
        alert(err.message);
      });
  }, [detaildata.grpcd, detaildata.cpage, detaildata.pagesize]);

  const dtlpagebutton = (event) => {
    const pcpage = parseInt(event.selected) + 1;
    setDetaildata({ ...detaildata, cpage: pcpage });
  };

  useEffect(() => {
    detailsearch();
  }, [detaildata.grpcd, detaildata.cpage, detaildata.pagesize, detailsearch]);

  const newdetail = () => {
    if (
      detaildata.grpcd === "" ||
      detaildata.grpcd === null ||
      detaildata.grpcd === undefined
    ) {
      alert("상세 코드 조회를 먼저 해주세요");
      return;
    }

    setDetailmodalopen((prevdetailmodalopen) => ({
      ...prevdetailmodalopen,
      isopen: true,
      action: "I",
      detailcode: "",
      title: "상세코드 등록",
    }));
  };

  const detailcodemodify = (detail_cd) => {
    setDetailmodalopen((prevdetailmodalopen) => ({
      ...prevdetailmodalopen,
      isopen: true,
      action: "U",
      detailcode: detail_cd,
      title: "상세코드 수정",
    }));
  };

  const detailclosemodal = (flag) => {
    setDetailmodalopen((prevdetailmodalopen) => ({
      ...prevdetailmodalopen,
      isopen: false,
    }));

    console.log("samplepage4 detailclosemodal  flag : ", flag);

    if (flag === true) detailsearch();
  };

  /////////////////////////// CSS //////////////////////////////////

  const pagenavicss = {
    margin: "20px 0",
    display: "flex",
    justifycontent: "center",
    alignitems: "center",
    liststyletype: "none",
    padding: "10px",
  };

  const modalStyle = {
    content: {
      width: "800px", // 팝업 너비
      height: "310px", // 높이를 내용에 맞게 자동 조정
      margin: "auto", // 중앙 정렬
      maxHeight: "90vh", // 최대 높이를 화면 높이에 맞게 제한
      padding: "0px", // 내부 여백
      backgroundColor: "#fff", // 배경 흰색
      border: "none", // 테두리 제거
      borderRadius: "8px", // 둥근 모서리
      boxShadow: "none",
      overflow: "auto", // 내용이 넘치면 스크롤 활성화
    },
    overlay: {
      backgroundColor: "transparent", // 외부 배경 투명화
      display: "flex", // 팝업 중앙 정렬
      alignItems: "center", // 수직 중앙 정렬
      justifyContent: "center", // 수평 중앙 정렬
    },
  };

  const detailmodalStyle = {
    content: {
      width: "800px", // 팝업 너비
      height: "470px", // 높이를 내용에 맞게 자동 조정
      margin: "auto", // 중앙 정렬
      maxHeight: "90vh", // 최대 높이를 화면 높이에 맞게 제한
      padding: "0px", // 내부 여백
      backgroundColor: "#fff", // 배경 흰색
      border: "none", // 테두리 제거
      borderRadius: "8px", // 둥근 모서리
      boxShadow: "none",
      overflow: "auto", // 내용이 넘치면 스크롤 활성화
    },
    overlay: {
      backgroundColor: "transparent", // 외부 배경 투명화
      display: "flex", // 팝업 중앙 정렬
      alignItems: "center", // 수직 중앙 정렬
      justifyContent: "center", // 수평 중앙 정렬
    },
  };
  /*
  const searchstyle = {
    fontsize: "15px",
    fontweight: "bold",
  };

  const searchstylewidth = {
    height: "28px",
    width: "200px",
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
 */

  return (
    <>
      <div className="content">
        <p className="conTitle">
          <span> 공통 코드</span>
          <span className="fr" style={{ textAlign: "left", display: "block" }}>
            <select
              id="stype"
              name="stype"
              onChange={(e) => {
                setSearchdata({ ...searchdata, stype: e.target.value });
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
              onInput={(e) => {
                setSearchdata({ ...searchdata, searchword: e.target.value });
              }}
            />
            사용 여부
            <select
              id="useyn"
              name="useyn"
              onChange={(e) => {
                setSearchdata({ ...searchdata, useyn: e.target.value });
              }}
            >
              <option value="">전체</option>
              <option value="Y">사용</option>
              <option value="N">미사용</option>
            </select>
            <button
              className="btn btn-primary mx-2"
              id="btnSearchGrpcod"
              name="btn"
              onClick={groupsearch}
            >
              <span> 검 색 </span>
            </button>
            <button
              className="btn btn-light mx-2"
              id="btnSearchGrpcod"
              name="btn"
              onClick={groupreg}
            >
              <span> 신규등록 </span>
            </button>
          </span>
        </p>
        <div style={{ marginTop: "5px" }}>
          <span>
            총건수 : {groupdata.totalcnt} 현재 페이지번호 : {searchdata.cpage}
          </span>
          <table className="col">
            <thead>
              <tr>
                <th scope="col"> 그룹 코드 </th>
                <th scope="col"> 그룸 코드 명 </th>
                <th scope="col"> 사용 여부 </th>
                <th scope="col"> 등록 일자 </th>
                <th scope="col"> </th>
              </tr>
            </thead>
            <tbody>
              {groupdata.totalcnt === 0 ? (
                <tr>
                  <td colSpan="4">조회된 제이터가 없습니다.</td>
                </tr>
              ) : (
                groupdata.grouplist.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.group_code}</td>
                      <td
                        className="hoverable-row"
                        onClick={() => grpclick(item.group_code)}
                      >
                        {item.group_name}
                      </td>
                      <td>{item.use_yn}</td>
                      <td>
                        {item.reg_date ? item.reg_date.split(" ")[0] : "-"}
                      </td>
                      <td>
                        <button
                          className="btn btn-default mx-2"
                          onClick={() => {
                            groupcodemodify(item.group_code);
                          }}
                        >
                          수정
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <br />
          <div>
            <ReactPaginate
              claaaName={pagenavicss}
              breakLabel="..."
              nextLabel="다음 >"
              onClick={pagebutton}
              pageRangeDisplayed={searchdata.blocksize}
              pageCount={Math.ceil(groupdata.totalcnt / searchdata.pagesize)}
              previousLabel="< 이전"
              renderOnZeroPageCount={null}
              pageClassName={"pageItem"}
              activeClassName={"currentPagecss"}
              previousClassName={"pageLabelBtn"}
              nextClassName={"pageLabelBtn"}
            />
          </div>
        </div>
        <div style={{ marginTop: "5px" }}>
          <span>
            총건수 : {detaildata.totalcnt} 현재 페이지번호 : {detaildata.cpage}
            <span className="fr">
              <button
                className="btn btn-light mx-2"
                id="btnSearchGrpcod"
                name="btn"
                onClick={newdetail}
              >
                <span> 신규등록 </span>
              </button>
            </span>
          </span>
          <table className="col">
            <thead>
              <tr>
                <th scope="col"> 살세 코드 </th>
                <th scope="col"> 상세코드 명 </th>
                <th scope="col"> 사용 여부 </th>
                <th scope="col"> 등록자 </th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {detaildata.totalcnt === 0 ? (
                <tr>
                  <td colSpan={5}>조회된 데이터가 없습니다.</td>
                </tr>
              ) : (
                detaildata.detaillist.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.detail_code}</td>
                      <td>{item.detail_name}</td>
                      <td>{item.use_yn || "-"}</td>
                      <td>{item.regId || "-"}</td>
                      <td>
                        <button
                          className="btn btn-default mx-2"
                          onClick={() => {
                            detailcodemodify(item.detail_code);
                          }}
                        >
                          수정
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <br />
          <div>
            <ReactPaginate
              claaaName={pagenavicss}
              breakLabel="..."
              nextLabel="다음 >"
              onClick={dtlpagebutton}
              pageRangeDisplayed={searchdata.blocksize}
              pageCount={Math.ceil(detaildata.totalcnt / detaildata.pagesize)}
              previousLabel="< 이전"
              renderOnZeroPageCount={null}
              pageClassName={"pageItem"}
              activeClassName={"currentPagecss"}
              previousClassName={"pageLabelBtn"}
              nextClassName={"pageLabelBtn"}
            />
          </div>
        </div>
      </div>
      <Modal
        style={modalStyle}
        isOpen={groupmodalopen.isopen}
        onRequestClose={groupclosemodal}
      >
        <table className="row modal-content">
          <colgroup>
            <col style={{ width: "20px" }} />
            <col style={{ width: "30px" }} />
            <col style={{ width: "20px" }} />
            <col style={{ width: "30px" }} />
          </colgroup>
          <tbody>
            <tr>
              <td colSpan={4}>
                <p className="conTitle">
                  <span> {groupeditdata.title}</span>
                </p>
              </td>
            </tr>
            <tr>
              <th>그룹 코드</th>
              <td>
                <input
                  type="text"
                  id="group_code"
                  name="group_code"
                  value={groupeditdata.group_code}
                  readOnly={groupeditdata.readonly}
                  onChange={(e) => {
                    setGroupeditdata((prevgroupeditdata) => ({
                      ...prevgroupeditdata,
                      group_code: e.target.value,
                    }));
                  }}
                />
              </td>
              <th>그룹 코드 명</th>
              <td>
                <input
                  type="text"
                  id="group_name"
                  name="group_name"
                  value={groupeditdata.group_name}
                  onChange={(e) => {
                    setGroupeditdata((prevgroupeditdata) => ({
                      ...prevgroupeditdata,
                      group_name: e.target.value,
                    }));
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
                  value={groupeditdata.note}
                  onChange={(e) => {
                    setGroupeditdata((prevgroupeditdata) => ({
                      ...prevgroupeditdata,
                      note: e.target.value,
                    }));
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
                  checked={groupeditdata.useyn === "Y"}
                  onChange={(e) => {
                    setGroupeditdata((prevgroupeditdata) => ({
                      ...prevgroupeditdata,
                      useyn: e.target.value,
                    }));
                  }}
                />
                미사용{" "}
                <input
                  type="radio"
                  id="usen"
                  name="useyn"
                  value="N"
                  checked={groupeditdata.useyn === "N"}
                  onChange={(e) => {
                    setGroupeditdata((prevgroupeditdata) => ({
                      ...prevgroupeditdata,
                      useyn: e.target.value,
                    }));
                  }}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={4}>
                <div className="modal-button">
                  {<button onClick={groupsave}> 저장 </button>}
                  {groupeditdata.modtype && (
                    <button onClick={groupdel}> 삭제 </button>
                  )}
                  <button onClick={groupclosemodal}> 닫기 </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </Modal>
      <Modal
        style={detailmodalStyle}
        isOpen={detailmodalopen.isopen}
        onRequestClose={detailclosemodal}
      >
        <Samplepage4detailpopup
          action={detailmodalopen.action}
          detailcode={detailmodalopen.detailcode}
          detailclosemodal={detailclosemodal}
          group_code={detaildata.grpcd}
          title={detailmodalopen.title}
        />
      </Modal>
    </>
  );
};

export default SamplePage4;
