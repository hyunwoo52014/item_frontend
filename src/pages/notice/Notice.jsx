import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "./NoticePagination";
import NoticeDetail from "./NoticeDetail";
import "../../assets/css/notice/notice.css";
import "../../assets/css/admin/common.css";


const pageSize = 5; // 페이지당 행 수
const blockSize = 5; // 페이지 버튼 묶음 수

function Notice() {
    // 검색 조건
    const [title, setTitle] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // 관리자 - 새글작성버튼 보임
    const [loginId, setLoginID] = useState("");
    const isAdmin = (loginId || "").trim().toUpperCase() === "ADMIN";


    // 리스트/페이징
    const [rows, setRows] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    // 총페이지 / Pagination용 가짜 pageSize
    const totalPage = Math.max(1, Math.ceil(totalCount / pageSize));
    //const fakePageSize = Math.max(1, Math.ceil(totalPage / blockSize));

    // 신규등록
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ title: "", content: "" });

    // 관리리자 - 모달 나옴
    const openModal = () => {
        if (!isAdmin) {
            alert("관리자만 등록할 수 있습니다.");
            return;
        }
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
        setForm({ title: "", content: "" });
    };

    // 상세페이지
    const [detailCode, setDetailCode] = useState(null);

    const fetchNoticeList = async (page = 1, override) => {

        const _title = override?.title ?? title;
        const _fromDate = override?.fromDate ?? fromDate;
        const _toDate = override?.toDate?? toDate;

        // 날짜 유효성
        if (_fromDate && _toDate && _toDate < _fromDate) {
            alert("종료일은 시작일보다 빠를 수 없습니다.");
            return;
        }

        setCurrentPage(page);

        const params = new URLSearchParams();
        //params.append("title", title);
        //params.append("from_date", fromDate);
        //params.append("to_date", toDate);
        params.append("title", _title);
        params.append("from_date", _fromDate);
        params.append("to_date", _toDate);
        params.append("currentPage", page);
        params.append("pageSize", pageSize);

        try {
            const { data } = await axios.post("/api/notice/list", params, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            const list = Array.isArray(data.list) ? data.list : [];
            const total = Number.isFinite(data.totalCnt) ? data.totalCnt : 0;

            setRows(list);
            setTotalCount(total);
        } catch (e) {
            console.error("=== API Error ===", e.response?.data || e);
            alert("공지사항 조회 중 오류가 발생.");
            setRows([]);
            setTotalCount(0);
        }
    };

    useEffect(() => {
        fetchNoticeList(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSearch = () => fetchNoticeList(1);

    const onPageClick = (p) => {
        if (p < 1 || p > totalPage) return;
        fetchNoticeList(p);
    };

    // 페이지 삭제 후 갱신
    const handleDetailClose = (shouldRefresh = false) => {
        setDetailCode(null);
        if(shouldRefresh){
            fetchNoticeList(currentPage,{title, fromDate, toDate});
        }

    };


    // 새로고침
    const onRefreshAll = () => {
        setTitle("");
        setForm("");
        setToDate("");
        setCurrentPage(1);
        fetchNoticeList(1,{title: "", fromDate:"", toDate:""});
    }

    // 관리자 확인
    useEffect(() => {
        try {
            let raw = sessionStorage.getItem("loginInfo");
            if(!raw){
                raw = localStorage.getItem("loginInfo")
            }
            if (!raw) {
                const fallbackId =
                    sessionStorage.getItem("loginId") ||
                    sessionStorage.getItem("loginID") ||
                    localStorage.getItem("loginId") ||
                    localStorage.getItem("loginID") ||
                    "";
                setLoginID((fallbackId || "").toString().trim());
                return;
            }

            let id="";
            const trimmed =raw.toString().trim();

            if(trimmed.startsWith("{") && trimmed.endsWith("}")){
                const info = JSON.parse(trimmed);
                id =
                    (info.userId ??
                        info.loginID ??
                        info.loginId ??
                        info.id ??
                        info.username ??
                        "") + "";
            } else {
                id = trimmed;
            }

            setLoginID((id || "").toString().trim());
            // console.log("loginId:", id); // 필요시 확인
        } catch (e) {
            console.error("loginInfo 파싱 실패:", e);
            setLoginID("");
        }
    }, []);


    // 신규등록
    const insertNotice = async () => {
        const loginInfoRaw = sessionStorage.getItem("loginInfo");
        let loginID = "admin";
        try {
            if (loginInfoRaw) {
                const loginInfo = JSON.parse(loginInfoRaw);
                loginID = loginInfo.userId || loginInfo.loginID || loginID;
            }
        } catch (e) {
            // parsing 실패하면 기본값 사용
        }

        if (!form.title?.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }
        if (!form.content?.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }

        const params = new URLSearchParams();
        params.append("loginID", loginID);
        params.append("title", form.title.trim());
        params.append("content", form.content.trim());

        try {
            const { data } = await axios.post("/api/notice/insert", params, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            if (data?.success) {
                alert("등록 성공!");
                closeModal();
                // 첫 페이지부터 다시 조회 (최신 글이 상단)
                fetchNoticeList(1);
            } else {
                alert("등록 실패");
            }
        } catch (e) {
            console.error("=== INSERT Error ===", e.response?.data || e);
            alert("등록 중 오류가 발생");
        }
    };

    return (
        <div id="wrap_area">
            <div id="container">
                <ul>
                    <li className="contents">
                        <div className="content">
                            <p className="Location">
                                <a href="#!" className="btn_set home">메인으로</a>
                                <a href="#!" className="btn_nav bold">공지사항</a>
                                <span className="btn_nav bold">공지 사항</span>
                                <a   href="#!" className="btn_set refresh" onClick={(e) => {
                                    e.preventDefault();
                                    onRefreshAll();
                                }}
                                >새로고침</a>
                            </p>

                            <p className="conTitle">
                                <span>공지 사항</span>
                                <span className="fr">
                                    {
                                        isAdmin && (
                                            <button className="btnType blue" onClick={openModal}>신규등록</button>
                                        )
                                    }
                                 </span>
                            </p>

                            {/* 검색 */}
                            <table className="searchTable">
                                <tbody>
                                <tr>
                                    <td className="label">제목</td>
                                    <td width="200">
                                        <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} />
                                    </td>
                                    <td className="label">작성일</td>
                                    <td width="180">
                                        <input type="date" value={fromDate} onChange={(e)=>setFromDate(e.target.value)} />
                                    </td>
                                    <td width="180">
                                        <input type="date" value={toDate} onChange={(e)=>setToDate(e.target.value)} />
                                    </td>
                                    <td width="110">
                                        <button className="btnType blue" onClick={onSearch}>검색</button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>


                            {/* 리스트 */}
                            <div className="divNoticeList">
                                <table className="col">
                                    <colgroup>
                                        <col width="100" />
                                        <col />
                                        <col width="160" />
                                        <col width="120" />
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <th scope="col">공지 번호</th>
                                        <th scope="col">공지 제목</th>
                                        <th scope="col">공지 날짜</th>
                                        <th scope="col">작성자</th>
                                    </tr>
                                    </thead>
                                    <tbody id="noticeList">
                                    {rows.length === 0 ? (
                                        <tr>
                                            <td colSpan={4}>데이터가 존재하지 않습니다.</td>
                                        </tr>
                                    ) :(
                                        rows.map((r) => (
                                            <tr key={r.notice_code}>
                                                <td>{r.notice_code}</td>
                                                <td>
                                                    <a href="#!" onClick={() => setDetailCode(r.notice_code)}>
                                                        {r.title}
                                                    </a>
                                                </td>
                                                <td>{r.writeDate}</td>
                                                <td>{r.loginID}</td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>

                                {/* 페이징 */}
                                <div className="paging_area" id="pagingnavi">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPage={totalPage}
                                        blockSize={blockSize}
                                        onClick={onPageClick}
                                    />
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

            {/* 신규글 */}
            {showModal && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                    }}
                    onClick={(e) => {
                        // 배경 클릭 시 닫기 (모달 박스 클릭은 유지)
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    <div
                        style={{
                            width: 520,
                            background: "#fff",
                            borderRadius: 8,
                            boxShadow: "0 10px 24px rgba(0,0,0,0.2)",
                            padding: 20,
                        }}
                    >
                        <h3 style={{ marginTop: 0, marginBottom: 16 }}>공지 등록</h3>

                        <div style={{ marginBottom: 12 }}>
                            <label style={{ display: "block", marginBottom: 6 }}>제목</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
                                maxLength={200}
                                placeholder="제목을 입력하세요"
                            />
                        </div>

                        <div style={{ marginBottom: 12 }}>
                            <label style={{ display: "block", marginBottom: 6 }}>내용</label>
                            <textarea
                                value={form.content}
                                onChange={(e) => setForm({ ...form, content: e.target.value })}
                                style={{ width: "100%", height: 160, padding: 8, border: "1px solid #ddd", borderRadius: 4, resize: "vertical" }}
                                placeholder="내용을 입력하세요"
                            />
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                            <button className="btnType" onClick={closeModal}>취소</button>
                            <button className="btnType blue" onClick={insertNotice}>등록</button>
                        </div>
                    </div>
                </div>
            )}
            {
                detailCode && (
                    <NoticeDetail
                        noticeCode={detailCode}
                        onClose={handleDetailClose}
                        //onDeleted={handleDetailClose}
                       // onDeleted={handleUpdate}
            />
                )}
        </div>
    );
}

export default Notice;
