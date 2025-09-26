import React, { useState, useEffect } from 'react';
import RentalList from './RentalList';
import './RentalListPage.css';

const Rent = () => {
    // State 관리
    const [rentalList, setRentalList] = useState([]);
    const [rentalListCnt, setRentalListCnt] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [paginationElements, setPaginationElements] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // 페이징 설정
    const pageSize = 10;
    const blockSize = 5;

    // 컴포넌트 마운트 시 초기 데이터 로드
    useEffect(() => {
        selectRentalList(1);
    }, []);

    // 페이징 네비게이션 생성
    useEffect(() => {
        if (rentalListCnt > 0) {
            generatePagination(currentPage, rentalListCnt);
        }
    }, [currentPage, rentalListCnt]);

    // 페이징 네비게이션 생성 함수
    const generatePagination = (currentPage, totalCnt) => {
        const totalPages = Math.ceil(totalCnt / pageSize);
        const startPage = Math.floor((currentPage - 1) / blockSize) * blockSize + 1;
        const endPage = Math.min(startPage + blockSize - 1, totalPages);

        let elements = [];

        // 맨 앞으로
        if (currentPage > 1) {
            elements.push(
                <a
                    key="first"
                    className="first"
                    onClick={() => selectRentalList(1)}
                    style={{ cursor: 'pointer' }}
                >
                    <span>&lt;&lt;</span>
                </a>
            );
            elements.push(
                <a
                    key="prev"
                    className="pre"
                    onClick={() => selectRentalList(currentPage - 1)}
                    style={{ cursor: 'pointer' }}
                >
                    <span>&lt;</span>
                </a>
            );
        }

        // 페이지 번호
        for (let i = startPage; i <= endPage; i++) {
            if (i === currentPage) {
                elements.push(
                    <strong key={i}>{i}</strong>
                );
            } else {
                elements.push(
                    <a
                        key={i}
                        onClick={() => selectRentalList(i)}
                        style={{ cursor: 'pointer' }}
                    >
                        {i}
                    </a>
                );
            }
        }

        // 맨 뒤로
        if (currentPage < totalPages) {
            elements.push(
                <a
                    key="next"
                    className="next"
                    onClick={() => selectRentalList(currentPage + 1)}
                    style={{ cursor: 'pointer' }}
                >
                    <span>&gt;</span>
                </a>
            );
            elements.push(
                <a
                    key="last"
                    className="last"
                    onClick={() => selectRentalList(totalPages)}
                    style={{ cursor: 'pointer' }}
                >
                    <span>&gt;&gt;</span>
                </a>
            );
        }

        setPaginationElements(elements);
        console.log("Pagination generated for page:", currentPage);
    };

    // AJAX 호출 함수
    const callAjax = async (url, method, responseType, isAsync, params, callback) => {
        setIsLoading(true);
        try {
            console.log("Sending request to:", url);
            console.log("Request params:", params);

            // URL 파라미터로 변환
            const formData = new URLSearchParams();
            Object.keys(params).forEach(key => {
                formData.append(key, params[key]);
            });

            const response = await fetch(url, {
                method: method.toUpperCase(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                body: formData,
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Response data:", data);
            callback(data);
        } catch (error) {
            console.error('AJAX Error:', error);
            // 에러 처리 - 실제 환경에서는 사용자에게 에러 메시지 표시
            callback({
                rentalList: [],
                rentalListCnt: 0,
                success: false,
                error: error.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    // 대여 현황 페이지 넘기기
    const selectRentalList = (page = 1) => {
        console.log("selectRentalList currentPage: " + page);

        const param = {
            currentPage: page,
            pagesize: pageSize,
            searchKeyword: searchKeyword
        };

        const resultCallback = (data) => {
            console.log("AJAX Response: ", data);

            if (!data.success || data.error) {
                console.error("Error loading data:", data.error);
                setRentalList([]);
                setRentalListCnt(0);
                return;
            }

            // 데이터 업데이트
            const rentalListData = data.rentalList || [];
            const totalCount = data.rentalListCnt || 0;

            console.log("Received rental list:", rentalListData);
            console.log("Total count:", totalCount);

            setRentalList(rentalListData);
            setRentalListCnt(totalCount);
            setCurrentPage(page);

            console.log("Updated state - rentalList length:", rentalListData.length);
            console.log("Updated totalCount:", totalCount);
        };

        callAjax("/system/rentalList.do", "post", "json", true, param, resultCallback);
    };

    // 검색 함수
    const searchProducts = () => {
        console.log("Searching with keyword:", searchKeyword);
        selectRentalList(1);
    };

    // 검색 초기화
    const resetSearch = () => {
        console.log("Resetting search");
        setSearchKeyword('');
        // searchKeyword가 빈 문자열로 설정된 후 검색 실행
        setTimeout(() => {
            selectRentalList(1);
        }, 0);
    };

    // Enter 키 이벤트 핸들러
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchProducts();
        }
    };

    // 검색 키워드 변경 핸들러
    const handleSearchKeywordChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    return (
        <div className="rental-list-page">
            <form id="myForm">
                {/* Hidden inputs */}
                <input type="hidden" id="currenViewPage" value={currentPage} />
                <input type="hidden" id="tmpList" value="" />
                <input type="hidden" id="tmpListNum" value="" />

                {/* 모달 배경 */}
                <div id="mask"></div>

                <div id="wrap_area">
                    <h2 className="hidden">header 영역</h2>

                    <h2 className="hidden">컨텐츠 영역</h2>
                    <div id="container">
                        <ul>
                            <li className="lnb">
                                <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '500px' }}>
                                    <h3>사이드 메뉴</h3>
                                    <p>메뉴 항목들...</p>
                                </div>
                            </li>
                            <li className="contents">
                                <h3 className="hidden">contents 영역</h3>
                                <div className="content">
                                    {/* 브레드크럼 네비게이션 */}
                                    <p className="Location">
                                        <a href="../dashboard/dashboard.do" className="btn_set home">메인으로</a>
                                        <span className="btn_nav bold">시스템관리</span>
                                        <span className="btn_nav bold">대여 현황</span>
                                        <a href="/system/rent" className="btn_set refresh">새로고침</a>
                                    </p>

                                    {/* 검색 섹션 */}
                                    <div className="search-section">
                                        <div className="search-form">
                                            <label htmlFor="searchKeyword">검색:</label>
                                            <input
                                                type="text"
                                                id="searchKeyword"
                                                name="searchKeyword"
                                                className="search-input"
                                                placeholder="카테고리명 또는 제품상세코드로 검색"
                                                value={searchKeyword}
                                                onChange={handleSearchKeywordChange}
                                                onKeyPress={handleKeyPress}
                                                disabled={isLoading}
                                            />
                                            <button
                                                type="button"
                                                className="btn-search"
                                                onClick={searchProducts}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? '검색중...' : '검색'}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-secondary"
                                                onClick={resetSearch}
                                                disabled={isLoading}
                                            >
                                                초기화
                                            </button>
                                        </div>
                                    </div>

                                    {/* 대여 현황 테이블 */}
                                    <div id="divRentalList">
                                        <h4>대여 현황 목록</h4>
                                        {isLoading && (
                                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                                <p>데이터를 불러오는 중...</p>
                                            </div>
                                        )}

                                        {/* 디버깅 정보 표시 */}
                                        <div style={{ margin: '10px 0', padding: '10px', backgroundColor: '#f0f0f0', fontSize: '12px' }}>
                                            <p>현재 상태: 총 {rentalListCnt}개, 현재 페이지: {currentPage}, 표시할 항목: {rentalList.length}개</p>
                                            <p>로딩 중: {isLoading ? 'Yes' : 'No'}</p>
                                        </div>

                                        <table className="tb_list">
                                            <thead>
                                            <tr>
                                                <th>장비번호</th>
                                                <th>모델명</th>
                                                <th>팀</th>
                                                <th>상품상태</th>
                                                <th>대여자</th>
                                            </tr>
                                            </thead>
                                            <tbody id="rentalList">
                                            <RentalList
                                                rentalList={rentalList}
                                                rentalListCnt={rentalListCnt}
                                                pageSize={pageSize}
                                                currentPage={currentPage}
                                            />
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* 페이징 처리 */}
                                    <div className="paging_area">
                                        <div id="rentalPagination" className="paging">
                                            {paginationElements}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <h3 className="hidden">푸터 영역</h3>
                    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', textAlign: 'center', borderTop: '1px solid #dee2e6' }}>
                        <p>&copy; 2024 Company Name. All rights reserved.</p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Rent;