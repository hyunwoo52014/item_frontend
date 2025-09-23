import React, {useEffect, useState} from "react";
import HistoryList from "./HistoryList";
import ReactPaginate from "react-paginate";

const History = () => {

    const [searchElement, setSearchElement] = useState({
        searchSel : "",
        searchTitle : "",
        searchStatus : "",
    });

    const [historyList, setHistoryList] = useState([]);


    const changeElement = (e,value) => {
        setSearchElement((prev) => (
            {
                ...prev,
                [e.target.name] : e.target.value,
            }
        ));
    }
    const searchHandler = (currentPage = 1) => {

        currentPage = currentPage || 1;

    }

    const historyDetail = () => {

    }

    const deleteProduct = () => {

    }

    useEffect(() => {
        return () => {
            searchHandler();
        };
    }, []);

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
                                          <option value="" selected={true}>전체</option>
                                          <option value="team">소속</option>
                                          <option value="name">대여인</option>
                                          <option value="itProduct">IT 장비</option>
                                          <option value="status">상태</option>
                                        </select>
                                        <select id="searchStatus" name="searchStatus" style={{width: "100px", display: "none"}} onChange={changeElement}>
                                          <option value="" selected={true}>전체</option>
                                          <option value="Y">승인</option>
                                          <option value="N">반려</option>
                                        </select>
                                        <input type="text" style={{width: "300px", height: "25px"}} id="searchTitle"
                                               name="searchTitle"/>
                                        <a href="" className="btnType blue" id="btnSearchword" name="searchword" onClick={searchHandler}>
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
                                        <HistoryList historyList={historyList}
                                                     historyCnt={historyList.length}></HistoryList>
                                    </table>
                                </div>

                                <div className="paging_area" id="userPagination"></div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>


        </form>
    )
}

export default History