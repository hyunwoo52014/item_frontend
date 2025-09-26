import React, {useEffect, useState} from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "./Accounts.css";
import Modal from "react-modal"
import AccountsModal from "./AccountsModal";
Modal.setAppElement('#root');
const Accounts = () => {
    const [searchInfo, setSearchInfo] = useState({
        searchKey : "",
        search : "",
        pageSize : 10,
        blockSize : 5,
    });

    const [accountsList, setAccountsList] = useState({
        accountList : [],
        totalCnt : 0,
    })

    const [currentPage, setCurrentPage] = useState(1)

    const [userId, setUserId] = useState("");

    useEffect(() => {
        searchList();
    }, []);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const searchList = async (cPage = 1) => {
        setCurrentPage(cPage);

        const param = new URLSearchParams();
        param.append("currentPage", cPage);
        param.append("searchKey", searchInfo.searchKey);
        param.append("search", searchInfo.search);
        param.append("pageSize", searchInfo.pageSize);
        param.append("blockSize", searchInfo.blockSize);

        // console.log("param ---> ", param.toString());

        await axios.post("/api/system/account", param).then( (res) => {
            // console.log(res);
            setAccountsList( (old) => (
                {
                    ...old,
                    accountList : res.data.accountList,
                    totalCnt : res.data.totalCnt,
                }
            ));
        })

    }

    const pagebutton = (e) => {
        // console.log(e.selected);
        searchList(parseInt(e.selected) + 1);
    }

    const pageCount = () => {
        return(
            accountsList.totalCnt % searchInfo.pageSize === 0 ?
                accountsList.totalCnt / searchInfo.pageSize : parseInt(accountsList.totalCnt / searchInfo.pageSize) + 1
        )
    }

    const closeModal = () => {
        setModalIsOpen(false);
    }

    const accountsDetail = (id) => {
        setUserId(id);
    }

    return (
        <div>
            <div className="content">
                <p className="Location">
                    <a className="btn_set home">메인으로</a>{" "}
                    <span className="btn_nav bold">시스템 관리</span>{" "}
                    <span className="btn_nav bold">계정관리</span>{" "}
                    <a className="btn_set refresh">새로고침</a>
                </p>
                <p className="conTitle" id="conTitle">
                    <span>사용자 관리</span>{" "}
                    <span className="fr">
                        <select id="searchKey" name="searchKey" style={{ width : 100, height: 30, margin: 1}}
                                value={searchInfo.searchKey}
                                onChange = { (e) => (
                                    setSearchInfo( (old) => (
                                        {
                                            ...old,
                                            searchKey : e.target.value,
                                        }
                                    ))
                                )}
                        >
                              <option value="">전체</option>
                              <option value="loginId">ID</option>
                              <option value="name">이름</option>
                          </select>
                        <input
                            type="text"
                            id="search"
                            name="search"
                            className="form-control"
                            style={{ width: 150, height: 35, margin: 1}}
                            value={searchInfo.search}
                            onChange = { (e) => (
                                setSearchInfo( (old) => (
                                    {
                                        ...old,
                                        search : e.target.value,
                                    }
                                ))
                            )}
                        />
                        <button
                            className="btn btn-primary"
                            name="searchBtn"
                            id="searchBtn"
                            onClick={ () => searchList(1)}
                        >
                            <span>검색</span>
                          </button>
                    </span>
                </p>
                <div>
                    <table className="col">
                        <colgroup>
                            <col width="10%" />
                            <col width="20%" />
                            <col width="20%" />
                            <col width="25%" />
                            <col width="25%" />
                        </colgroup>
                        <thead>
                        <tr>
                            <th>계정상태</th>
                            <th>ID</th>
                            <th>이름</th>
                            <th>가입일자</th>
                            <th>휴대폰 번호</th>
                        </tr>
                        </thead>
                        <tbody>
                        { accountsList.accountList.map( (user, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        <button className={user.status_yn === "Y" ? "btn-active" : "btn-inactive"}
                                                onClick={() => {
                                                    setModalIsOpen(true);
                                                    accountsDetail(user.loginID);
                                                }}>
                                            {user.status_yn === "Y" ? "활성" : "탈퇴"}
                                        </button>
                                    </td>
                                    <td>{user.loginID}</td>
                                    <td>{user.name}</td>
                                    <td>{user.regdate}</td>
                                    <td>{user.hp}</td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                    <br />
                    <ReactPaginate
                        className="pageNaviCss"
                        breakLabel="..."
                        nextLabel="다음 >"
                        onPageChange={pagebutton}
                        pageRangeDisplayed={searchInfo.blockSize}
                        pageCount={pageCount()}
                        previousLabel="< 이전"
                        renderOnZeroPageCount={null}
                        pageClassName="pageItem"
                        activeClassName="currentPageCss"
                        previousClassName="pageLabelBtn"
                        nextClassName="pageLabelBtn"
                    />
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                className="modalStyle"
                overlayClassName="modalOverlay"
                onRequestClose={closeModal}
            >
                <AccountsModal userId={userId} closeModal={closeModal} searchList={searchList}/>
            </Modal>
        </div>
    )
}

export default Accounts;
