import React, {useEffect, useState} from "react";
import axios from "axios";

const HistorySearchAdmin = ({searchElement, updateElement, getResponseElement, changeElement, searchDataEvent, currentPage}) => {

    // 검색에 사용할 하위 요소
    const [subCategoryElementList, setSubCategoryElementList] = useState([]);
    
    // 검색
    const searchHandler = async (currentPage = 1) => {
        currentPage = currentPage || 1;

        const param = new URLSearchParams({
            pageSize: searchElement.pageSize,
            currentPage: currentPage,
            searchMajorSel: searchElement.searchMajorSel,
            searchTitle: searchElement.searchTitle,
        });

        await axios.post("/requests/historyList", param)
            .then(res => {
                getResponseElement({
                    currentPage: res.data.currentPage,
                    historyCnt: res.data.historyCnt,
                    historyList: res.data.historyList,
                    pageSize: res.data.pageSize,
                    status: res.status,
                    statusText: res.statusText,
                });
            })
            .catch((err) => {
                getResponseElement((prev) => (
                    {
                        ...prev,
                        historyCnt: 0,
                        historyList: [],
                    }
                ));
            });
    }

    // 처음 컴포넌트가 렌더링 됬을 때, 검색 한번 실행
    useEffect(() => {
        searchHandler(currentPage);
    },[currentPage]);

    // 서브 카테고리 가져오기
    useEffect(() => {
        const selectElement = document.getElementById('searchSubSel');

        if(searchElement.searchMajorSel !== '') {
            const param = new URLSearchParams();
            param.append("flag", searchElement.searchMajorSel);

            axios.post("/requests/subCategoryList", param)
                .then(res => {
                    setSubCategoryElementList(res.data);
                    selectElement.style.display = "inline-block";
                    updateElement((prev) => (
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
        <span className="fr">
            <select id="searchMajorSel" name="searchMajorSel" style={{width: "100px"}}
                    value={searchElement.searchMajorSel} onChange={changeElement}
            >
                <option value="" defaultValue>전체</option>
                <option value="team">소속</option>
                <option value="name">대여인</option>
                <option value="itProduct">IT 장비</option>
                <option value="status">상태</option>
            </select>
            <select id="searchSubSel" name="searchSubSel"
                    style={{width: "100px", display: "none"}}
                    value={searchElement.searchSubSel} onChange={changeElement}
            >
                {
                    subCategoryElementList.map((item, index) => (
                        <option key={index} value={item}>
                            {item}
                        </option>
                    ))
                }
            </select>
            <input type="text" style={{width: "300px", height: "30px"}} id="searchTitle"
                   name="searchTitle"
                   value={searchElement.searchTitle} onChange={changeElement}/>
            <a href="" className="btnType blue" id="btnSearchword" name="searchword"
               onClick={(e)=>searchDataEvent(e,searchHandler)}>
                <span>검 색</span>
            </a>
        </span>
    );
}

export default HistorySearchAdmin;