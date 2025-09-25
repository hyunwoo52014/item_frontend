import React, { useEffect, useState } from "react";
import axios from "axios";
import content from "../../Content";

function NoticeDetail({ noticeCode, onClose, onDeleted }) {
    const [detail, setDetail] = useState(null);
    const [editMode, setEditMode] = useState(null);
    const [form, setForm] = useState(false);
    const [saving, setSaving] = useState(false);

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
                if (vo) setDetail(vo);
            } catch (e) {
                console.error("상세조회 실패", e);
            }
        };
        if (noticeCode) fetchDetail();
    }, [noticeCode]);


    // 수정
    const handleUpdate = async () => {
        if (!content?.trim()){
            alert("내용을 입력하세요");
            return;
        }
        try{
            setSaving(true);
            const params = new URLSearchParams();
            params.append("nontice_code", noticeCode);
            params.append("content", content);

            const {data} = await axios.post("apt/notice/update", params, {
                headers: {"Content-Type" : "application/x-www"}
            })
        } catch (e) {

        } finally {

        }
    }

/****/
    const handleDelete = async () => {
        if (!detail?.notice_code) return;
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            const params = new URLSearchParams();
            params.append("notice_code", detail.notice_code);

            const { data } = await axios.post("/api/notice/delete", params, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            // 백엔드 응답이 { success: true } 또는 { result: 'OK' } 등일 수 있어 유연 처리
            const ok = data?.success === true || data?.result === "OK" || data === true;
            if (ok) {
                alert("삭제 완료되었습니다.");
                onDeleted?.();
            } else {
                alert("삭제 실패");
                console.warn("삭제 응답:", data);
            }
        } catch (e) {
            console.error("삭제 실패", e.response?.data || e);
            alert("삭제 중 오류가 발생했습니다.");
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
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
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
                <h3 style={{ marginTop: 0 }}>{detail.title}</h3>

                {/* 메타 테이블 */}
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
                        <th style={{ width: 80, textAlign: "left",fontWeight: 600, color: "#666", paddingRight: 8, whiteSpace: "nowrap" }}>
                            작성자
                        </th>
                        <td style={{ paddingRight: 16 }}>{detail.loginID || "-"}</td>
                        <th style={{ width: 80, textAlign: "left",fontWeight: 600, color: "#666", paddingRight: 8, whiteSpace: "nowrap" }}>
                            작성일
                        </th>
                        <td>{detail.writeDate || "-"}</td>
                    </tr>
                    </tbody>
                </table>

                <hr />
                <div style={{ minHeight: 120, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                    {detail.content}
                </div>

                {/* 버튼들 */}
                <div style={{ textAlign: "right", marginTop: 16 }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <button className="btnType red" onClick={handleDelete}>
                            삭제
                        </button>
                        <button className="btnType blue" onClick={() => {
                                console.log("수정:", detail.notice_code);
                            }}
                        >
                            수정
                        </button>
                        <button className="btnType" onClick={onClose}>
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NoticeDetail;
