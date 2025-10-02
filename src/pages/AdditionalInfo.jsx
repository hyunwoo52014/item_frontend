import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdditionalInfo() {
    const [team, setTeam] = useState("");
    const navigate = useNavigate();

    const submit = async () => {
        if (!team) return alert("소속팀을 선택해주세요.");
        try {
            const loginId = sessionStorage.getItem("loginId") || "";
            await axios.post(
                "http://localhost/api/login/additional/update/data",
                new URLSearchParams({ loginID: loginId, team }),
                { headers: { "Content-Type": "application/x-www-form-urlencoded" }, withCredentials:true }
            );

            //session storage 에 team 저장
            sessionStorage.setItem("team",team);

            navigate("/dashboard");
        } catch (e) {
            console.error(e);
            alert("저장 실패. 잠시 후 다시 시도해주세요.");
        }
    };

    return (
        <div
            className="card"
            style={{
                maxWidth: 520,
                margin: "60px auto",
                padding: "40px 32px",
                borderRadius: "12px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                backgroundColor: "#fff",
                fontFamily: "'Segoe UI', Arial, sans-serif"
            }}
        >
            <h2
                style={{
                    fontSize: "26px",
                    fontWeight: "800",
                    textAlign: "center",
                    color: "#1f2937",
                    marginBottom: "32px",
                }}
            >
                추가 정보 입력
            </h2>

            {/* 라벨 */}
            <label
                style={{
                    display: "block",
                    fontSize: "15px",
                    fontWeight: "600",
                    marginBottom: "8px",
                    color: "#374151",
                }}
            >
                소속팀
            </label>

            {/* 드롭다운 */}
            <select
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "15px",
                    outline: "none",
                    transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            >
                <option value="">선택해주세요</option>
                <option value="테스트팀">테스트팀</option>
                <option value="총무팀">총무팀</option>
                <option value="개발팀">개발팀</option>
                <option value="보안팀">보안팀</option>
                <option value="홍보팀">홍보팀</option>
                <option value="파견인원">파견인원</option>
            </select>

            {/* 버튼 영역 */}
            <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
                <button
                    onClick={submit}
                    style={{
                        flex: 1,
                        padding: "12px 0",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "#3b82f6",
                        color: "#fff",
                        fontWeight: "600",
                        fontSize: "15px",
                        cursor: "pointer",
                        transition: "background 0.2s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
                >
                    확인
                </button>
                <button
                    onClick={() => navigate("/login")}
                    style={{
                        flex: 1,
                        padding: "12px 0",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        backgroundColor: "#fff",
                        color: "#374151",
                        fontWeight: "600",
                        fontSize: "15px",
                        cursor: "pointer",
                        transition: "background 0.2s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
                >
                    취소
                </button>
            </div>
        </div>
    );
}

export default AdditionalInfo;