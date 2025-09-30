import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

const SearchBar = ({ onSearch, onReturnAll }) => {
    // JSP 코드의 <select id="searchKey">에 해당함
    const [searchKey, setSearchKey] = useState('');

    // jQuery의 change 이벤트에 해당하는 핸들러 함수. 드롭다운 변경 핸들러
    const handleSearchKeyChange = (e) => {
        const newSearchKey = e.target.value;
        setSearchKey(newSearchKey);
        onSearch(newSearchKey); // 부모 컴포넌트로 변경된 searchKey 값 전달
    };

    // // '상태'가 '사용중(Y)'일 때만 '일괄 반납 신청' 버튼을 보이도록 함
    // useEffect(() => {
    //     const returnAllBtn = document.getElementById('returnAllBtn');
    //     if (returnAllBtn) {
    //         if (searchKey === 'Y') {
    //             returnAllBtn.style.display = 'inline-block';
    //         } else {
    //             returnAllBtn.style.display = 'none';
    //         }
    //     }
    // }, [searchKey]);

    return (
        <span className="fr">
            <Form.Select
                id="searchKey"
                name="searchKey"
                value={searchKey}
                onChange={handleSearchKeyChange}
                style={{ width: '100px' }}
            >
                <option value="">상태</option>
                <option value="Y">사용중</option>
                <option value="O">사용신청중</option>
                <option value="R">반납신청중</option>
            </Form.Select>
            {/* searchKey가 'Y'일 때만 '일괄 반납 신청' 버튼을 렌더링 */}
            {searchKey === 'Y' && (
                <a className="btnType blue" id="returnAllBtn" href="#" onClick={onReturnAll}>
                    <span>일괄 반납 신청</span>
                </a>
            )}
        </span>
    );
}


export default SearchBar;