import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

// SearchBar 컴포넌트는 부모(Returns.jsx)로부터 현재 검색 상태를 prop으로 받는다.
const SearchBar = ({ onSearch, onReturnAll, currentProductState }) => {

    // 새로고침 활성화 하려면...
    // JSP 코드의 <select id="searchKey">에 해당함.
    // 로컬 상태 대신, 부모로부터 받은 prop을 드롭다운의 값(value)으로 사용하거나,
    // 로컬 상태를 prop과 동기화해야 한다.!!

    // 여기서는 로컬 상태(searchKey)를 제거하고,
    // props로 받은 currentProductState를 직접 사용해서 UI를 제어한다.
    // 이렇게 하면 부모에서 handleSearch("")를 호출했을 때 즉시 UI가 업데이트된다.

    const displayValue = currentProductState || ''; // null이나 undefined일 경우 ""로 표시

    // 드롭다운 변경 핸들러
    const handleSearchKeyChange = (e) => {
        const newSearchKey = e.target.value;
        // 로컬 상태를 업데이트하지 않고, 바로 부모 컴포넌트의 onSearch를 호출하여
        // 부모 상태(searchParam)를 업데이트한다.
        // 부모 상태가 업데이트되면 다시 이 컴포넌트에 prop으로 전달된다.
        onSearch(newSearchKey);
    };

    return (
        <span className="fr">
            {/* 드롭다운의 value를 부모로부터 받은 currentProductState로 설정 */}
            <Form.Select
                id="searchKey"
                name="searchKey"
                value={displayValue} // <-- 부모 상태(prop)를 직접 사용하여 동기화
                onChange={handleSearchKeyChange}
                style={{ width: '100px' }}
            >
                {/* JSP 코드의 옵션 순서 및 값에 맞춰 수정 (JSP 코드 기준: Y, O, R) */}
                <option value="">상태</option>
                <option value="Y">사용중</option>
                <option value="O">사용신청중</option>
                <option value="R">반납신청중</option>
            </Form.Select>

            {/* '일괄 반납 신청' 버튼 렌더링 조건을 부모로부터 받은 상태로 제어 */}
            {displayValue === 'Y' && (
                <span style={{ display: 'inline-block', marginLeft: '3px' }}>
                    <a
                        className="modalBtn btn-primary"
                        id="returnAllBtn"
                        href="#"
                        onClick={(e) => {
                            e.preventDefault(); // 기본 <a> 동작 방지
                            onReturnAll(); // 부모 컴포넌트의 일괄 반납 함수 호출
                        }}
                        style={{
                            display: 'inline-block',      // inline-block으로 버튼처럼
                            width: '120px',               // 버튼 너비
                            height: '30px',               // 버튼 높이
                            lineHeight: '30px',           // 글자 수직 가운데 정렬
                            textAlign: 'center',          // 글자 가운데 정렬
                            borderRadius: '3px',         // 둥근 모서리
                            backgroundColor: '#f57324',   // 파란색 배경
                            color: '#fff',                // 글자 색 흰색
                            textDecoration: 'none',       // underline 제거
                            fontSize: '0.9rem',           // 글자 크기
                            fontWeight: '600',            // 글자 굵기
                            letterSpacing: '1px',         // 글자 간격
                            cursor: 'pointer',            // 마우스 커서
                            padding: '0 10px',            // 가로 패딩
                        }}
                    >
                        <span>일괄 반납 신청</span>
                    </a>
                </span>
            )}
        </span>
    );
}

export default SearchBar;