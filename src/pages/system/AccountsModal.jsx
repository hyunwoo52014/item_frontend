import "./Accounts.css"
import axios from "axios";
import React, {useEffect, useState} from "react";
import ReactPaginate from "react-paginate";
const AccountsModal = ({ userId, closeModal, searchList}) => {

    const [accountDetailList, setAccountDetailList] = useState({
        loginID: "",
        status_yn: "",
        name: "",
        regdate: "",
        team: "",
        addr: "",
        birthday: "",
        hp: ""
    });

    const [accountEquipList, setAccountEquipList] = useState({
        accountEquipList: [],
        pageSize: 5,
        blockSize: 5,
        totalCnt: 0
    })

    const [currentPage, setCurrentPage] = useState(1)
    const accountDetail = async () => {
        const param = new URLSearchParams();
        param.append("loginID", userId);

        // console.log(param.toString());
        await axios.post("/api/system/accountDetail", param).then( (res) => {
            setAccountDetailList(res.data.accountDetailList)
        })
    }

    useEffect(() => {
        accountDetail();
        accountEquip();
    }, []);

    const accountEquip = async (cPage = 1) => {
        setCurrentPage(cPage);

        const param = new URLSearchParams();
        param.append("loginID", userId);
        param.append("currentPage", cPage);
        param.append("pageSize", accountEquipList.pageSize);
        param.append("blockSize", accountEquipList.blockSize);

        await axios.post("/api/system/accountEquip", param).then( (res) => (
            setAccountEquipList( (old) => (
                {
                    ...old,
                    accountEquipList: res.data.accountEquipList,
                    totalCnt: res.data.totalCnt
                }
            ))
        ))
    }

    const pagebutton = (e) => {
        // console.log(e.selected);
        accountEquip(parseInt(e.selected) + 1);
    }

    const pageCount = () => {
        return(
            accountEquipList.totalCnt % accountEquipList.pageSize === 0 ?
                accountEquipList.totalCnt / accountEquipList.pageSize : parseInt(accountEquipList.totalCnt / accountEquipList.pageSize) + 1
        )
    }

    const accountDelete = async () => {
        const param = new URLSearchParams();
        param.append("loginID", userId)

        if (accountEquipList.accountEquipList.length > 0) {
            alert("현재 사용중인 장비가 있어 탈퇴가 불가능 합니다.\n모두 반납 후 다시 시도해 주세요.")
            return;
        }

        await axios.post("/api/system/accountDelete", param).then( (res) => {
            if(res.data.resultCode === "Y") {
                alert(res.data.resultMessage);
                closeModal();
                searchList();
            } else {
                alert(res.data.resultMessage)
                closeModal();
            }
        })
    }

    const accountRestore = async () => {
        const param = new URLSearchParams();
        param.append("loginID", userId);

        await axios.post("/api/system/accountRestore", param).then( (res) => {
            if(res.data.resultCode === "Y") {
                alert(res.data.resultMessage);
                closeModal();
                searchList();
            } else {
                alert(res.data.resultMessge);
                closeModal();
            }
        })
    }

    return (
        <div>
                <div id="userform">
                    <p className="conTitle">
                        <span>계정 상세정보</span>
                    </p>
                    <table className="row3" style={{ width: "350px", height: "350px", margin: 'auto'}}>
                        <colgroup>
                            <col width="35%" />
                            <col width="65%" />
                        </colgroup>
                        <tbody>
                        <tr>
                            <th>ID</th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    id="loginID"
                                    name="loginID"
                                    readOnly={true}
                                    value={accountDetailList.loginID || ""}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>이름</th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    id="name"
                                    name="name"
                                    readOnly={true}
                                    value={accountDetailList.name || ""}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>생년월일</th>
                            <td>
                                <input
                                    type="date"
                                    className="form-control input-sm"
                                    id="birthday"
                                    name="birthday"
                                    readOnly={true}
                                    value={accountDetailList.birthday || ""}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>전화번호</th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    id="hp"
                                    name="hp"
                                    readOnly={true}
                                    value={accountDetailList.hp || ""}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>주소</th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    id="addr"
                                    name="addr"
                                    readOnly={true}
                                    value={accountDetailList.addr || ""}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>소속팀</th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    id="team"
                                    name="team"
                                    readOnly={true}
                                    value={accountDetailList.team || ""}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>상태</th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    id="team"
                                    name="team"
                                    readOnly={true}
                                    value={accountDetailList.status_yn === "Y" ? "활성" : "탈퇴"}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>가입일</th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    id="regdate"
                                    name="regdate"
                                    readOnly={true}
                                    value={accountDetailList.regdate || ""}
                                />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div style={{padding:"24px"}}>
                        <table className="col">
                            <colgroup>
                                <col width="10%" />
                                <col width="20%" />
                                <col width="35%" />
                                <col width="35%" />
                            </colgroup>
                            <thead>
                            <tr>
                                <th colSpan="4">사용중인 장비 목록</th>
                            </tr>
                            <tr>
                                <th>장비 코드</th>
                                <th>장비 이름</th>
                                <th>사용 신청일</th>
                                <th>사용 시작일</th>
                            </tr>
                            </thead>
                            <tbody>
                            { accountEquipList.accountEquipList.length === 0 && <tr><td colSpan="4">사용중인 장비가 없습니다.</td></tr>}
                            { accountEquipList.accountEquipList.length > 0 &&
                                accountEquipList.accountEquipList.map( (user, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{user.category_code}-{user.product_detail_code}</td>
                                            <td>{user.product_name}</td>
                                            <td>{user.order_date}</td>
                                            <td>{user.rental_date}</td>
                                        </tr>
                                    )
                            })}
                            </tbody>
                        </table><br />
                        <ReactPaginate
                            className="pageNaviCss"
                            breakLabel="..."
                            nextLabel="다음 >"
                            onPageChange={pagebutton}
                            pageRangeDisplayed={accountEquipList.blockSize}
                            pageCount={pageCount()}
                            previousLabel="< 이전"
                            renderOnZeroPageCount={null}
                            pageClassName="pageItem"
                            activeClassName="currentPageCss"
                            previousClassName="pageLabelBtn"
                            nextClassName="pageLabelBtn"
                        />
                    </div>
                    <div style={{ display:"flex", justifyContent:"center"}}>
                        <button className="btn btn-primary mx-2" onClick={accountDetailList.status_yn === "Y" ? accountDelete : accountRestore}>{accountDetailList.status_yn === "Y" ? "탈퇴" : "활성"}</button>
                        <button className="btn btn-primary" onClick={closeModal}>취소</button>
                    </div>
                </div>
        </div>
    )
}

export default AccountsModal;