import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({
        loginID: "",
        password: "",
        password1: "",
        name: "",
        birthday: "",
        email: "",
        addr: "",
        addr_detail: "",
        user_zipcode: "",
        team: "",
        tel1: "",
        tel2: "",
        tel3: "",
    });
    const [dup, setDup] = useState({ id: false, email: false });
    const navigate = useNavigate();

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const checkId = async () => {
        if (!/^[a-z0-9]{6,20}$/.test(form.loginID)) {
            return alert("숫자, 영문자 조합으로 6~20자리");
        }
        try {
            await axios.post("/api/checkDuplicatedloginID",
                new URLSearchParams({ loginID: form.loginID }),
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            );
            alert("사용 가능한 아이디입니다.");
            setDup((d) => ({ ...d, id: true }));
        } catch (e) {
            alert("이미 사용 중인 아이디입니다.");
            setDup((d) => ({ ...d, id: false }));
        }
    };

    const checkEmail = async () => {
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(form.email)) {
            return alert("올바른 이메일을 입력해주세요.");
        }
        try {
            await axios.post("/api/checkDuplicatedEmail",
                new URLSearchParams({ email: form.email }),
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            );
            alert("사용 가능한 이메일입니다.");
            setDup((d) => ({ ...d, email: true }));
        } catch (e) {
            alert("이미 가입된 이메일입니다.");
            setDup((d) => ({ ...d, email: false }));
        }
    };

    const submit = async () => {
        if (!dup.id) return alert("아이디 중복확인을 해주세요.");
        if (!dup.email) return alert("이메일 중복확인을 해주세요.");
        if (form.password !== form.password1) return alert("비밀번호가 일치하지 않습니다.");

        const payload = new URLSearchParams({
            action: "I",
            loginID: form.loginID,
            password: form.password,
            name: form.name,
            birthday: form.birthday,
            email: form.email,
            addr: form.addr,
            addr_detail: form.addr_detail,
            user_zipcode: form.user_zipcode,
            team: form.team,
            hp: `${form.tel1}-${form.tel2}-${form.tel3}`,
            user_type: "B",
            // regdate/status_yn은 서버에서 기본값 채워도 됨 (혹은 여기서 넣어도 됨)
        });

        try {
            const { data } = await axios.post("/api/register.do", payload, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
            if (data.result === "SUCCESS") {
                alert("가입 완료! 로그인 해주세요.");
                navigate("/login");
            } else {
                alert(data.resultMsg || "가입 실패");
            }
        } catch (e) {
            console.error(e);
            alert("가입 실패. 잠시 후 다시 시도해주세요.");
        }
    };

    return (
        <div className="card" style={{maxWidth:800, margin:"40px auto"}}>
            <h2>회원가입</h2>

            <div>
                <label>아이디 *</label>
                <div style={{display:"flex", gap:8}}>
                    <input name="loginID" value={form.loginID} onChange={onChange} />
                    <button onClick={checkId} type="button">중복확인</button>
                </div>
            </div>

            <div>
                <label>비밀번호 *</label>
                <input type="password" name="password" value={form.password} onChange={onChange} />
            </div>

            <div>
                <label>비밀번호 확인 *</label>
                <input type="password" name="password1" value={form.password1} onChange={onChange} />
            </div>

            <div>
                <label>이름 *</label>
                <input name="name" value={form.name} onChange={onChange} />
            </div>

            <div>
                <label>생년월일 *</label>
                <input type="date" name="birthday" value={form.birthday} onChange={onChange} />
            </div>

            <div>
                <label>이메일 *</label>
                <div style={{display:"flex", gap:8}}>
                    <input name="email" value={form.email} onChange={onChange} />
                    <button onClick={checkEmail} type="button">중복확인</button>
                </div>
            </div>

            <div>
                <label>주소 *</label>
                <input name="addr" value={form.addr} onChange={onChange} />
            </div>

            <div>
                <label>상세주소</label>
                <input name="addr_detail" value={form.addr_detail} onChange={onChange} />
            </div>

            <div>
                <label>우편번호 *</label>
                <input name="user_zipcode" value={form.user_zipcode} onChange={onChange} />
            </div>

            <div>
                <label>소속팀 *</label>
                <select name="team" value={form.team} onChange={onChange}>
                    <option value="">선택해주세요</option>
                    <option value="테스트팀">테스트팀</option>
                    <option value="총무팀">총무팀</option>
                    <option value="개발팀">개발팀</option>
                    <option value="보안팀">보안팀</option>
                    <option value="홍보팀">홍보팀</option>
                </select>
            </div>

            <div>
                <label>전화번호 *</label>
                <div style={{display:"flex", gap:6}}>
                    <input name="tel1" value={form.tel1} onChange={onChange} maxLength={3} style={{width:60}} />
                    -
                    <input name="tel2" value={form.tel2} onChange={onChange} maxLength={4} style={{width:70}} />
                    -
                    <input name="tel3" value={form.tel3} onChange={onChange} maxLength={4} style={{width:70}} />
                </div>
            </div>

            <div style={{marginTop:16, display:"flex", gap:8}}>
                <button type="button" onClick={submit}>회원가입</button>
                <button type="button" onClick={() => navigate("/login")}>취소</button>
            </div>
        </div>
    );
}
