import React,{ useState, useEffect } from "react";
import "./SamplePage1.css"
import axios from "axios";

import ReactPaginate from "react-paginate";
import Modal from "react-modal";

import Samplepage16popup from "./Samplepage16popup";


const Samplepage16 = () => {

    const [searchinfo, setSearchinfo] = useState({
        searchsel : "",
        searchword : "",
        searchtype : "",
        currentpage : 1,
        pagesize : 10,
        blocksize : 5,
    });

    const [userlist, setUserlist] = useState({
        datalist : [],
        totalcnt : 0,
    });

    const [modalwin, setModalwin] = useState({
        isopen : false,
        action : "",
        loginid : "",

    });


    const search = async (cpage = 1) => {

        //const paramtag = document.getElementById("conTitle");

        console.log("search");

        if(typeof cpage === "object") {
            cpage = 1;
        }

        const param = new URLSearchParams(Object.entries(searchinfo));
        param.set("currentpage", cpage);

        await axios.post("/api/usermgrreact/userListreact", param)
            .then( (res) => {
                    console.log(res);

                    setUserlist(
                        (old) => (
                            {
                                ...old,
                                datalist : res.data.datalist,
                                totalcnt : res.data.totalcnt,
                            }
                        )
                    );

                    setSearchinfo( (old) => (
                        {
                            ...old,
                            currentpage : cpage,
                        }
                    ));
                }
            )
            .catch( (err) => {
                    console.log(err.errorCode, err.errorMessage);
                }
            )
    }

    const pagebutton = (e) => {
        console.log(e.selected);
        search(parseInt(e.selected) + 1);
    }

    const openmodal = (action, loginid = "") => {

        console.log(action,loginid);

        setModalwin((prev) => (
            {
                ...prev,
                isopen : true,
                action : action,
                loginid : loginid,
            }
        ));
    }


    const closeModal = (searchflag) => {
        setModalwin((prev) => (
            {
                ...prev,
                isopen : false,
            }
        ));

        if(searchflag === "Y") {
            if(modalwin.action === "I") {
                search();
            } else {
                search(searchinfo.currentpage);
            }
        }



    }




    useEffect(() => {
        search();
    },[]);




    const searchstyle = {
        fontsize: "15px",
        fontweight: "bold",
    };

    const modalStyle = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            transform: "translate(-50%, -50%)",
            width: '50%'
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

    return (
        <div>
            <div className="content">
                <p className="Location">
                    <a className="btn_set home">메인으로</a>{" "}
                    <span className="btn_nav bold">Sampletest</span>{" "}
                    <span className="btn_nav bold"> Samplepage16</span>{" "}
                    <a className="btn_set refresh">새로고침</a>
                </p>
                <p className="conTitle" id="conTitle">
                    <span>사용자 관리</span>{" "}
                    <span className="fr">
                          <span style={searchstyle}>검색어</span>&nbsp;&nbsp;&nbsp;
                        <select id="searchsel" name="searchsel" style={{ width : 100}}
                                value={searchinfo.searchsel}
                                onChange={
                                    (e) => {
                                        setSearchinfo(
                                            (old) => (
                                                {
                                                    ...old,
                                                    searchsel : e.target.value,
                                                }
                                            )
                                        )
                                    }
                                }>
                              <option value="">전채</option>
                              <option value="loginid">Login ID</option>
                              <option value="name">이름</option>
                          </select>
                        &nbsp;&nbsp;&nbsp;
                        <input
                            type="text"
                            id="searchword"
                            name="searchword"
                            className="form-control"
                            style={{ width: 150 }}
                            placeholder=""
                            value={searchinfo.searchword}
                            onChange={
                                (e) => {
                                    setSearchinfo(
                                        (old) => (
                                            {
                                                ...old,
                                                searchword : e.target.value,
                                            }
                                        )
                                    )
                                }
                            }
                        />
                        &nbsp;&nbsp;&nbsp;
                        <span style={searchstyle}>사용자 유형</span>
                        &nbsp;&nbsp;&nbsp;
                        <select id="searchtype" name="searchtype" style={{ width : 100}}
                                value={searchinfo.searchtype}
                                onChange={
                                    (e) => {
                                        setSearchinfo(
                                            (old) => (
                                                {
                                                    ...old,
                                                    searchtype : e.target.value,
                                                }
                                            )
                                        )
                                    }
                                }>
                              <option value="">전채</option>
                              <option value="A">관리자</option>
                              <option value="B">사용자</option>
                          </select>
                        &nbsp;&nbsp;&nbsp;
                        <button
                            className="btn btn-primary"
                            name="searchbtn"
                            id="searchbtn"
                            onClick={search}
                        >
                            <span>검색</span>
                          </button>
                          <button
                              className="btn btn-primary"
                              name="newReg"
                              id="newReg"
                              onClick={() => openmodal("I")}
                          >
                            <span>신규등록</span>
                          </button>
                    </span>
                </p>
                <div>
                    <b>
                        총건수 : {userlist.totalcnt} 현재 페이지 번호 : {searchinfo.currentpage}
                    </b>
                    <table className="col">
                        <colgroup>
                            <col width="15%" />
                            <col width="10%" />
                            <col width="15%" />
                            <col width="15%" />
                            <col width="10%" />
                            <col width="15%" />
                            <col width="10%" />
                        </colgroup>
                        <thead>
                        <tr>
                            <th>Login ID</th>
                            <th>사용자 구분</th>
                            <th>이름</th>
                            <th>연락처</th>
                            <th>성별</th>
                            <th>등록일</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        { userlist.totalcnt === 0 && <tr><td colSpan="7">조회된 데이터가 없습니다.</td></tr> }
                        { userlist.totalcnt > 0 &&
                            userlist.datalist.map(
                                (user, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{user.loginID}</td>
                                            <td>{user.user_type_name}</td>
                                            <td>{user.name}</td>
                                            <td>{user.hp}</td>
                                            <td>{user.sex === "M" ? "남자" : user.sex === "W" ? "여자" : ""}</td>
                                            <td>{user.regdate}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary"
                                                    name="modify"
                                                    id="modify"
                                                    onClick={() => openmodal("U",user.loginID)}
                                                >
                                                    <span>수정</span>
                                                </button>

                                            </td>
                                        </tr>
                                    )
                                }
                            )
                        }
                        </tbody>
                    </table>
                    <br />
                    <ReactPaginate
                        claaaName={pagenavicss}
                        breakLabel="..."
                        nextLabel="다음 >"
                        onPageChange={pagebutton}
                        pageRangeDisplayed={searchinfo.blocksize}
                        pageCount={userlist.totalcnt % searchinfo.pagesize === 0 ? userlist.totalcnt / searchinfo.pagesize : parseInt(userlist.totalcnt / searchinfo.pagesize) + 1}
                        previousLabel="< 이전"
                        renderOnZeroPageCount={null}
                        pageClassName={"pageItem"}
                        activeClassName={"currentPagecss"}
                        previousClassName={"pageLabelBtn"}
                        nextClassName={"pageLabelBtn"}
                    />
                </div>
            </div>

            <Modal
                style={modalStyle}
                isOpen={modalwin.isopen}
                onRequestClose={closeModal}
                ariaHideApp={false}
            >
                <Samplepage16popup action={modalwin.action} loginid={modalwin.loginid} closeModal={closeModal} />
            </Modal>


        </div>

    )
}

export default Samplepage16;

