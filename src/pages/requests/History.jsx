import React, {useEffect, useState, createContext} from "react";
import HistoryBody from "../../components/history/HistoryBody";
import ReactPaginate from "react-paginate";
import axios from "axios";
import HistoryModal from "../../components/history/HistoryModal";
import customCss from "./css_custom/forHistory.css";
import HistorySearchAdmin from "../../components/history/HistorySearchAdmin";
import HistorySearchUser from "../../components/history/HistorySearchUser";

//Context 생성, 기본값 provider가 없을 시 사용
export const HistoryModalContext = createContext({
    modalState : null,
    setModalState : ()=>{},
});

const History = () => {

    // 모든 자식 컴포넌트에서 사용할 공용 변수들만 선언
    // 검색에 사용할 요소
    const [searchElement, setSearchElement] = useState({
        searchMajorSel : "",
        searchSubSel : "",
        searchTitle : "",
        pageSize : 5,
    });
    // 검색 응답 받을 시 사용할 요소
    const [responseDataList, setResponseDataList] = useState({
        currentPage : 0,
        historyCnt : 0,
        historyList : [],
        pageSize : 0,
        status : 0,
        statusText : "",
    });

    // 현재 페이지
    const [currentPage, setCurrentPage] = useState(0);

    // 유저 타입 받기
    const [userType, setUserType] = useState('');

    // 모달창 상태 정보
    const [modalState, setModalState] = useState({
        modalId : "history-modal",
        isOpen : false,
        payload : {},
    })

    // 자바스크립트 객체 값 변경 저장용 공용 함수
    const changeElement = (e) => {
        setSearchElement((prev) => (
            {
                ...prev,
                [e.target.name] : e.target.value,
            }
        ));
    }


    // 검색 실행 이벤트 선언, 자식에서 구현 후 실행
    const searchDataEvent = (e, searchHandler) => {
        e.preventDefault();
        searchHandler();
    }

    // 네비게이션 값 변경시 수행해야할 함수, 자식에서 구현 후 실행
    const changePageEvent = (e) => {
        const currentPage = parseInt(e.selected) + 1;
        setCurrentPage(currentPage);
    }

    // 유저 타입 가져오는 함수, 최초실행시만
    useEffect(() => {
        const storedUserTypeData = sessionStorage.getItem("userType");

        if(storedUserTypeData === "A"){
            setUserType(storedUserTypeData);
        }
    },[]);



    return (
        <form id="myForm" action="" method="">
            <HistoryModalContext.Provider value={{modalState, setModalState}}>
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
                                    {
                                        userType === "A" ?
                                            <HistorySearchAdmin searchElement={searchElement} updateElement={setSearchElement}
                                                                getResponseElement={setResponseDataList} changeElement={changeElement}
                                                                searchDataEvent={searchDataEvent} currentPage={currentPage}
                                            />
                                            :
                                            <HistorySearchUser  />
                                    }


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
                                        activeClassName={"active"}
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
                </div>
            </div>
            {modalState.isOpen && <HistoryModal searchHandler = {searchHandler} />}
            </HistoryModalContext.Provider>
        </form>
    )
}

export default History