import {useState} from "react";
import axios from "axios";
import {setElement} from "react-modal/lib/helpers/ariaAppHider";

function Find () {
    const [tab , setTab] = useState("id");
    return (
        <div style = {{maxWidth:600, margin:"40px auto"}}>
            <div style={ {display:"flex", gap:8, marginBottom:"16"}}>
                <button onClick={() => setTab("id")} disabled={tab=="id"}>아이디 찾기</button>
                <button onClick={() => setTab("pw")} disabled={tab=="pw"}>비밀번호 찾기</button>
            </div>
            {tab === "id" ? <FindID/> : <FindPW/> }
        </div>
    );
}

function FindID () {
    const [name,setName] = useState("");
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState("");
    const [code, setCode] = useState("");
    const [result, setResult] = useState(null);

    const sendMail = async () => {
        try {
            await axios.post("/api/sendMailForFindID");
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
                new URLSearchParams({validationNumber: code}),
                {headers: {"Content-Type": "application/x-www-form-urlencoded"}}
            );
            setResult(data);
        } catch (e) {
            alert("인증 실패");
        }
    };

    return (
        <div>
            {!sent ? (
                <>
                    <div>
                        <label>이름</label>
                        <input value={name} onChange={e => setName(e.target.value)}/>
                    </div>
                    <div>
                        <lable>이메일</lable>
                        <input value={email} onChange={e=>setEmail(e.target.value)}/>
                    </div>
                    <button onClick={sendMail}>인증번호 보내기</button>
                </>
            ) : (
                <>
                    <div>
                        <lable> 인증번호</lable>
                        <input value={code} onChange={e=>setCode(e.target.value)}/>
                    </div>
                    <button onClick={validate}>인증확인</button>
                    {result && (
                        <div style={{marginTop:12}}>
                            <div>아이디: {result.loginID}</div>
                            <div>가입일: {result.regdate}</div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function FindPW () {
    const [loginID, setLoginID] = useState("");
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState("");
    const [code, setCode] = useState("");

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
            if(e?.response?.staus === 406){
                alert("소셜로그인 계정입니다. 해당 소셜에서 비밀번호를 전송하세요.")
            }else {
                alert("해장 정보의 계정을 찾을 수 없습니다.");
            }

        }
    };

    const vaildateAndReset = async () => {
        try {
            const {data} = await axios.post(
                "/api/sendMailForFindPW",
                new URLSearchParams({loginID, email } ),
                { headers : { "Content-Type": "application/x-www-form-urlencoded" } }
            );
            alert("임시 비밀번호가 이메일로 전송되었습니다.");
            console.log("reset result", data);
        } catch (e) {
            alert("인증실패");
        }
    };

    return(
        <div>
            { !sent ? (
                <>
                    <div>
                        <label>아이디</label>
                        <input value = "loginID" onChange={e=>setLoginID(e.target.value)}></input>
                    </div>
                    <div>
                        <label>이메일</label>
                        <input value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <button onClick={sendMail}>인증메일 보내기</button>
                </>
            ) : (
                <>
                    <div>
                        <label>인증번호</label>
                        <input value={code} onChange={e=>setCode(e.target.value)}></input>
                    </div>
                    <button onClick={vaildateAndReset}>인증 확인 및 비밀번호 초기화</button>
                </>
            )}
        </div>
    );

}

export default Find;
