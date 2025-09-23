import React, { useState, useEffect, startTransition } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import * as commonjs from "../../components/common/commonfunction.js";

import Modal from "react-modal";
import "./SamplePage1.css";

const SamplePage1 = () => {
  const [searchInfo, setSearchInfo] = useState({
    searchtitle: "",
    searchstartdate: "",
    searchenddate: "",
    pageSize: 10,
    blocksize: 5,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const [varlistdata, setVarlistdates] = useState({
    noticelist: [], //목록
    totalcnt: 0,
    pageCount: 0,
  });

  //등록수정 팝업 파라미터
  const [regwin, setRegwin] = useState({
    isRegBtn: true,
    noticedis: false,
    selnoticeno: 0,
    inputtitle: "",
    inputcon: "",
    action: "",
  });

  //파일정보
  const [fileinfo, setFileinfo] = useState({
    selfileyn: false,
    preview: "",
    attfile: {},
    disfilename: "",
    fileyn: "",
    filename: "",
  });

  useEffect(() => {
    let today = new Date();

    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1; // 월
    let date = today.getDate() - 2; // 날짜
    let date2 = today.getDate() + 1; // 날짜

    let monthstr = "";
    let datestr = "";
    let datestr2 = "";

    if (month < 10) {
      monthstr = "0" + month.toString();
    } else {
      monthstr = month.toString();
    }

    if (date < 10) {
      datestr = "0" + date.toString();
    } else {
      datestr = date.toString();
    }

    if (date2 < 10) {
      datestr2 = "0" + date2.toString();
    } else {
      datestr2 = date2.toString();
    }

    //setSearchstartdate(year.toString() + "-" + monthstr + "-" + datestr);
    //setSearchenddate(year.toString() + "-" + monthstr + "-" + datestr2);

    const startdate = year.toString() + "-" + monthstr + "-" + datestr;
    const enddate = year.toString() + "-" + monthstr + "-" + datestr2;

    //searchInfo를 분해하여 searchstartdate = startdate, searchenddate = enddate로 치환함
    setSearchInfo({
      ...searchInfo,
      searchstartdate: startdate,
      searchenddate: enddate,
    });

    //setSearchInfo를 해도 searchlist();가 끝나고난후에 위의 setSearchInfo가 처리되기때문에(비동기) 빽단으로 파라미터가 넘어가지않음 
    //searchlist();
  }, []); //onLoad시 실행되는 useEffect

  //그렇기때문에 useEffect를 새로 만들어서 searchlist();를 실행해야됨
  useEffect( () => {
    //3가지중 하나라도 바뀌면 searchlist();를 실행
    searchlist();
  },[searchInfo.searchtitle, searchInfo.searchstartdate, searchInfo.searchenddate])

  const serachbutton = () => {
    searchlist(1);
  };

  const pagebutton = (event) => {
    // alert(event.selected);
    searchlist(parseInt(event.selected) + 1);
  };

  const searchlist = async (cpage = 1) => {
    // cpage = cpage || 1;

    setCurrentPage(cpage);

    console.log(cpage);
    //alert(searchRoomName);

    console.log(searchInfo.searchstartdate + " : " + searchInfo.searchenddate);

    let params = new URLSearchParams();
    params.append("currentpage", cpage);
    params.append("pagesize", searchInfo.pageSize);
    params.append("stitle", searchInfo.searchtitle);
    params.append("ssdate", searchInfo.searchstartdate);
    params.append("sedate", searchInfo.searchenddate);

    await axios
      // 빽단에 /api가없는데 사용한이유는 setupProxy.js
      .post("/api/system/noticeListvue.do", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json", // 서버에 JSON 형식의 응답을 요청
        },
      })
      .then((res) => {
        //setTotalcnt(res.data.listcnt);
        //setNoticelist(res.data.listdata);
        //console.log("result console : " + res);
        console.log("result console : " + JSON.stringify(res));
        console.log(
          "result console : " +
            res.data.totalcnt +
            " : " +
            JSON.stringify(res.data.listdate) +
            " : " +
            JSON.stringify(res.status) +
            " : " +
            JSON.stringify(res.statusText)
        );

        setVarlistdates({
          ...varlistdata,
          noticelist: res.data.listdate,
          totalcnt: res.data.totalcnt,
          pageCount: pageCount(res.data.totalcnt),  
        });
      })
      .catch((err) => {
        console.log("list error");
        alert(err.message);
      });
  };

  let pageCount = (totalcnt) => {
    let pagenum = parseInt(totalcnt / searchInfo.pageSize);

    console.log("pagenum", pagenum);

    if (totalcnt % searchInfo.pageSize == 0) {
      return pagenum;
    } else {
      return pagenum + 1;
    }
  };

  const newreg = () => {
    setRegwin({
      ...regwin,
      inputtitle: "",
      inputcon: "",
      action: "I",
      selnoticeno: 0,
      isRegBtn: true,
      noticedis: true,
      preview: "",
    });
  };

  const noticedel = (e) => {
    e.preventDefault();

    let params = new URLSearchParams();
    params.append("noticeNo", regwin.selnoticeno);

    axios
      .post("/system/noticeDelete", params)
      .then((res) => {
        //alert(res.data.result);
        console.log("result console : " + JSON.stringify(res));

        if (res.data.result === 1) {
          alert(res.data.resultmsg);
          closenoticeModal();
          searchlist();
        }

        //console.log("result console : " + res);
      })
      .catch((err) => {
        console.log("delete error");
        alert(err.message);
      });
  };

  const noticereg = (e) => {
    e.preventDefault();

    let params = new FormData();
    params.append("noticeTitle", regwin.inputtitle);
    params.append("noticeContent", regwin.inputcon);
    params.append("noticeNo", regwin.selnoticeno);
    params.append("file_yn", fileinfo.fileyn);
    params.append("file", fileinfo.attfile);
    params.append("action", fileinfo.action);

    //일일이 append하지않고 생성된 json을 가지고 const param = new URLSearchParams(Object.entries(imageinfo)); 형식으로도 가능하다
    //imageinfo = json형식 물론 추가로 거기에 append도 가능함

    let callurl = "";

    if (regwin.action === "I") {
      callurl = "/system/insertNoticefile";
    } else if (regwin.action === "U") {
      callurl = "/system/noticeUpdatefile";
    }

    axios
      .post(callurl, params)
      .then((res) => {
        //alert(res.data.result);
        console.log("result console : " + JSON.stringify(res));
        console.log("res.data.result : " + res.data.result);

        if (res.data.result === 1) {
          alert(res.data.resultmsg);
          closenoticeModal();
          searchlist();
        }

        //console.log("result console : " + res);
      })
      .catch((err) => {
        console.log("save error");
        alert(err.message);
      });
  };

  const deteilnotice = (id) => {
    let params = new URLSearchParams();
    params.append("noticeNo", id);

    axios
      .post("/system//noticeDetail", params)
      .then((res) => {
        console.log("result console : " + JSON.stringify(res));
        console.log(111);

        setRegwin({
          ...regwin,
          selnoticeno: id,
          action: "U",
          isRegBtn: false,
          noticedis: true,
          inputtitle: res.data.noticeDetail.noticeTitle,
          inputcon: res.data.noticeDetail.noticeContent,
        });

        let filename = res.data.noticeDetail.file_name;
        let fileext = res.data.noticeDetail.file_ext;
        let file_size = res.data.noticeDetail.file_size;

        console.log("파일명 : " + filename);
        console.log("파일 확장자 : " + fileext);
        console.log("파일 크기 : " + file_size);

        if (filename === "") {
          setFileinfo({
            ...fileinfo,
            preview: "",
            selfileyn: false,
            attfile: "",
            filename: "",
          });
        } else {
          if (
            fileext === "jpg" ||
            fileext === "png" ||
            fileext === "gif" ||
            fileext === "jpeg"
          ) {
            attachfileproc("P", id, filename);
          } else {
            setFileinfo({
              ...fileinfo,
              preview: filename,
              disfilename: filename,
              selfileyn: false,
            });
          }
        }
      })
      .catch((err) => {
        console.log("detail error");
        alert(err.message);
      });
  };

  const attachfileproc = (ptype, noticeNo, filename) => {
    let params = new URLSearchParams();
    params.append("noticeNo", noticeNo);

    axios
      .post("/system/noticefileDetail", params, { responseType: "blob" })
      .then((res) => {
        console.log("attachfileproc res start");
        console.log(res);
        //미리보기 
        if (ptype === "P") {
          setFileinfo({
            ...fileinfo,
            preview: window.URL.createObjectURL(res.data),
            selfileyn: true,
            attfile: "",
            filename: filename,
          });
        //다운로드
        } else {
          let docUrl = document.createElement("a");
          docUrl.href = window.URL.createObjectURL(res.data);
          docUrl.setAttribute("download", fileinfo.filename);
          document.body.appendChild(docUrl);
          docUrl.click();
        }
      })
      .catch((err) => {
        console.log("attachfileproc catch start");
        alert(err.message);
      });
  };

  const closenoticeModal = () => {
    setRegwin({
      ...regwin,
      noticedis: false,
    });
  };

  const filePreview = () => {
    attachfileproc("D", regwin.selnoticeno, fileinfo.filename);
  };

  const previewfunc = (e) => {
    let selfile = e.currentTarget;

    console.log("previewfunc : " + selfile.files[0]);
    if (selfile.files[0]) {
      let filePath = selfile.value; // c:\\a.jpg
      console.log(filePath);
      //전체경로를 \ 나눔.
      let filePathSplit = filePath.split("\\");

      //전체경로를 \로 나눈 길이.
      let filePathLength = filePathSplit.length;
      //마지막 경로를 .으로 나눔.
      let fileNameSplit = filePathSplit[filePathLength - 1].split(".");
      //파일명 : .으로 나눈 앞부분
      let fileName = fileNameSplit[0];
      //파일 확장자 : .으로 나눈 뒷부분
      let fileExt = fileNameSplit[1];
      //파일 크기
      let fileSize = selfile.files[0].size;

      console.log("파일 경로 : " + filePath);
      console.log("파일명 : " + fileName);
      console.log("파일 확장자 : " + fileExt);
      console.log("파일 크기 : " + fileSize);

      if (
        fileExt === "jpg" ||
        fileExt === "png" ||
        fileExt === "gif" ||
        fileExt === "jpeg"
      ) {
        console.log("selfile.files[0] : " + selfile.files[0]);

        setFileinfo({
          ...fileinfo,
          preview: window.URL.createObjectURL(selfile.files[0]),
          attfile: selfile.files[0],
          selfileyn: true,
        });
      } else {
        //setPreview("./logo.svg");
        //setSelfileyn(false);

        setFileinfo({
          ...fileinfo,
          preview: "./logo.svg",
          disfilename: fileName + "." + fileExt,
          selfileyn: false,
        });
      }
    }
  };

  const pdfdown = (e) => {
    let params = new URLSearchParams();
    params.append("currentpage", 1);
    params.append("pagesize", searchInfo.pageSize);
    params.append("stitle", searchInfo.searchtitle);
    params.append("ssdate", searchInfo.searchstartdate);
    params.append("sedate", searchInfo.searchenddate);

    axios
      .post("/system/noticepdfDown.do", params, { responseType: "blob" })
      .then((res) => {
        //console.log("pdfdown res start");
        //console.log(res);
        let docUrl = document.createElement("a");
        docUrl.href = window.URL.createObjectURL(res.data);
        docUrl.setAttribute("download", "Noticepdf.pdf");
        document.body.appendChild(docUrl);
        docUrl.click();
      })
      .catch((err) => {
        console.log("attachfileproc catch start");
        alert(err.message);
      });
  };

  const exceldown = (e) => {
    let params = new URLSearchParams();
    params.append("currentpage", 1);
    params.append("pagesize", searchInfo.pageSize);
    params.append("stitle", searchInfo.searchtitle);
    params.append("ssdate", searchInfo.searchstartdate);
    params.append("sedate", searchInfo.searchenddate);

    axios
      .post("/system/noticeexcelDown.do", params, { responseType: "blob" })
      .then((res) => {
        //console.log("pdfdown res start");
        //console.log(res);
        let docUrl = document.createElement("a");
        docUrl.href = window.URL.createObjectURL(res.data);
        docUrl.setAttribute("download", "Noticeexcel.xlsx");
        document.body.appendChild(docUrl);
        docUrl.click();
      })
      .catch((err) => {
        console.log("attachfileproc catch start");
        alert(err.message);
      });
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
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      transform: "translate(-50%, -50%)",
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
      <p className="Location">
        <a className="btn_set home">메인으로</a>{" "}
        <span className="btn_nav bold">학습지원</span>{" "}
        <span className="btn_nav bold"> 공지사항</span>{" "}
        <a className="btn_set refresh">새로고침</a>
      </p>
      <p className="conTitle">
        <span>공지사항</span>{" "}
        <span className="fr">
          <span style={searchstyle}>제목</span>
          <input
            type="text"
            id="searchRoomName"
            name="searchRoomName"
            className="form-control"
            style={{ width: 150 }}
            placeholder=""
            value={searchInfo.searchtitle}
            onChange={(e) => {
              //setSearchtitle(e.target.value);
              setSearchInfo({
                ...searchInfo,
                searchtitle: e.target.value,
              });
            }}
          />
          <span style={searchstyle}>기간</span>
          <input
            type="date"
            id="searchRoomName"
            name="searchRoomName"
            className="form-control"
            style={{ width: 150 }}
            placeholder=""
            value={searchInfo.searchstartdate}
            onChange={(e) => {
              //setSearchtitle(e.target.value);
              setSearchInfo({
                ...searchInfo,
                searchstartdate: e.target.value,
              });
            }}
          />
          ~
          <input
            type="date"
            id="searchRoomName"
            name="searchRoomName"
            className="form-control"
            style={{ width: 150 }}
            placeholder=""
            value={searchInfo.searchenddate}
            onChange={(e) => {
              //setSearchtitle(e.target.value);
              setSearchInfo({
                ...searchInfo,
                searchenddate: e.target.value,
              });
            }}
          />
          <button
            className="btn btn-primary"
            name="searchbtn"
            id="searchbtn"
            onClick={serachbutton}
          >
            <span>검색</span>
          </button>
          <button
            className="btn btn-primary"
            name="newReg"
            id="newReg"
            onClick={newreg}
          >
            <span>신규등록</span>
          </button>
          <button
            className="btn btn-primary"
            name="newReg"
            id="newReg"
            onClick={pdfdown}
          >
            <span>PDF</span>
          </button>
          <button
            className="btn btn-primary"
            name="newReg"
            id="newReg"
            onClick={exceldown}
          >
            <span>Excel</span>
          </button>
        </span>
      </p>

      <div>
        <b>
          총건수 : {varlistdata.totalcnt} 현재 페이지 번호 : {currentPage}
        </b>
        <table className="col">
          <colgroup>
            <col width="15%" />
            <col width="45%" />
            <col width="15%" />
            <col width="15%" />
          </colgroup>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>등록일</th>
            </tr>
          </thead>
          <tbody>
            {varlistdata.totalcnt == 0 && (
              <tr>
                <td colSpan="5"> 조회된 데이터가 없습니다.</td>
              </tr>
            )}
            {varlistdata.totalcnt > 0 &&
              Array.isArray(varlistdata.noticelist) &&
              varlistdata.noticelist.map((item) => {
                return (
                  <tr key={item.noticeNo}>
                    <td
                      className="pointer-cursor"
                      onClick={() => deteilnotice(item.noticeNo)}
                    >
                      {item.noticeNo}
                    </td>
                    <td>{item.noticeTitle}</td>
                    <td>{item.loginId}</td>
                    <td>{item.noticeRegdate}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <br />
        <ReactPaginate
          claaaName={pagenavicss}
          breakLabel="..."
          nextLabel="다음 >"
          onClick={pagebutton}
          pageRangeDisplayed={searchInfo.blocksize}
          pageCount={varlistdata.pageCount}
          previousLabel="< 이전"
          renderOnZeroPageCount={null}
          pageClassName={"pageItem"}
          activeClassName={"currentPagecss"}
          previousClassName={"pageLabelBtn"}
          nextClassName={"pageLabelBtn"}
        />
      </div>

      <Modal
        style={modalStyle}
        isOpen={regwin.noticedis}
        onRequestClose={closenoticeModal}
        ariaHideApp={false}
      >
        <form action="" method="post" id="saveForm" name="saveForm">
          <div id="noticeform">
            <p className="conTitle">
              <span>{regwin.isRegBtn ? "공지사항 등록" : "공지사항 수정"}</span>
            </p>
            <table style={{ width: "550px", height: "350px" }}>
              <tbody>
                <tr>
                  <th>
                    {" "}
                    제목 <span className="font_red">*</span>
                  </th>
                  <td colSpan="3">
                    <input
                      type="text"
                      className="form-control input-sm"
                      style={{ width: "470px" }}
                      value={regwin.inputtitle}
                      onChange={(e) => {
                        // setInputtitle(e.target.value);
                        setRegwin({
                          ...regwin,
                          inputtitle: e.target.value,
                        });
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <th>
                    {" "}
                    내용<span className="font_red">*</span>
                  </th>
                  <td colSpan="3">
                    <textarea
                      className="form-control input-sm"
                      value={regwin.inputcon}
                      cols="40"
                      rows="5"
                      onChange={(e) => {
                        // setInputcon(e.target.value);

                        setRegwin({
                          ...regwin,
                          inputcon: e.target.value,
                        });
                      }}
                    ></textarea>
                  </td>
                </tr>
                <tr>
                  <th>
                    {" "}
                    파일<span className="font_red">*</span>
                  </th>
                  <td colSpan="3">
                    <input
                      type="file"
                      className="form-control input-sm"
                      onChange={previewfunc}
                    />
                  </td>
                </tr>
                <tr>
                  <th>
                    {" "}
                    미리보기<span className="font_red">*</span>
                  </th>
                  <td colSpan="3">
                    {fileinfo.selfileyn && (
                      <img
                        src={fileinfo.preview ? fileinfo.preview : `./logo.svg`}
                        alt="preview"
                        className="filepreview"
                        onClick={filePreview}
                      />
                    )}
                    {!fileinfo.selfileyn && fileinfo.disfilename}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="modal-button">
              {regwin.isRegBtn && (
                <button className="btn btn-primary mx-2" onClick={noticereg}>
                  {" "}
                  등록{" "}
                </button>
              )}
              {!regwin.isRegBtn && (
                <button className="btn btn-primary mx-2" onClick={noticereg}>
                  {" "}
                  수정{" "}
                </button>
              )}
              {!regwin.isRegBtn && (
                <button className="btn btn-primary mx-2" onClick={noticedel}>
                  {" "}
                  삭제{" "}
                </button>
              )}
              <button className="btn btn-primary" onClick={closenoticeModal}>
                {" "}
                닫기{" "}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SamplePage1;
