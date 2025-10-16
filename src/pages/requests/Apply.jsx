import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Modal from "react-modal";
import ApplyPopup from "./ApplyPopup";

/**
 * 장비 사용신청 목록 화면
 */
const Apply = () => {
    // 검색 조건
    const [searchInfo, setSearchInfo] = useState({
        searchsel: "",
        searchword: "",
        currentPage: 1,
        pageSize: 10,
        blocksize: 5,
    });

    // 선택된 장비 정보 (모달용)
    const [applyInfo, setApplyInfo] = useState({});

    // 목록 데이터
    const [productList, setProductList] = useState({
        totalcnt: 0,
        datalist: [],
    });

    // 카테고리 매핑 데이터
    const [categoryMap, setCategoryMap] = useState({});

    // 모달 상태
    const [modalwin, setModalwin] = useState({
        isopen: false,
        action: "",
        loginid: "",
    });

    // 스타일
    const searchstyle = { fontWeight: "bold", marginRight: "5px" };

    const modalStyle = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            width: "600px",
            maxHeight: "80vh",
            overflow: "auto",
        },
        overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
    };

    // 상태 변환 함수
    const getStateDisplay = (state) => {
        switch(state) {
            case 'Y': return '사용중';
            case 'N': return '미사용';
            case 'O': return '사용신청';
            case 'R': return '반납신청';
            default: return state;
        }
    };

    // 버튼 텍스트 및 상태 결정 함수
    const getButtonInfo = (state) => {
        switch(state) {
            case 'Y':
                return {
                    text: '반납신청',
                    disabled: false,
                    className: 'btn btn-danger',
                    action: 'RETURN'
                };
            case 'N':
                return {
                    text: '사용신청',
                    disabled: false,
                    className: 'btn btn-primary',
                    action: 'APPLY'
                };
            case 'O':
                return {
                    text: '신청취소',
                    disabled: false,
                    className: 'btn btn-warning',
                    action: 'CANCEL_APPLY'
                };
            case 'R':
                return {
                    text: '반납취소',
                    disabled: false,
                    className: 'btn btn-info',
                    action: 'CANCEL_RETURN'
                };
            default:
                return {
                    text: '사용신청',
                    disabled: false,
                    className: 'btn btn-primary',
                    action: 'APPLY'
                };
        }
    };

    // 카테고리 매핑 함수
    const getCategoryName = (categoryCode) => {
        const categoryName = categoryMap[categoryCode];
        if (!categoryName) {
            console.warn(`카테고리 코드 ${categoryCode}에 해당하는 이름을 찾을 수 없습니다.`);
            return `[${categoryCode}]`; // 코드를 괄호로 감싸서 표시
        }
        return categoryName;
    };


    /** 카테고리 데이터 조회 */
    const fetchCategories = async () => {
        try {
            console.log("카테고리 데이터 조회 시작");

            // API URL 확인 - 실제 엔드포인트에 맞게 수정 필요
            const res = await axios.get("http://localhost:80/api/requests/categories");

            console.log("카테고리 API 응답:", res.data);

            if (!res.data || !Array.isArray(res.data)) {
                console.error("카테고리 데이터 형태가 올바르지 않습니다:", res.data);
                return;
            }

            const mapping = {};
            res.data.forEach(category => {
                if (category.category_code && category.category_name) {
                    mapping[category.category_code] = category.category_name;
                } else {
                    console.warn("카테고리 데이터 누락:", category);
                }
            });

            console.log("카테고리 매핑 결과:", mapping);
            setCategoryMap(mapping);

        } catch (e) {
            console.error("카테고리 데이터 로딩 오류:", e);
            console.error("에러 상세:", e.response?.data, e.response?.status);

            // 임시 fallback 데이터 (개발용)
            const fallbackCategories = {
                'KB': '키보드',
                'SQ': '스피커',
                'MO': '모니터',
                'MS': '마우스'
            };
            setCategoryMap(fallbackCategories);

            // 사용자에게 알림
            alert("카테고리 데이터를 불러오는데 실패했습니다. 기본 카테고리로 표시합니다.");
        }
    };

    /** 신청취소 API */
    const cancelApplication = async (row) => {
        try {
            // Spring Controller @RequestParam에 맞게 URLSearchParams로 전송
            const params = new URLSearchParams();
            params.append('product_detail_code', row.product_detail_code);
            params.append('order_reason', '신청취소'); // 취소사유 추가

            console.log("신청취소 요청 데이터:", {
                product_detail_code: row.product_detail_code,
                order_reason: '신청취소'
            });

            const res = await axios.post("http://localhost:80/api/requests/applyCancel", params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            console.log("신청취소 성공:", res.data);

            if (res.data.result === 'SUCCESS') {
                alert("신청이 취소되었습니다.");
                fetchData(); // 데이터 새로고침
            } else {
                alert(res.data.resultMsg || "신청취소에 실패했습니다.");
            }
        } catch (e) {
            console.error("신청취소 오류:", e);
            alert("신청취소에 실패했습니다.");
        }
    };

    /** 반납취소 API */
    const cancelReturn = async (row) => {
        try {
            // Spring Controller @RequestParam에 맞게 URLSearchParams로 전송
            const params = new URLSearchParams();
            params.append('product_detail_code', row.product_detail_code);
            params.append('order_reason', '반납취소'); // 취소사유 추가

            console.log("반납취소 요청 데이터:", {
                product_detail_code: row.product_detail_code,
                order_reason: '반납취소'
            });

            const res = await axios.post("http://localhost:80/api/requests/applyCancel", params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            console.log("반납취소 성공:", res.data);

            if (res.data.result === 'SUCCESS') {
                alert("반납신청이 취소되었습니다.");
                fetchData(); // 데이터 새로고침
            } else {
                alert(res.data.resultMsg || "반납취소에 실패했습니다.");
            }
        } catch (e) {
            console.error("반납취소 오류:", e);
            alert("반납취소에 실패했습니다.");
        }
    };

    /** 사용자 정보 가져오기 (Apply.jsx용) */
    const getUserInfo = () => {
        try {
            const loginId = sessionStorage.getItem('loginId');
            const userNm = sessionStorage.getItem('userNm');
            const userType = sessionStorage.getItem('userType');

            if (loginId && userNm) {
                return {
                    loginID: loginId,
                    name: userNm,
                    userType: userType || 'U' // 기본값은 일반사용자
                };
            }

            // loginInfo JSON에서 확인
            const loginInfo = sessionStorage.getItem('loginInfo');
            if (loginInfo) {
                const userInfo = JSON.parse(loginInfo);
                if (userInfo.loginId && userInfo.userNm) {
                    return {
                        loginID: userInfo.loginId,
                        name: userInfo.userNm,
                        userType: userInfo.userType || 'U'
                    };
                }
            }

            // 기본값
            return {
                loginID: 'admin',
                name: '관리자',
                userType: 'A'
            };
        } catch (error) {
            console.error('사용자 정보 로딩 오류:', error);
            return {
                loginID: 'admin',
                name: '관리자',
                userType: 'A'
            };
        }
    };

    /** 데이터 조회 */
    const fetchData = async () => {
        try {
            const { currentPage, pageSize, searchsel, searchword } = searchInfo;
            const userInfo = getUserInfo(); // 사용자 정보 가져오기

            console.log("=== 프론트엔드 파라미터 ===");
            console.log("currentPage:", currentPage, typeof currentPage);
            console.log("pageSize:", pageSize, typeof pageSize);
            console.log("searchsel:", searchsel, typeof searchsel);
            console.log("searchword:", searchword, typeof searchword);
            console.log("사용자 정보:", userInfo);

            const res = await axios.get("http://localhost:80/api/requests/applyData", {
                params: {
                    currentPage, // 실제 현재 페이지 사용
                    pageSize,    // 실제 페이지 사이즈 사용
                    searchsel,   // 실제 검색 선택 값 사용
                    searchword,  // 실제 검색어 사용
                    userLoginId: userInfo.loginID, // 사용자 로그인 ID 추가
                    userType: userInfo.userType    // 사용자 권한 추가
                }
            });

            console.log("API 응답 성공:", res.data);
            setProductList({
                totalcnt: res.data?.totalcnt ?? 0,
                datalist: res.data?.datalist ?? [],
            });
        } catch (e) {
            console.error("데이터 로딩 오류:", e);
            console.error("에러 상세:", e.response?.data, e.response?.status);
            setProductList({ totalcnt: 0, datalist: [] });
        }
    };

    /** 검색 버튼 */
    const onSearch = () => {
        console.log("검색 버튼 클릭 - 페이지를 1로 리셋");
        setSearchInfo((old) => ({ ...old, currentPage: 1 }));
    };

    /** 페이지 변경 */
    const handlePageChange = (newPage) => {
        if(newPage >=1 && newPage <= pageCount){
            setSearchInfo((prev)=>({...prev,currentPage:newPage}));
        }
    };

    /** 페이지 번호 목록 생성(1~10개씩)*/
    const getPageNumbers = () => {
        const pageNumbers = [];
        const currentPage = searchInfo.currentPage;
        const totalPage = pageCount || 1;

        // 현재 페이지를 기준으로 시작 페이지 계산(10개 단위 )
        const startPage = Math.floor((currentPage -1 )/10) * 10 + 1;
        const endPage = Math.min(startPage+9, totalPage);

        for(let i = startPage ; i <=endPage; i++){
            pageNumbers.push(i);
        }

        return pageNumbers;
    };


    /** 조회 트리거 */
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInfo.currentPage, searchInfo.pageSize, searchInfo.searchsel, searchInfo.searchword]);

    /** 초기 로드시 카테고리 데이터 가져오기 */
    useEffect(() => {
        fetchCategories();
    }, []);

    /** 상태별 액션 처리 */
    const handleStateAction = (action, row) => {
        switch(action) {
            case 'APPLY':
                // 사용신청 모달 열기
                openModal('APPLY', row);
                break;
            case 'RETURN':
                // 반납신청 모달 열기
                openModal('RETURN', row);
                break;
            case 'CANCEL_APPLY':
                // 신청취소 확인
                if (window.confirm('사용신청을 취소하시겠습니까?')) {
                    cancelApplication(row);
                }
                break;
            case 'CANCEL_RETURN':
                // 반납취소 확인
                if (window.confirm('반납신청을 취소하시겠습니까?')) {
                    cancelReturn(row);
                }
                break;
            default:
                console.log('알 수 없는 액션:', action);
        }
    };

    /** 모달 열기 */
    const openModal = (action, row) => {
        setApplyInfo(row);
        setModalwin({
            isopen: true,
            action,
            loginid: row?.product_detail_code ?? "",
        });
    };

    /** 모달 닫기 */
    const closeModal = () => {
        setModalwin({ isopen: false, action: "", loginid: "" });
        // 모달 닫을 때 데이터 새로고침
        fetchData();
    };

    /** 장비 신청 모달 열기 */
    const openApplyModal = () => {
        // 빈 장비 신청용 기본 데이터 설정
        setApplyInfo({
            product_name: '',
            product_detail_code: '',
            category_name: '',
            product_state: 'N'
        });
        setModalwin({
            isopen: true,
            action: "APPLY",
            loginid: "",
        });
    };

    const pageCount = Math.ceil(
        (productList.totalcnt || 0) / (searchInfo.pageSize || 10)
    );

    return (
        <div>
            <div className="content">
                <p className="Location">
                    <a className="btn_set home">메인으로</a>{" "}
                    <span className="btn_nav bold">신청/반납</span>{" "}
                    <span className="btn_nav bold">사용신청</span>{" "}
                    <a className="btn_set refresh" onClick={fetchData}>
                        새로고침
                    </a>
                </p>

                // 기존 코드에서 검색어 창 부분만 개선된 버전

                <p className="conTitle">
                        <span>장비 사용신청</span>{" "}
                        <span className="fr">
            <span style={searchstyle}>검색어</span>&nbsp;
                            <select
                                id="searchsel"
                                value={searchInfo.searchsel}
                                onChange={(e) =>
                                    setSearchInfo((old) => ({
                                        ...old,
                                        searchsel: e.target.value,
                                        searchword: "", // 검색 조건 변경 시 검색어 초기화
                                        currentPage: 1 // 페이지도 1로 초기화
                                    }))
                                }
                            >
                <option value="">전체</option>
            <option value="product_name">장비명</option>
            <option value="category_name">카테고리</option>
            <option value="product_state">상태</option>
        </select>
                        &nbsp;

                        {/* 장비명 검색 */}
                        {searchInfo.searchsel === "product_name" && (
                            <input
                                type="text"
                                id="searchword"
                                placeholder="장비명을 입력하세요"
                                value={searchInfo.searchword}
                                onChange={(e) =>
                                    setSearchInfo((old) => ({
                                        ...old,
                                        searchword: e.target.value,
                                        currentPage: 1 // 검색어 변경 시 페이지 1로 리셋
                                    }))
                                }
                                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                            />
                        )}

                        {/* 카테고리 검색 */}
                            {searchInfo.searchsel === "category_name" && (
                                <select
                                    value={searchInfo.searchword}
                                    onChange={(e) =>
                                        setSearchInfo((old) => ({
                                            ...old,
                                            searchword: e.target.value,
                                            currentPage: 1 // 검색어 변경 시 페이지 1로 리셋
                                        }))
                                    }
                                >
                                    <option value="">전체 카테고리</option>
                                    {Object.entries(categoryMap).map(([code, name]) => (
                                        <option key={code} value={code}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                            )}

                        {/* 상태 검색 */}
                        {searchInfo.searchsel === "product_state" && (
                            <select
                                value={searchInfo.searchword}
                                onChange={(e) =>
                                    setSearchInfo((old) => ({
                                        ...old,
                                        searchword: e.target.value
                                    }))
                                }
                            >
                                <option value="">전체 상태</option>
                                <option value="Y">사용중</option>
                                <option value="N">미사용</option>
                                <option value="O">사용신청</option>
                                <option value="R">반납신청</option>
                            </select>
                        )}

                        <button onClick={onSearch}>검색</button>
                        &nbsp;&nbsp;
                        <button
                            className="btn btn-success"
                            onClick={openApplyModal}
                        >
            장비신청
        </button>
    </span>
                </p>

                <div style={{ marginBottom: 10 }}>
                    <b>
                        총건수 : {productList.totalcnt} &nbsp; 현재 페이지 :{" "}
                        {searchInfo.currentPage}
                    </b>
                </div>

                <table className="col">
                    <thead>
                    <tr>
                        <th>번호</th>
                        <th>장비명</th>
                        <th>장비카테고리</th>
                        <th>상태</th>
                        <th>신청자</th>
                        <th>신청</th>
                    </tr>
                    </thead>
                    <tbody>
                    {productList.totalcnt === 0 && (
                        <tr>
                            <td colSpan="6">조회된 데이터가 없습니다.</td>
                        </tr>
                    )}
                    {productList.totalcnt > 0 &&
                        productList.datalist.map((row, idx) => {
                            const buttonInfo = getButtonInfo(row.product_state);
                            return (
                                <tr key={`${row.product_detail_code}-${row.category_code}-${idx}`}>
                                    <td>{row.rownum ?? Math.max(1, productList.totalcnt - ((searchInfo.currentPage - 1) * searchInfo.pageSize + idx))}</td>
                                    <td>{row.product_name}</td>
                                    <td>{row.category_name || getCategoryName(row.category_code)}</td>
                                    <td>{getStateDisplay(row.product_state)}</td>
                                    <td>
                                        {/* 상태가 N(미사용)이 아닌 경우만 신청자 표시 */}
                                        {row.product_state !== 'N' ? (row.applicant_name || '-') : '-'}
                                    </td>
                                    <td>
                                        <button
                                            className={buttonInfo.className}
                                            onClick={() => handleStateAction(buttonInfo.action, row)}
                                            disabled={buttonInfo.disabled}
                                        >
                                            {buttonInfo.text}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div style={{marginTop: 15, textAlign: 'center'}}>
                    <div style={{display: 'inline-flex', alignItems: 'center', gap: '5px'}}>
                        {/*맨 처음으로 */}
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handlePageChange(1)}
                            disabled={searchInfo.currentPage <= 1}
                            style={{minWidth: '35px'}}
                        >
                            &lt;&lt;
                        </button>

                        {/* 5페이지 이전 */}
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handlePageChange(Math.max(1, searchInfo.currentPage - 10))}
                            disabled={searchInfo.currentPage <= 1}
                            style={{minWidth: '35px'}}
                        >
                            &lt;
                        </button>

                        {/* 페이지 번호들 */}
                        {getPageNumbers().map(pageNum => (
                            <button
                                key={pageNum}
                                type="button"
                                className={`btn btn-sm ${searchInfo.currentPage === pageNum ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => handlePageChange(pageNum)}
                                style={{minWidth: '35px'}}
                            >
                                {pageNum}
                            </button>

                        ))}

                        {/* 5페이지 다음 */}
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handlePageChange(Math.min(pageCount, searchInfo.currentPage + 10))}
                            disabled={searchInfo.currentPage >= pageCount}
                            style={{minWidth: '35px'}}
                        >
                            &gt;
                        </button>

                        {/* 맨 끝으로*/}
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handlePageChange(pageCount)}
                            disabled={searchInfo.currentPage >= pageCount}
                            style={{minWidth: '35px'}}
                        >
                            &gt;&gt;
                        </button>
                    </div>
                    <div>
                        전체 {productList.totalcnt}건
                        중 {((searchInfo.currentPage - 1) * searchInfo.pageSize) + 1} ~ {Math.min(searchInfo.currentPage * searchInfo.pageSize, productList.totalcnt)}건
                        표시 (페이지 {searchInfo.currentPage}/{pageCount || 1})
                    </div>
                </div>
            </div>

            <Modal
                style={modalStyle}
                isOpen={modalwin.isopen}
                onRequestClose={closeModal}
                ariaHideApp={false}
            >
                <ApplyPopup
                    action={modalwin.action}
                    loginid={modalwin.loginid}
                    applyInfo={applyInfo}
                    closeModal={closeModal}
                />
            </Modal>
        </div>
    );
};

export default Apply;