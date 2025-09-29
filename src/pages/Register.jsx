import React, { useState, useCallback } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";


// 공통 스타일 정의
const cellLeftStyle = {
    width: '25%',
    padding: '12px 16px',
    verticalAlign: 'middle',
    backgroundColor: '#f9fafb',
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
    border: '1px solid #e5e7eb',
    borderRight: 'none'
};

const cellRightStyle = {
    width: '75%',
    padding: '12px 16px',
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
    border: '1px solid #e5e7eb',
    borderLeft: 'none',
    required: true,
};



const DaumPostcodeEmbed = ({ onComplete, isOpen, onClose }) => {
    // Daum 주소
    React.useEffect(() => {
        const script = document.createElement('script');
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        document.head.appendChild(script);
        return () => { document.head.removeChild(script); };
    }, []);

    // Daum 주소 검색
    const openPostcode = () => {
        if (typeof window.daum === 'undefined' || typeof window.daum.Postcode === 'undefined') {
            alert("주소 검색 스크립트 로딩 중입니다. 잠시 후 다시 시도해 주세요.");
            return;
        }

        new window.daum.Postcode({
            oncomplete: (data) => {
                let addr = data.roadAddress || data.jibunAddress;
                onComplete({
                    zonecode: data.zonecode,
                    address: addr,
                });
                onClose();
            },
        }).open({
            // 팝업 중앙 정렬 스타일
            left: (window.screen.width / 2) - (450 / 2),
            top: (window.screen.height / 2) - (550 / 2)
        });
    };

    // 모달을 열기 위한 버튼
    return (
        <button
            onClick={openPostcode}
            type="button"
            style={{
                height: '100%',
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'background-color 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#2563eb'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
            주소 찾기
        </button>
    );
};
// -----------------------------------------------------------


export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        loginID: "", password: "", password1: "", name: "",
        birthday: "", email: "", addr: "", addr_detail: "",
        user_zipcode: "", team: "", tel1: "", tel2: "", tel3: "",
    });
    const [dup, setDup] = useState({ id: false, email: false });
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(null);

    const inputStyle = {
        width: '100%',
        padding: '10px',
        border: '1px solid #d1d5db', // gray-300
        borderRadius: '8px',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        outline: 'none',
    };

    const handleFocus = (e) => {
        e.currentTarget.style.borderColor = '#4ade80';
        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(74, 222, 128, 0.5)';
    };

    const handleBlur = (e) => {
        e.currentTarget.style.borderColor = '#d1d5db';
        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
    };


    const onChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        if (name === 'password' || name === 'password1') {
            const pw = name === 'password' ? value : form.password;
            const pw1 = name === 'password1' ? value : form.password1;
            if (pw1.length > 0) {
                setPasswordMatch(pw === pw1);
            } else {
                setPasswordMatch(null);
            }
        }
    }, [form.password, form.password1]);

    const handleAddressComplete = useCallback((data) => {
        setForm(prev => ({
            ...prev,
            user_zipcode: data.zonecode,
            addr: data.address,
            addr_detail: '',
        }));
        setIsPostcodeOpen(false);
    }, []);

    const checkId = async () => {
        if (!/^[a-z0-9]{6,20}$/.test(form.loginID)) {
            return alert("아이디는 숫자, 영문자 조합으로 6~20자리여야 합니다.");
        }
        try {
            const { data, status } = await axios.post(
                "/api/checkDuplicatedloginID",
                new URLSearchParams({ loginID: form.loginID }),
                { headers: { "Content-Type": "application/x-www-form-urlencoded" }, validateStatus: () => true }
            );

            if (status === 200 && data.result === "SUCCESS") {
                alert("사용 가능한 아이디입니다.");
                setDup((d) => ({ ...d, id: true }));
            } else {
                // 409/401 등도 여기서 친절히 안내
                alert(data?.resultMsg || "이미 사용 중인 아이디입니다.");
                setDup((d) => ({ ...d, id: false }));
            }
        } catch (e) {
            console.error("ID 중복 확인 오류:", e);
            alert("중복 확인 중 오류가 발생했습니다.");
            setDup((d) => ({ ...d, id: false }));
        }
    };

    const checkEmail = async () => {
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(form.email)) {
            return alert("올바른 이메일 형식을 입력해주세요.");
        }
        try {
            const { data, status } = await axios.post(
                "/api/checkDuplicatedEmail",
                new URLSearchParams({ email: form.email }),
                { headers: { "Content-Type": "application/x-www-form-urlencoded" }, validateStatus: () => true }
            );

            if (status === 200 && data.result === "SUCCESS") {
                alert("사용 가능한 이메일입니다.");
                setDup((d) => ({ ...d, email: true }));
            } else {
                alert(data?.resultMsg || "이미 사용 중인 이메일입니다.");
                setDup((d) => ({ ...d, email: false }));
            }
        } catch (e) {
            console.error("Email 중복 확인 오류:", e);
            alert("중복 확인 중 오류가 발생했습니다.");
            setDup((d) => ({ ...d, email: false }));
        }
    };

    const submit = async () => {
        if (!dup.id) return alert("아이디 중복확인을 완료해주세요.");
        if (!dup.email) return alert("이메일 중복확인을 완료해주세요.");
        if (form.password.length < 4) return alert("비밀번호를 4자 이상 입력해주세요.");
        if (form.password !== form.password1) return alert("비밀번호가 일치하지 않습니다.");
        if (form.team === "") return alert("소속팀을 선택해주세요.");
        if (!form.addr || !form.user_zipcode) return alert("주소 찾기를 통해 주소를 입력해주세요.");

        const payload = new URLSearchParams({
            action: "I",
            loginID: form.loginID,
            password: form.password,
            name: form.name,
            birthday: form.birthday,
            email: form.email,
            addr: form.addr,
            addr_detail: form.addr_detail,
            team: form.team,
            hp: `${form.tel1}-${form.tel2}-${form.tel3}`,
            user_type: "B",
        });

        try {
            const { data } = await axios.post("/api/register.do", payload, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
            if (data.result === "SUCCESS") {
                alert(data.resultMsg || "가입 완료.");
                navigate("/login");
            } else {
                alert(data.resultMsg || "가입 실패");
            }
        } catch (e) {
            console.error("회원가입 요청 실패:", e);
            alert("회원가입 중 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    };

    const RequiredLabel = ({ children }) => (
        <div style={{display: 'flex', alignItems: 'center', color: '#1f2937', fontWeight: 'bold', fontSize: '14px'}}>
            {children}
            <span style={{color: '#ef4444', marginLeft: '4px', fontSize: '16px'}}>*</span>
        </div>
    );

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f9fafb',
            padding: '16px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '768px',
                backgroundColor: 'white',
                padding: '32px',
                borderRadius: '16px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                border: '1px solid #f3f4f6'
            }}>
                <h2 style={{
                    fontSize: '28px',
                    fontWeight: '800',
                    textAlign: 'center',
                    color: '#1f2937',
                    marginBottom: '40px'
                }}>회원가입</h2>

                <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                        <tbody>
                        {/* 아이디 */}
                        <tr>
                            <td style={cellLeftStyle}><RequiredLabel>아이디</RequiredLabel></td>
                            <td style={cellRightStyle}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="text" name="loginID" value={form.loginID} onChange={onChange}
                                        placeholder="영문/숫자 6~20자리" required disabled={dup.id}
                                        style={{ ...inputStyle, flexGrow: 1 }}
                                        onFocus={handleFocus} onBlur={handleBlur}
                                    />
                                    <button type="button" onClick={checkId} disabled={dup.id}
                                            style={{
                                                width: '128px',
                                                padding: '8px 16px',
                                                borderRadius: '8px',
                                                fontWeight: 'bold',
                                                transition: 'background-color 0.2s, box-shadow 0.2s',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                                backgroundColor: dup.id ? '#9ca3af' : '#3b82f6',
                                                color: dup.id ? '#374151' : 'white',
                                                cursor: dup.id ? 'not-allowed' : 'pointer',
                                            }}
                                            onMouseOver={e => !dup.id ? e.currentTarget.style.backgroundColor = '#2563eb' : null}
                                            onMouseOut={e => !dup.id ? e.currentTarget.style.backgroundColor = '#3b82f6' : null}
                                    >
                                        {dup.id ? '확인 완료' : '중복확인'}
                                    </button>
                                </div>
                            </td>
                        </tr>

                        {/* 비밀번호 */}
                        <tr>
                            <td style={cellLeftStyle}><RequiredLabel>비밀번호</RequiredLabel></td>
                            <td style={cellRightStyle}>
                                <input type="password" name="password" value={form.password} onChange={onChange} required
                                       style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
                                />
                            </td>
                        </tr>

                        {/* 비밀번호 확인 */}
                        <tr>
                            <td style={cellLeftStyle}><RequiredLabel>비밀번호 확인</RequiredLabel></td>
                            <td style={cellRightStyle}>
                                <input type="password" name="password1" value={form.password1} onChange={onChange} required
                                       style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
                                />
                                {passwordMatch !== null && (
                                    <p style={{
                                        marginTop: '4px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: passwordMatch ? '#10b981' : '#dc2626'
                                    }}>
                                        {passwordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
                                    </p>
                                )}
                            </td>
                        </tr>

                        {/* 이름 */}
                        <tr>
                            <td style={cellLeftStyle}><RequiredLabel>이름</RequiredLabel></td>
                            <td style={cellRightStyle}>
                                <input type="text" name="name" value={form.name} onChange={onChange} required
                                       style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
                                />
                            </td>
                        </tr>

                        {/* 생년월일 */}
                        <tr>
                            <td style={cellLeftStyle}><RequiredLabel>생년월일</RequiredLabel></td>
                            <td style={cellRightStyle}>
                                <input type="date" name="birthday" value={form.birthday} onChange={onChange} required
                                       style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
                                />
                            </td>
                        </tr>

                        {/* 이메일 */}
                        <tr>
                            <td style={cellLeftStyle}><RequiredLabel>이메일</RequiredLabel></td>
                            <td style={cellRightStyle}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="email" name="email" value={form.email} onChange={onChange} required disabled={dup.email}
                                        style={{ ...inputStyle, flexGrow: 1 }} onFocus={handleFocus} onBlur={handleBlur}
                                    />
                                    <button type="button" onClick={checkEmail} disabled={dup.email}
                                            style={{
                                                width: '128px',
                                                padding: '8px 16px',
                                                borderRadius: '8px',
                                                fontWeight: 'bold',
                                                transition: 'background-color 0.2s, box-shadow 0.2s',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                                backgroundColor: dup.email ? '#9ca3af' : '#3b82f6',
                                                color: dup.email ? '#374151' : 'white',
                                                cursor: dup.email ? 'not-allowed' : 'pointer',
                                            }}
                                            onMouseOver={e => !dup.email ? e.currentTarget.style.backgroundColor = '#2563eb' : null}
                                            onMouseOut={e => !dup.email ? e.currentTarget.style.backgroundColor = '#3b82f6' : null}
                                    >
                                        {dup.email ? '확인 완료' : '중복확인'}
                                    </button>
                                </div>
                            </td>
                        </tr>
                        {/* 주소 - 다음 API */}
                        <tr>
                            <td style={cellLeftStyle}><RequiredLabel>주소</RequiredLabel></td>
                            <td style={cellRightStyle}>
                                <div style={{display: 'flex', gap: '8px', marginBottom: '8px'}}>
                                    <input
                                        type="text" name="user_zipcode" value={form.user_zipcode} readOnly placeholder="우편번호" required
                                        style={{
                                            width: '96px',
                                            padding: '10px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            backgroundColor: '#f3f4f6',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                        }}
                                    />
                                    <DaumPostcodeEmbed
                                        onComplete={handleAddressComplete}
                                        isOpen={isPostcodeOpen}
                                        onClose={() => setIsPostcodeOpen(false)}
                                    />
                                </div>
                                <input
                                    type="text" name="addr" value={form.addr} readOnly placeholder="주소 찾기로 자동 입력됩니다." required
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        backgroundColor: '#f3f4f6',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                    }}
                                />
                            </td>
                        </tr>
                        {/* 상세 주소 */}
                        <tr>
                            <td style={cellLeftStyle}><RequiredLabel>상세주소</RequiredLabel></td>
                            <td style={cellRightStyle}>
                                <input
                                    type="text"
                                    name="addr_detail"
                                    value={form.addr_detail}
                                    onChange={onChange}
                                    placeholder="상세 주소를 입력해주세요."
                                    style={inputStyle}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                />
                            </td>
                        </tr>
                        {/* 전화번호 */}
                        <tr>
                            <td style={cellLeftStyle}><RequiredLabel>전화번호</RequiredLabel></td>
                            <td style={cellRightStyle}>
                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                    <input type="text" name="tel1" value={form.tel1} onChange={onChange} maxLength={3} required
                                           style={{ width: '64px', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', textAlign: 'center' }}
                                           onFocus={handleFocus} onBlur={handleBlur} />
                                    <span style={{ fontWeight: 'bold' }}>-</span>
                                    <input type="text" name="tel2" value={form.tel2} onChange={onChange} maxLength={4} required
                                           style={{ width: '80px', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', textAlign: 'center' }}
                                           onFocus={handleFocus} onBlur={handleBlur} />
                                    <span style={{ fontWeight: 'bold' }}>-</span>
                                    <input type="text" name="tel3" value={form.tel3} onChange={onChange} maxLength={4} required
                                           style={{ width: '80px', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', textAlign: 'center' }}
                                           onFocus={handleFocus} onBlur={handleBlur} />
                                </div>
                            </td>
                        </tr>
                        {/* 소속팀 */}
                        <tr>
                            <td style={cellLeftStyle}><RequiredLabel>소속팀</RequiredLabel></td>
                            <td style={cellRightStyle}>
                                <select
                                    name="team"
                                    value={form.team}
                                    onChange={onChange}
                                    required
                                    style={{ ...inputStyle, backgroundColor: 'white' }}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                >
                                    <option value="">선택해주세요</option>
                                    <option value="테스트팀">테스트팀</option>
                                    <option value="총무팀">총무팀</option>
                                    <option value="개발팀">개발팀</option>
                                    <option value="보안팀">보안팀</option>
                                    <option value="홍보팀">홍보팀</option>
                                </select>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    {/* 버튼 그룹 */}
                    <div style={{display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '48px'}}>
                        <button type="submit"
                                style={{
                                    width: '192px',
                                    padding: '12px 24px',
                                    backgroundColor: '#059669',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '18px',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    transition: 'background-color 0.3s, transform 0.3s',
                                    cursor: 'pointer',
                                }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#047857'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = '#059669'}
                        >
                            회원가입
                        </button>
                        <button type="button" onClick={() => navigate("/login")}
                                style={{
                                    width: '192px',
                                    padding: '12px 24px',
                                    backgroundColor: '#6b7280',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '18px',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    transition: 'background-color 0.3s, transform 0.3s',
                                    cursor: 'pointer',
                                }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#4b5563'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = '#6b7280'}
                        >
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
