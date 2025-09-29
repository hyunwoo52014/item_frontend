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

export const SearchBar = () => {
    return (
        <></>
    )
}


export default SearchBar;