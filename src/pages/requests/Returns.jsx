import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ReturnsTable } from './ReturnsTable.jsx';
import SearchBar from './SearchBar.jsx';
import { Pagination } from './Pagination.jsx';
import { ApplyModal } from './ApplyModal.jsx';
import Session from "react-session-api";

const Returns = () => {

    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [searchParam, setSearchParam] = useState({ productState: '' });
    const [newSearchKey, setNewSearchKey] = useState('');

    // API에서 반납 목록을 가져오는 함수
    const fetchReturnsList = async () => {
        try {
            // 사용자 ID를 세션에서 가져옵니다.
            const userLoginId = sessionStorage.getItem("loginId");

            // 백엔드에 보낼 데이터 (요청 파라미터)
            const param = {
                // ...searchParam 을 직접 사용하는 대신, 필요한 값만 명시적으로 전달
                //...searchParam,
                productState: searchParam.productState,  // 백엔드 매퍼의 변수명에 맞췄음
                currentPage: currentPage,
                pageSize: pageSize,
                loginId: userLoginId
            };

            const postData = new URLSearchParams(param);

            // axios.get을 사용하여 API 호출
            const response = await axios.post(
                "/requests/returns/returnsList", // 절대경로를 제거하고 상대경로로 변경
                postData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Accept: "application/json",
                    },
                }
            );

            // 성공적으로 데이터를 받아왔을 때
            if (response.data) {
                setList(response.data.returnsList);
                setTotalCount(response.data.returnsCnt);
            }
        } catch (error) {
            console.error("데이터 로딩 실패:", error);
            setList([]);
            setTotalCount(0);
        }
    };

    // 페이지 변경 핸들러 함수
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // 검색 핸들러 함수
    const handleSearch = (newSearchKey) => {
        setSearchParam({ productState: newSearchKey });
        setCurrentPage(1);
    };

    // 일괄 반납 신청 버튼 클릭 핸들러
    const handleReturnAll = async () => {
        const userLoginId = sessionStorage.getItem("loginId");
        if (!userLoginId) {
            alert("사용자 로그인이 필요합니다.");
            return;
        }

        if (window.confirm("사용중인 모든 기기를 반납 신청하시겠습니까?")) {
            const param = { loginId: userLoginId };
            const postData = new URLSearchParams(param);

            try {
                const response = await axios.post(
                    "/requests/returns/returnAll",
                    postData,
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            Accept: "application/json",
                        },
                    }
                );

                if (response.data.result === "SUCCESS") {
                    alert(response.data.resultMsg);
                    fetchReturnsList(); // 성공 시 목록 새로고침
                } else {
                    alert(response.data.resultMsg);
                }
            } catch (error) {
                console.error("일괄 반납 실패:", error);
                alert("일괄 반납 처리에 실패했습니다.");
            }
        }
    };

    // 반납 상세 보기 핸들러 함수
    const handleReturnDtl = (productCode, categoryCode) => {
        // TODO: 반납신청 API 호출 로직을 여기에 작성하세요.
        console.log("반납신청", productCode, categoryCode);
    };

    // 취소 상세 보기 핸들러 함수
    const handleCancelDtl = (productCode, categoryCode) => {
        // TODO: 취소 API 호출 로직을 여기에 작성하세요.
        console.log("취소 신청", productCode, categoryCode);
    };

    // `currentPage` 또는 `searchParam`이 변경될 때마다 데이터를 다시 가져옴
    useEffect(() => {
        fetchReturnsList();
    }, [currentPage, searchParam]);

    return (
        <div>
            <p className="Location">
                <a href="../dashboard/dashboard.do" className="btn_set home">메인으로</a>
                <span className="btn_nav bold">신청/반납</span>
                <span className="btn_nav bold">반납일괄 신청</span>
                <a href="/requests/returns" className="btn_set refresh">새로고침</a>
            </p>

            <p className="conTitle">
                <span>내 장비 관리</span>
                <SearchBar onSearch={handleSearch} onReturnAll={handleReturnAll} />
            </p>

            <div id="divReturnsList">
                <ReturnsTable
                    list={list.filter(item => {
                        if (!searchParam.productState) return true; // 전체 보기
                        return item.product_state === searchParam.productState;
                    })}
                    onReturnDtl={handleReturnDtl}
                    onCancelDtl={handleCancelDtl}
                />
            </div>

            <div className="paging_area" id="pagingnavi">
                <Pagination
                    currentPage={currentPage}
                    totalCount={totalCount}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                />
            </div>
            {isModalOpen && <ApplyModal data={modalData} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default Returns;