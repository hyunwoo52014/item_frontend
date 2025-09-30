import React, {useEffect, useState, createContext} from "react";
import HistoryBody from "../../components/history/HistoryBody";
import ReactPaginate from "react-paginate";
import axios from "axios";
import HistoryModal from "../../components/history/HistoryModal";
import customCss from "./css_custom/forHistory.css";
import HistorySearchAdmin from "../../components/history/HistorySearchAdmin";

//Context 생성, 기본값 provider가 없을 시 사용
export const HistoryModalContext = createContext({
    modalState : null,
    setModalState : ()=>{},
});

const History = () => {


    const [searchElement, setSearchElement] = useState({
        searchMajorSel : "",
        searchSubSel : "",
        searchTitle : "",
        pageSize : 5,
    });

    const [responseDataList, setResponseDataList] = useState({
        currentPage : 0,
        historyCnt : 0,
        historyList : [],
        pageSize : 0,
        status : 0,
        statusText : "",
    });

    const [subCategoryElementList, setSubCategoryElementList] = useState([]);

    const [modalState, setModalState] = useState({
        modalId : "history-modal",
        isOpen : false,
        payload : {},
    })

    const changeElement = (e) => {
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
            pageSize : searchElement.pageSize,
            currentPage : currentPage,
            searchMajorSel : searchElement.searchMajorSel,
            searchTitle : searchElement.searchTitle,
        });

        await axios.post("/requests/historyList",param)
            .then(res => {
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
                setResponseDataList((prev)=>(
                    {
                        ...prev,
                        historyCnt: 0,
                        historyList: [],
                    }
                ));
            });
    }

    const searchClickButton = (e) => {
        e.preventDefault();
        searchHandler();
    }

    const changePageEvent = (e)=> {
        searchHandler(parseInt(e.selected) + 1);
    }

    useEffect(() => {
        searchHandler();
    },[]);

    useEffect(() => {
        const selectElement = document.getElementById('searchSubSel');

        if(searchElement.searchMajorSel !== '') {
            const param = new URLSearchParams();
            param.append("flag", searchElement.searchMajorSel);

            axios.post("/requests/subCategoryList", param)
                .then(res => {
                    setSubCategoryElementList(res.data);
                    selectElement.style.display = "inline-block";
                    setSearchElement((prev) => (
                        {
                            ...prev,
                            searchSubSel: res.data[0]
                        }
                    ))
                })
                .catch(err => {
                    console.log("요청 에러");
                });
        } else {
            setSubCategoryElementList([]);
            selectElement.style.display = "none";
        }

    }, [searchElement.searchMajorSel]);


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
                                    <HistorySearchAdmin changeElement={changeElement} subCategoryElementList={subCategoryElementList}
                                                        searchElement={searchElement} searchClickButton={searchClickButton}/>
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