import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdditionalInfo() {
    const [team, setTeam] = useState("");
    const navigate = useNavigate();

    const submit = async () => {
        if (!team) return alert("소속팀을 선택해주세요.");
        try {
            const loginId = sessionStorage.getItem("loginId") || "";
            await axios.post(
                "/api/login/additional/update/data",
                new URLSearchParams({ loginID: loginId, team }),
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            );
            navigate("/dashboard");
        } catch (e) {
            console.error(e);
            alert("저장 실패. 잠시 후 다시 시도해주세요.");
        }
    };

    return (
        <div className="card" style={{maxWidth:520, margin:"60px auto"}}>
            <h2>추가 정보 입력</h2>
            <label>소속팀</label>
            <select value={team} onChange={(e) => setTeam(e.target.value)}>
                <option value="">선택해주세요</option>
                <option value="테스트팀">테스트팀</option>
                <option value="총무팀">총무팀</option>
                <option value="개발팀">개발팀</option>
                <option value="보안팀">보안팀</option>
                <option value="홍보팀">홍보팀</option>
                <option value="파견인원">파견인원</option>
            </select>
            <div style={{ marginTop: 16, display:"flex", gap:8 }}>
                <button onClick={submit}>확인</button>
                <button onClick={() => navigate("/login")}>취소</button>
            </div>
        </div>
    );
}
