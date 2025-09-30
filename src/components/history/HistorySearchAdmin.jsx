import React from "react";

const HistorySearchAdmin = ({searchElement, changeElement, subCategoryElementList, searchClickButton}) => {
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
               onClick={searchClickButton}>
                <span>검 색</span>
            </a>
        </span>
    );
}

export default HistorySearchAdmin;