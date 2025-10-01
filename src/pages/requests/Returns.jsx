import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ReturnsTable } from './ReturnsTable.jsx';
import SearchBar from './SearchBar.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import ReturnsModal from './ReturnsModal.jsx';
import Session from "react-session-api";
import ReturnsPagination from "./ReturnsPagination";


const Returns = () => {

    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [searchParam, setSearchParam] = useState({ productState: '' });
    const safeTotalPage = totalCount > 0 ? Math.ceil(totalCount / pageSize) : 1;
    //const totalPages = Math.ceil(totalCount / pageSize);
    const totalPages = totalCount > 0 ? Math.ceil(totalCount / pageSize) : 1;
    console.log('totalPages in Returns.jsx:', totalPages); // 확인

    // 반납 목록 조회
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
                "/requests/returns/returnsList", // 상대경로로 변경
                postData, // JSON 객체를 바로 전달
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Accept: "application/json",
                    },
                }
            );

            // 성공적으로 데이터를 받아왔을 때
            if (response.data) {

                // 로그 추가: totalCount 값 확인
                console.log('fetchReturnsList setTotalCount:', response.data.totalCount);

                setList(response.data.returnsList);
                setTotalCount(response.data.totalCount || response.data.returnsCnt);
            }
        } catch (error) {
            console.error("데이터 로딩 실패:", error);
            setList([]);
            setTotalCount(0);
        }
    };

    // 페이지 변경 핸들러 함수
    const handlePageChange = (page) => setCurrentPage(page);

    // 검색 핸들러 함수
    const handleSearch = (newSearchKey) => {
        setSearchParam({ productState: newSearchKey });
        setCurrentPage(1);
    };

    // 일괄 반납 신청 버튼 클릭 핸들러
    const handleReturnAll = async () => {
        const userLoginId = sessionStorage.getItem("loginId");
        if (!userLoginId) {
            alert("로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.");
            return;
        }

        if (window.confirm("사용중인 모든 기기를 반납 신청하시겠습니까?")) {
            // 1. 전송할 파라미터 객체 정의
            const param = { loginId: userLoginId };
            // 2. URLSearchParams를 사용하여 폼 데이터 형식으로 변환
            const postData = new URLSearchParams(param);

            try {
                const response = await axios.post(
                    "/requests/returns/returnAll",
                    postData, // <--- URLSearchParams 객체를 본문으로 전달
                    {
                        headers: {
                            // 3. Content-Type을 폼 데이터 형식으로 명시
                            "Content-Type": "application/x-www-form-urlencoded",
                            Accept: "application/json",
                        },
                    }
                );

                if (response.data.result === "SUCCESS") {
                    alert(response.data.resultMsg);
                    fetchReturnsList(); // 성공 시 목록 새로고침
                } else {
                    alert(`처리 실패: ${response.data.resultMsg || '일괄 반납 신청에 실패하였습니다.'}`);
                }
            } catch (error) {
                console.error("일괄 반납 실패:", error);
                alert("일괄 반납 처리에 실패했습니다.");
            }
        }
    };

    // 반납 상세 보기 핸들러 함수
    const handleReturnDtl = async (productCode, categoryCode) => {
        const userLoginId = sessionStorage.getItem("loginId");
        if (!userLoginId) return alert("로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.");

        if (!window.confirm("선택한 장비를 반납 신청하시겠습니까?")) return;

        const param = { loginId: userLoginId, product_detail_code: productCode, category_code: categoryCode };
        const postData = new URLSearchParams(param);

        try {
            const response = await axios.post(
                "/requests/returns/returnDtl",
                postData,
                { headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" } }
            );

            if (response.data.result === "SUCCESS") {
                alert(response.data.resultMsg || "반납 신청이 완료되었습니다.");

                // 개별 항목만 상태 업데이트
                setList(prevList =>
                    prevList.map(item =>
                        item.product_detail_code === productCode && item.category_code === categoryCode
                            ? { ...item, product_state: "R" } // 반납 신청 상태로 변경
                            : item
                    )
                );
            } else {
                alert(`반납 신청 실패: ${response.data.resultMsg || '오류가 발생했습니다.'}`);
            }
        } catch (error) {
            console.error("반납 신청 실패:", error);
            alert("반납 신청 처리 중 오류가 발생했습니다.");
        }
    };


    // 취소 상세 보기 핸들러 함수
    const handleCancelDtl = async (productCode, categoryCode) => {
        const userLoginId = sessionStorage.getItem("loginId");
        if (!userLoginId) return alert("로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.");
        if (!window.confirm("선택한 장비의 반납 신청을 취소하시겠습니까?")) return;

        const param = { loginId: userLoginId, product_detail_code: productCode, category_code: categoryCode };
        const postData = new URLSearchParams(param);

        try {
            const response = await axios.post(
                "/requests/returns/cancelDtl",
                postData,
                { headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" } }
            );

            if (response.data.result === "SUCCESS") {
                alert(response.data.resultMsg || "반납 신청 취소가 완료되었습니다.");

                // 개별 항목만 상태 업데이트
                setList(prevList =>
                    prevList.map(item =>
                        item.product_detail_code === productCode && item.category_code === categoryCode
                            ? { ...item, product_state: "Y" } // 사용중 상태로 복원
                            : item
                    )
                );
            } else {
                alert(`반납 취소 실패: ${response.data.resultMsg || '오류가 발생했습니다.'}`);
            }
        } catch (error) {
            console.error("반납 취소 실패:", error);
            alert("반납 취소 처리 중 오류가 발생했습니다.");
        }
    };


    // 모달 열기(개별 항목 클릭)
    const handleItemDtl = async (item) => {
        try {
            const param = {
                product_detail_code: item.product_detail_code,
                category_code: item.category_code
            };
            const postData = new URLSearchParams(param);

            const response = await axios.post(
                "/requests/returns/stateDetail",
                postData,
                { headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" } }
            );

            if (response.data) {
                const detail = response.data;

                setModalData({
                    assetName: item.product_name || 'N/A', // 리스트에서 받음
                    assetCode: detail.product_detail_code || 'N/A',
                    user: detail.user_name || detail.loginID || 'N/A',
                    applicationDate: detail.order_date  || '-',
                    startDate: detail.rental_date || '-',
                    reason: detail.return_reason || '사유 없음',
                    currentStatus:
                        detail.product_state === 'Y' ? '사용중' :
                            detail.product_state === 'R' ? '반납신청중' :
                                detail.product_state === 'C' ? '사용신청중' : '기타',
                    product_detail_code: detail.product_detail_code,
                });

                // 모달 상태를 열림으로 변경
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error("상세조회 실패:", error);
            alert("상세 데이터 불러오기 실패");
        }
    };


    // 리스트 갱신 (모달에서 반납/취소 후 호출)
    const updateList = () => {
        fetchReturnsList();
    };

    // `currentPage` 또는 `searchParam`이 변경될 때마다 데이터를 다시 가져옴
    useEffect(() => {

        // 상태/계산값 확인
        console.log('totalCount:', totalCount, 'pageSize:', pageSize, 'totalPages:', totalPages);

        console.log('useEffect totalPages:', Math.ceil(totalCount / pageSize));

        fetchReturnsList();
    }, [currentPage, searchParam.productState]);

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
                    onItemDtl={handleItemDtl}
                />
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                {totalCount > 0 && (
                    <ReturnsPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
            {isModalOpen && modalData && (
                <ReturnsModal
                    // isOpen={isModalOpen} 상태는 유지
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setModalData(null); // 모달 닫을 때 데이터도 초기화 (선택 사항이지만 권장)
                    }}
                    // modalData 객체 하나만 전달
                    data={modalData}
                    onUpdateList={fetchReturnsList}
                />
            )}

        </div>
    );
};

export default Returns;