import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Session from "react-session-api";
import logo_img from "../assets/images/admin/login/logo_img.png";
import { GoogleLogin } from "@react-oauth/google"
/*import { jwtDecode } from "jwt-decode";*/
import googleLogo from "../assets/images/site/google_logo.svg";


const Login = () => {
    useEffect(() => {
        console.log("Login useEffect start");
    }, []);

    const navigate = useNavigate();
    //const history = useHistory()

    const [account, setAccount] = useState({
        userId: "",
        userPw: "",
    });

    const linkTest = (e) => {
        console.log("linkTest start");
        console.log(e);
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            fLoginProc();
        }
    };

    //input에 입력될 때마다 account state값 변경되게 하는 함수
    const onChangeAccount = (e) => {
        setAccount({
            ...account,
            [e.target.name]: e.target.value,
        });
    };

    // ID 저장
    const [rememberId, setRememberId] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("rememberId");
        if (saved) {
            setAccount(prev => ({ ...prev, userId: saved })); // 입력창에 바로 채움
            setRememberId(true);                               // 체크박스 ON
        }
    }, []);

    const fLoginProc = async function () {
        console.log("fLoginProc start");
        console.log(account.userId);
        console.log(account.userPw);

        // alert(Session.get("loginResult"));
        Session.set("loginResult", "F");
        Session.set("loginId", "");
        // alert(Session.get("loginResult"));

        await axios
            .post(
                "/api/login.do",/*"/api/loginProc.do"*/
                new URLSearchParams({ lgn_Id: account.userId, pwd: account.userPw }),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Accept: "application/json", // 서버에 JSON 형식의 응답을 요청
                    },
                }
            )
            .then((res) => {
                console.log("res start");
                console.log(res);
                const data = res.data;
                if (data.result === "SUCCESS") {
                    //alert("로그인성공");
                    Session.set("loginResult", "S");
                    Session.set("loginId", data.loginId);
                    //usrMnuAtrt 메뉴리스트
                    Session.set("usrMnuAtrt", data.usrMnuAtrt);

                    sessionStorage.setItem("loginInfo", JSON.stringify(data));

                    sessionStorage.setItem(
                        "usrMnuAtrt2",
                        JSON.stringify(data.usrMnuAtrt)
                    );

                    const loginInfo = [
                        data.loginId,
                        data.userNm,
                        data.userType,
                        data.serverName,
                    ];
                    sessionStorage.setItem("loginId", data.loginId);
                    sessionStorage.setItem("userNm", data.userNm);
                    sessionStorage.setItem("userType", data.userType);
                    sessionStorage.setItem("serverName", data.serverName);

                    sessionStorage.setItem("loginInfo2", loginInfo);

                    if (rememberId && account.userId.trim()) {
                        localStorage.setItem("rememberId", account.userId.trim());
                    } else {
                        localStorage.removeItem("rememberId");
                    }
                    //history.push('/dashboard/home')
                    navigate("/dashboard");
                } else {
                    if (!rememberId) localStorage.removeItem("rememberId");
                    alert("ID 혹은 비밀번호가 틀립니다");
                    Session.set("loginResult", "F");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // 구글 리다이렉트
    const handleGoogleRedirect = () => {
        // 백엔드가 구글 동의화면으로 리다이렉트 시켜줌
        window.location.href ="http://localhost/api/googleLogin";
    };


    return (
        <>
            <div id="background_board">
                <div className="login_form shadow">
                    <div className="login-form-right-side">
                        <div className="top-logo-wrap">
                            <img id="login-logo" src={logo_img} />
                        </div>
                        <h3> 안되는 것이 실패가 아니라 포기하는 것이 실패다 </h3>
                        <p>
                            성공은 실패의 꼬리를 물고 온다.지금 포기한 것이 있는가 ?
                            <br />
                            그렇다면 다시 시작해 보자. <br />
                            안되는 것이 실패가 아니라 포기하는 것이 실패다. <br />
                            포기한 순간이 성공하기 5 분전이기 쉽다. <br />
                            실패에서 더 많이 배운다. <br />
                            실패를 반복해서 경험하면 실망하기 쉽다. <br />
                            하지만 포기를 생각해선 안된다.실패는 언제나 중간역이지 종착역은
                            아니다. <br />
                        </p>
                        <p> -이대희, ‘1 % 의 가능성을 희망으로 바꾼 사람들’ 에서 </p>
                    </div>
                    <div className="login-form-left-side">
                        <fieldset>
                            <p className="id">
                                <label for="userId"> 아이디 </label>
                                <input
                                    id="userId"
                                    type="text"
                                    name="userId"
                                    value={account.userId}
                                    placeholder="아이디"
                                    onChange={onChangeAccount}
                                />
                            </p>
                            <p className="pw">
                                <label for="userPw"> 비밀번호 </label>
                                <input
                                    id="userPw"
                                    type="password"
                                    name="userPw"
                                    placeholder="비밀번호"
                                    onChange={onChangeAccount}
                                    onKeyDown={onKeyDown}
                                />
                            </p>
                            <p className="member_info">
                                <input id="saveId" type="checkbox"
                                       checked={rememberId} onChange={(e) => setRememberId(e.target.checked)}/>
                                <span className="id_save"> ID저장 </span>
                            </p>
                            <div>
                                <Link id="RegisterBtn" to="/register" name="modal">
                                    <strong> [회원가입] </strong>
                                </Link>
                                <Link to={"/find"}>
                                    <strong> [아이디 / 비밀번호 찾기] </strong>
                                </Link>
                                <Link to="/somewhere">
                      <span onClick={(e) => {
                          e.preventDefault();
                      }}>
                        left
                      </span>
                                </Link>
                            </div>
                            <a className="btn_login" id="btn_login" onClick={fLoginProc}>
                                <strong> Login </strong>
                            </a>
                            {/* 구글 로그인 */}
                            <div style={{ marginTop: "70px", textAlign: "center" }}>
                                <button
                                    type="button"
                                    onClick={handleGoogleRedirect}
                                    style={{

                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "325px",
                                        height: "52px",
                                        backgroundColor: "#fff",
                                        border: "1px solid #ccc",
                                        borderRadius: "5rem",
                                        cursor: "pointer",
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                        gap: "8px",
                                    }}
                                >
                                    <img
                                        src={googleLogo} alt="google"
                                        alt="google"
                                        style={{ width: "20px", height: "20px" }}
                                    />
                                    구글 로그인
                                </button>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;