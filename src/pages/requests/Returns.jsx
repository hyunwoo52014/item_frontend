import React, { useState, useEffect } from 'react';
import {SearchBar} from "./SearchBar.jsx";
import {ReturnsTable} from "./ReturnsTable.jsx";
import {ApplyModal} from "./ApplyModal.jsx";
import {Pagination} from "./Pagination.jsx";

const Returns = () => {

    const [searchKey, setSearchKey] = useState("");
    const [list, setList ] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null); // 모달에 보여줄 데이터
    const [loginId, setLoginId] = useState("");



    // 검색 핸들러 함수: 검색 키워드와 현재 페이지 상태를 업데이트
    const handleSearch = (key) => {
        setSearchKey(key);
        setCurrentPage(1);
    }

    // 페이지 변경 핸들러 함수: 현재 페이지를 업데이트
    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    // 반납 상세 보기 핸들러 함수
    const handleReturnDtl = (item) => {
        setModalData(item);
        setIsModalOpen(true);
    };

    // 취소 상세 보기 핸들러 함수
    const handleCancelDtl = (item) => {
        setModalData(item);
        setIsModalOpen(true);
    }


    // API에서 반납 목록을 가져오는 함수
    const fetchReturnsList = async () => {

        try {
            // 임시로 하드코딩
            const userLoginId = "사용자ID";
            setLoginId(userLoginId); //

            const params = new URLSearchParams({
                pageSize: 10,
                currentPage: currentPage,
                loginId: '사용자ID',
                categoryCode: searchKey
            }).toString();

            const response = await fetch(`/requests/returnsList?${params}`);
            const data = await response.json();

            setList(data.returnsList);
            setTotalCount(data.totalCount);
        } catch (error) {
            console.error("Error fetching returns list:", error);
        }
    }


    // `searchKey` 또는 `currentPage`가 변경될 때마다 데이터를 다시 가져옴
    useEffect(() => {
        fetchReturnsList();
    }, [searchKey, currentPage]); // 검색 시 페이지를 1로 초기화





    return (
        <div>
            <p className="Location">
                <a href="../dashboard/dashboard.do" className="btn_set home">메인으로</a>
                <span className="btn_nav bold">신청/반납</span>
                <span className="btn_nav bold">반납일괄 신청</span>
                <a href="/requests/returns" className="btn_set refresh">새로고침</a>
            </p>

            <SearchBar onSearch={handleSearch} />
            <div id="divReturnsList">
                <ReturnsTable list={list} onReturnDtl={handleReturnDtl} onCancelDtl={handleCancelDtl} />
            </div>
            <div className="paging_area" id="pagingnavi">
                <Pagination
                    currentPage={currentPage}
                    totalCount={totalCount}
                    pageSize={10}
                    onPageChange={handlePageChange}
                />
            </div>
            {isModalOpen && <ApplyModal data={modalData} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}

export default Returns;