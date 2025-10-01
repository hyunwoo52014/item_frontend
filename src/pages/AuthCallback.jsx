import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Session from "react-session-api";

const AuthCallback = () => {
    const navigate = useNavigate();

    const normalize = (v) => {
        if (v === null || v === undefined) return null;
        const s = String(v).trim().toLowerCase();
        if (s === "" || s === "null" || s === "undefined") return null;
        return s;
    };

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                // 백엔드에서 세션 정보 가져오기
                const res = await axios.get("http://localhost:80/api/auth/check", {
                    withCredentials: true  // 쿠키 포함 (중요!)
                });

                const data = res.data;

                if (data.loginId) {
                    // 세션 스토리지에 저장 (일반 로그인과 동일하게)
                    Session.set("loginResult", "S");
                    Session.set("loginId", data.loginId);
                    Session.set("usrMnuAtrt", data.usrMnuAtrt);

                    sessionStorage.setItem("loginInfo", JSON.stringify(data));
                    sessionStorage.setItem("usrMnuAtrt2", JSON.stringify(data.usrMnuAtrt));
                    sessionStorage.setItem("loginId", data.loginId);
                    sessionStorage.setItem("userNm", data.userNm);
                    sessionStorage.setItem("userType", data.userType);
                    sessionStorage.setItem("serverName", data.serverName);

                    const teamNormalized = normalize(data.team);

                    console.log("=== AuthCallback Debug ===");
                    console.log("raw team:", data.team);
                    console.log("typeof team:", typeof data.team);
                    console.log("trimmed team:", data.team ? data.team.trim() : "(null)");



                    // team값 확인 -> null이면 Additional 페이지로 이동
                    if(!teamNormalized) {
                        if(data.team && data.team.trim() !== ""){
                        // 대시보드로 이동
                            navigate("/dashboard");
                        } else {
                            // 없으면 addtional-info
                            navigate("/additional-info");
                        }
                    } else {
                        navigate("/dashboard");
                    }
                } else {
                    // 세션 없음 -> 로그인 페이지
                    alert("로그인에 실패했습니다.");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Session check failed:", error);
                alert("로그인 처리 중 오류가 발생했습니다.");
                navigate("/login");
            }
        };

        fetchSessionData();
    }, [navigate]);

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            fontFamily: "Arial, sans-serif",
            backgroundColor: "#f5f5f5"
        }}>
            <div style={{ textAlign: "center" }}>
                <div style={{
                    border: "4px solid #f3f3f3",
                    borderTop: "4px solid #3498db",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    animation: "spin 1s linear infinite",
                    margin: "0 auto 20px"
                }}></div>
                <p>로그인 처리 중입니다...</p>
            </div>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AuthCallback;