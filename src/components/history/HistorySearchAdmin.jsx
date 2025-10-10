import React, {useEffect, useState} from "react";
import axios from "axios";

const HistorySearchAdmin = ({searchElement, updateElement, changeElement, searchHandler}) => {

    // 검색에 사용할 하위 요소
    const [subCategoryElementList, setSubCategoryElementList] = useState([]);
    const [isSubCategoryVisible, setIsSubCategoryVisible] = useState(false);

    const [isTitleVisible, setIsTitleVisible] = useState(false);

    // 서브 카테고리 가져오기
    useEffect( () => {
        if(searchElement.searchMajorSel !== '') {
            const param = new URLSearchParams();
            param.append("flag", searchElement.searchMajorSel);

            axios.post("/requests/subCategoryList", param)
                .then(res => {
                    setSubCategoryElementList(res.data);
                    setIsSubCategoryVisible(true);
                    updateElement((prev) => (
                        {
                            ...prev,
                            searchSubSel: res.data[0],
                            currentPage: 0,
                        }
                    ))
                })
                .catch(err => {
                    setIsSubCategoryVisible(false);
                    console.log("요청 에러");
                });
        } else {
            setSubCategoryElementList([]);
            setIsSubCategoryVisible(false);
            updateElement((prev) => (
                {
                    ...prev,
                    searchSubSel: '',
                    currentPage: 0,
                }
            ))
        }

        switch(searchElement.searchMajorSel.toUpperCase()) {
            case "TEAM":
                setIsTitleVisible(false);
                break;
            case "NAME":
                setIsTitleVisible(false);
                break;
            case "ITPRODUCT":
                setIsTitleVisible(true);
                break;
            case "STATUS":
                setIsTitleVisible(false);
                break;
            default :
                setIsTitleVisible(true);
                break;
        }

    }, [searchElement.searchMajorSel]);

    const clickEvent = (e)=> {
        e.preventDefault();
        searchHandler();
    }
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
                    style={{width: "100px", display: isSubCategoryVisible ? "inline-block" : "none"}}
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
                   name="searchTitle" value={searchElement.searchTitle} onChange={changeElement}
                   style={{display: isTitleVisible ? "inline-block" : "none"}}
            />
            <a href="" className="btnType blue" id="btnSearchword" name="searchword"
               onClick={clickEvent}>
                <span>검 색</span>
            </a>
        </span>
    );
}

export default HistorySearchAdmin;