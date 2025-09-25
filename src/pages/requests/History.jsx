import React, {useEffect, useState, createContext} from "react";
import HistoryBody from "./HistoryBody";
import ReactPaginate from "react-paginate";
import axios from "axios";
import HistoryModal from "./HistoryModal";

const History = () => {


    const [searchElement, setSearchElement] = useState({
        searchSel : "",
        searchTitle : "",
        searchStatus : "",
    });

    const [responseDataList, setResponseDataList] = useState({
        currentPage : 0,
        historyCnt : 0,
        historyList : [],
        pageSize : 0,
        status : 0,
        statusText : "",
    });

    const changeElement = (e,value) => {
        setSearchElement((prev) => (
            {
                ...prev,
                [e.target.name] : e.target.value,
            }
        ));
    }
    const searchHandler = async (currentPage = 1) => {
        currentPage = currentPage || 1;

        const param = new URLSearchParams({
            pageSize : 5,
            currentPage : currentPage,
            searchSel : searchElement.searchSel,
            searchTitle : searchElement.searchTitle,
        });

        await axios.post("/requests/historyList",param)
            .then(res => {
                console.log("res",res);
                setResponseDataList({
                    currentPage : res.data.currentPage,
                    historyCnt : res.data.historyCnt,
                    historyList : res.data.historyList,
                    pageSize : res.data.pageSize,
                    status : res.status,
                    statusText : res.statusText,
                });
            })
            .catch((err)=>{
                console.log("err",err);
            });
    }

    const searchClickButton = (e) => {
        e.preventDefault();
        searchHandler();
    }

    const changePageEvent = (e)=> {
        console.log("selected",e.selected);
        searchHandler(parseInt(e.selected) + 1);
    }

    const historyDetail = () => {

    }

    const deleteProduct = () => {

    }

    useEffect(() => {
        searchHandler();
    },[]);


    return (
        <form id="myForm" action="" method="">
            <div id="wrap_area">
                <div id="container">
                    <ul>
                        <li className="contents">
                            <div className="content">

                                <p className="Location">
                                    <a href="../dashboard/dashboard.do" className="btn_set home">메인으로</a>
                                    <span className="btn_nav bold">신청/반납</span>
                                    <span className="btn_nav bold">사용 히스토리</span>
                                    <a href={window.location.pathname} className="btn_set refresh">새로고침</a>
                                </p>

                                <p className="conTitle">
                                    <span>IT 자산관리</span>
                                    <span className="fr">
                                        <select id="searchSel" name="searchSel" style={{width: "100px"}}
                                                onChange={changeElement}
                                        >
                                          <option value="" defaultValue>전체</option>
                                          <option value="team">소속</option>
                                          <option value="name">대여인</option>
                                          <option value="itProduct">IT 장비</option>
                                          <option value="status">상태</option>
                                        </select>
                                        <select id="searchStatus" name="searchStatus" style={{width: "100px", display: "none"}} onChange={changeElement}>
                                          <option value="" defaultValue>전체</option>
                                          <option value="Y">승인</option>
                                          <option value="N">반려</option>
                                        </select>
                                        <input type="text" style={{width: "300px", height: "25px"}} id="searchTitle"
                                               name="searchTitle" onChange={changeElement}/>
                                        <a href="" className="btnType blue" id="btnSearchword" name="searchword" onClick={searchClickButton}>
                                            <span>검 색</span>
                                        </a>
                                    </span>
                                </p>

                                <div id="divEqList">
                                    <table className="col">
                                        <caption>caption</caption>
                                        <colgroup>
                                            <col width="15%"/>
                                            <col width="10%"/>
                                            <col width="35%"/>
                                            <col width="15%"/>
                                            <col width="15%"/>
                                            <col width="10%"/>
                                        </colgroup>

                                        <thead>
                                        <tr>
                                            <th scope="col">소속</th>
                                            <th scope="col">대여인</th>
                                            <th scope="col">대여한 장비</th>
                                            <th scope="col">대여일</th>
                                            <th scope="col">반납일</th>
                                            <th scope="col">상태</th>
                                        </tr>
                                        </thead>
                                        <HistoryBody historyList={responseDataList.historyList}/>
                                    </table>
                                </div>

                                <div className="paging_area" id="userPagination">
                                    <ReactPaginate
                                        containerClassName={"history_pagination"}
                                        pageClassName={"history_pagination_li"}
                                        breakLabel="..."
                                        nextLabel="다음 >"
                                        onPageChange={changePageEvent}
                                        pageRangeDisplayed={responseDataList.pageSize}
                                        pageCount={responseDataList.historyCnt % responseDataList.pageSize === 0 ? responseDataList.historyCnt/responseDataList.pageSize : Math.floor(responseDataList.historyCnt/responseDataList.pageSize) + 1}
                                        previousLabel="< 이전"
                                        renderOnZeroPageCount={null}
                                    />
                                </div>
                            </div>
                        </li>
                    </ul>
                    <HistoryModal />
                </div>
            </div>
        </form>
    )
}

export const HistoryModalContext = createContext({
    id: "history-modal",
    isOpen: false,
    payload: {}
});

export default History