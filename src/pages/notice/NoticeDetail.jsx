import React, { useEffect, useState } from "react";
import "../../assets/css/admin/common.css"
import axios from "axios";

function NoticeDetail({ noticeCode, onClose, onDeleted, onUpdated }) {
    const [detail, setDetail] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [saving, setSaving] = useState(false);

    // 관리자 - 새글작성버튼 보임
    const [loginId, setLoginID] = useState("");
    const isAdmin = (loginId || "").trim().toUpperCase() === "ADMIN";



    // 상세조회
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const params = new URLSearchParams();
                params.append("notice_code", noticeCode);

                const { data } = await axios.post("/api/notice/detail", params, {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                });
                const vo = data?.detail ?? data?.data ?? data;
                if (vo) {
                    setDetail(vo);
                    setTitle(vo.title ?? vo.notice_title ?? "");
                    setContent(vo.content ?? vo.notice_content ?? "");
                }
            } catch (e) {
                console.error("상세조회 실패", e);
                alert("상세 조회에 실패했습니다.");
            }
        };
        if (noticeCode) fetchDetail();
    }, [noticeCode]);

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


    // 수정 - 관리자만 보임
    const handleUpdate = async () => {
        if(!title?.trim()){
            alert("제목을 입력하세요");
            return;
        }
        if (!content?.trim()) {
            alert("내용을 입력하세요");
            return;
        }
        try {
            setSaving(true);
            const params = new URLSearchParams();
            params.append("notice_code", noticeCode);
            params.append("content", content);
            params.append("title", title);

            const { data } = await axios.post("/api/notice/update", params, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            console.log("수정결과: ", data);
            alert("수정되었습니다");

            // 화면
            setDetail((prev) => ({
                ...prev,
                title,
                notice_title: title,
                content,
                notice_content: content,
            }));
            setEditMode(false);

            onClose?.(true);

        } catch (e) {
            console.error("수정실패", e);
            alert("수정실패.");
        } finally {
            setSaving(false);
        }
    };

    // 삭제
    const handleDelete = async () => {
        if (!detail?.notice_code) return;
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            const params = new URLSearchParams();
            params.append("notice_code", detail.notice_code);

            const { data } = await axios.post("/api/notice/delete", params, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            const ok = data?.success === true || data?.result === "OK" || data === true;
            if (ok) {
                alert("삭제 완료되었습니다.");
                onClose?.(true);
            } else {
                alert("삭제 실패");
                console.warn("삭제 응답:", data);
            }
        } catch (e) {
            console.error("삭제 실패", e?.response?.data || e);
            alert("삭제 실패");
        }
    };



    if (!detail) return <div style={{ padding: 20 }}>로딩 중...</div>;

    return (
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
            onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
        >
            <div
                style={{
                    width: 600,
                    background: "#fff",
                    borderRadius: 8,
                    padding: 20,
                    boxShadow: "0 8px 16px rgba(0,0,0,0.25)",
                }}
            >
              {/*<h3 style={{ marginTop: 0 }}>{detail.title ?? detail.notice_title ?? "(제목 없음)"}</h3>*/}
                {
                    editMode ? (
                        <input type="text"
                               value={title}
                               onChange={(e) => setTitle(e.target.value)}
                                placeholder="제목"
                               style={{ width: "100%", marginTop: 0, marginBottom: 10, fontSize:18, fontWeight: 600}}
                        />
                    ) : (
                         <h3 style={{marginTop : 0}}>
                            {detail.title ?? detail.notice_title ?? "(제목 필수)"}
                        </h3>
                    )}

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "separate",
                        borderSpacing: "0 8px",
                        marginBottom: 8,
                    }}
                >
                    <tbody>
                    <tr style={{ fontSize: 14, color:"#444" }}>
                        <th style={{ width: 80, textAlign: "left", fontWeight: 600, color: "#666", paddingRight: 8, whiteSpace: "nowrap" }}>
                            작성자
                        </th>
                        <td style={{ paddingRight: 16 }}>{detail.loginID || "-"}</td>
                        <th style={{ width: 80, textAlign: "left", fontWeight: 600, color: "#666", paddingRight: 8, whiteSpace: "nowrap" }}>
                            작성일
                        </th>
                        <td>{detail.writeDate || "-"}</td>
                    </tr>
                    </tbody>
                </table>

                <hr />

                {editMode ? (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용"
                        style={{ width: "100%", height: 240, marginBottom: 10, whiteSpace: "pre-wrap", lineHeight: 1.6 }}
                    />
                ) : (
                    <div style={{ minHeight: 120, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                        {detail.content ?? detail.notice_content ?? "(내용 없음)"}
                    </div>
                )}

                {/* 버튼들 */}
                <div style={{ textAlign: "right", marginTop: 16 }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        {editMode ? (
                            <>
                                <button className="btnType blue" onClick={handleUpdate} disabled={saving}>
                                    {saving ? "저장 중..." : "저장"}
                                </button>
                                <button
                                    className="btnType gray"
                                    onClick={() => {
                                        setContent(detail.content ?? detail.notice_content ?? "");
                                        setEditMode(false);
                                    }}
                                    disabled={saving}
                                >
                                    취소
                                </button>
                            </>
                        ) : (
                            <>
                                { isAdmin &&(
                                <button className="btnType red" onClick={handleDelete} >
                                    삭제
                                </button>
                                )}
                                { isAdmin &&(
                                <button className="btnType blue" onClick={() => setEditMode(true)}>
                                    수정
                                </button>
                                )}
                                <button className="btnType" onClick={()=>onClose?.(false)}>
                                    닫기
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NoticeDetail;
