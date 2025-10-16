import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import "../assets/css/find/find.css";

axios.defaults.withCredentials = true;

function Find () {
    const [tab , setTab] = useState("id");

    return (
        <div className="find-wrap">
            <div className="find-header">
                <div className="find-title"><h2>계 정 찾 기</h2></div>
            </div>
                <div className="tabs">
                    <button className={`tab-btn ${tab==="id" ? "active":""}`} onClick={() => setTab("id")} disabled={tab==="id"} >아이디 찾기</button>
                    <button className={`tab-btn ${tab==="pw" ? "active":""}`} onClick={() => setTab("pw")} disabled={tab==="pw"}>비밀번호 찾기</button>
                </div>
                {tab === "id" ? <FindID/> : <FindPW/> }
        </div>
    );
}

function FindID () {
    const [name,setName] = useState("");
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [code, setCode] = useState("");
    const [result, setResult] = useState(null);

    const navigateID = useNavigate();
    const onCancel = () => {
        navigateID("/login", { replace: true, state: { from: "find-id" } });
    };

    const sendMail = async () => {
        try {
            await axios.post(
                "/api/sendMailForFindID",
                new URLSearchParams({name,email}),//name, email 전송
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            );
            setSent(true);
            alert("인증번호를 발송하였습니다.");
        } catch (e) {
            alert("해당계정을 찾을 수 없습니다.=");
        }
    };

    const validate = async () => {
        try {
            const {data} = await axios.post(
                "/api/validation/id/mail",
                new URLSearchParams({validationNumber: code}), // 파라임터 이름 일치
                {headers: {"Content-Type": "application/x-www-form-urlencoded"}}
            );
            setResult(data);
            /*navigateID("/login");*/

        } catch (e) {
            alert("인증 실패");
        }
    };



    return (
        <div>
            {!sent ? (
                <>
                    <div className="field">
                        <label className="label">이름</label>
                        <input className="input" value={name} onChange={e => setName(e.target.value)}/>
                    </div>
                    <div className="field">
                        <label className="label">이메일</label>
                        <input className="input" value={email} onChange={e=>setEmail(e.target.value)}/>
                    </div>
                    <button className="btn btn-primary" onClick={sendMail}>인증번호 보내기</button>
                    <button className="btn btn-cancel" onClick={onCancel}>취소</button>
                </>
            ) : (
                <>
                    <div className="field">
                        <label className="label"> 인증번호</label>
                        <input className="input code-input" value={code} onChange={e=>setCode(e.target.value)}/>
                    </div>
                    <button className="btn btn-success" onClick={validate}>인증확인</button>
                    {result && (
                        <div className="result-card">
                            <div><b>아이디:</b> {result.loginID}</div>
                            <div><b>가입일:</b> {result.regdate}</div>
                        </div>
                    )}
                    <button className="btn btn-cacel" onClick={onCancel}>로그인 페이지</button>
                </>
            )}
        </div>
    );
}

function FindPW () {
    const [loginID, setLoginID] = useState("");
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const navigatePW = useNavigate();
    const onCancel = () => {
        navigatePW("/login", { replace: true, state: { from: "find-pw" } });
    };

    const sendMail = async () => {
        try {
            await axios.post (
                "/api/sendMailForFindPW",
                new URLSearchParams({loginID, email } ),
                { headers : { "Content-Type": "application/x-www-form-urlencoded" } }
            );
            setSent(true);
            alert("인증번호를 이메일로 보냈습니다..");
        } catch (e) {
            if (e?.response?.status === 406) {
                alert("소셜로그인 계정입니다. 해당 소셜에서 비밀번호를 전송하세요.")
            } else if(e?.response?.status === 404) {
                alert("해장 정보의 계정을 찾을 수 없습니다.");
            } else {
                alert("메일 전송중 오류가 발생했습니다.");
            }
        }finally{
            setLoading(false);
        }
    };

    const validateAndReset = async () => {
        const v  = code.trim();
        try {
            const {data} = await axios.post(
                "/api/validation/update/pw/mail",
                new URLSearchParams({
                    validationNumber: v,
                }),
                { headers : { "Content-Type": "application/x-www-form-urlencoded" } }
            );
            alert("임시 비밀번호가 이메일로 전송되었습니다.");

            navigatePW("/login", { replace: true, state: { from: "pw-reset" } });

            console.log("reset result", data);
        } catch (e) {
            alert("인증실패");
        }
    };

    return(
        <div>
            { !sent ? (
                <>
                    <div className="field" >
                        <label className="label" >아이디</label>
                        <input className="input code-input" value = {loginID} onChange={e=>setLoginID(e.target.value)}></input>
                    </div>
                    <div  className="field">
                        <label className="label">이메일</label>
                        <input className="input code-input" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <button className="btn btn-primary" onClick={sendMail}>인증메일 보내기</button>
                    <button className="btn btn-cancel" onClick={onCancel}>취소</button>
                </>
            ) : (
                <>
                    <div>
                        <label>인증번호</label>
                        <input value={code} onChange={e=>setCode(e.target.value)}></input>
                    </div>
                    <button onClick={validateAndReset}>인증 확인 및 비밀번호 초기화</button>
                </>
            )}
        </div>
    );

}

export default Find;
