import React, {useState} from "react";
import axios from "axios";

const HistorySearchUser = ({searchElement, setResponseDataList, changeElement}) => {

    const searchUserHistoryButton = (e) => {
        e.preventDefault();
        searchUserHistoryHandler();
    }

    const searchUserHistoryHandler = async (currentPage = 1) => {
        currentPage = currentPage || 1;

        const param = new URLSearchParams({
            pageSize : searchElement.pageSize,
            currentPage : currentPage,
            searchMajorSel : searchElement.searchMajorSel,
            searchSubSel : searchElement.searchSubSel,
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

    return (
        <span className="fr">
            <select id="searchMajorSel" name="searchMajorSel" style={{width: "100px"}}
                    value={searchElement.searchMajorSel} onChange={changeElement}
            >
                <option value="" defaultValue>전체</option>
                <option value="itProduct">IT 장비</option>
                <option value="rentalDate">대여일</option>
                <option value="returnDate">반납일</option>
                <option value="status">상태</option>
            </select>
            <input type="text" style={{width: "300px", height: "30px"}} id="searchTitle"
                   name="searchTitle"
                   value={searchElement.searchTitle} onChange={changeElement}/>
            <a href="" className="btnType blue" id="btnSearchword" name="searchword"
               onClick={searchUserHistoryButton}>
                <span>검 색</span>
            </a>
        </span>
    )

}
export default HistorySearchUser;