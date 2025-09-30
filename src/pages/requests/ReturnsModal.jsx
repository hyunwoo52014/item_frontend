import React from 'react';
import './ReturnsModal.css';
import axios from 'axios';

// 상세보기 모달
const ReturnsModal = ({ isOpen, onClose, data, onUpdateList }) => {

    // 모달이 닫혀 있거나 데이터가 없으면 렌더링하지 않음
    if (!isOpen || !data || Object.keys(data).length === 0) return null;

    // --- 데이터 디스트럭처링 (data 객체에서 모든 정보를 추출) ---
    const {
        assetName = 'N/A',
        assetCode = 'N/A',
        user = 'N/A',
        applicationDate = '-',
        startDate = '-',
        reason = '사유 없음',
        currentStatus, // <--- Returns.jsx에서 넘겨준 상태 문자열
        product_detail_code
    } = data;

    // 상태별 플래그
    const isReturning = currentStatus === '사용중';          // 반납 버튼 있음.
    const isPending = currentStatus === '반납신청중' || currentStatus === '사용신청중'; // 취소 버튼 있음.

    // 개별 장비 반납/취소 처리
    const handleReturnOne = async () => {
        const userLoginId = sessionStorage.getItem("loginId");
        if (!userLoginId) {
            alert("로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.");
            return;
        }

        if (!data || !data.product_detail_code) {
            alert("반납할 장비 정보가 없습니다.");
            return;
        }

        if (window.confirm("선택한 장비를 반납 신청하시겠습니까?")) {
            const param = {
                loginId: userLoginId,
                product_detail_code: data.product_detail_code
            };

            const postData = new URLSearchParams(param);

            try {
                const response = await axios.post(
                    "/requests/returns/returnOne",
                    postData,
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            Accept: "application/json",
                        },
                    }
                );

                if (response.data.result === "SUCCESS") {
                    alert(response.data.resultMsg || "반납 신청이 완료되었습니다.");
                    onUpdateList();  // 목록 갱신
                    onClose();       // 모달 닫기
                } else {
                    alert(`반납 실패: ${response.data.resultMsg || '오류가 발생했습니다.'}`);
                }
            } catch (error) {
                console.error("개별 반납 실패:", error);
                alert("반납 신청 처리 중 오류가 발생했습니다.");
            }
        }
    };


    const handleCancel = async () => {
        const userLoginId = sessionStorage.getItem("loginId");
        if (!userLoginId) {
            alert("로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.");
            return;
        }

        if (!data || !data.product_detail_code) {
            alert("취소할 장비 정보가 없습니다.");
            return;
        }

        if (window.confirm("선택한 장비의 반납 신청을 취소하시겠습니까?")) {
            const param = {
                loginId: userLoginId,
                product_detail_code: data.product_detail_code
            };

            const postData = new URLSearchParams(param);

            try {
                const response = await axios.post(
                    "/requests/returns/cancelReturn",
                    postData,
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            Accept: "application/json",
                        },
                    }
                );

                if (response.data.result === "SUCCESS") {
                    alert(response.data.resultMsg || "반납 신청 취소가 완료되었습니다.");
                    onUpdateList();  // Returns.jsx의 목록 갱신 함수 호출
                    onClose();       // 모달 닫기
                } else {
                    alert(`취소 실패: ${response.data.resultMsg || '오류가 발생했습니다.'}`);
                }
            } catch (error) {
                console.error("반납 신청 취소 실패:", error);
                alert("취소 처리 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        // 모달 오버레이 → as-is의 layerPop/layerType2 구조 사용
        <div id="applyModal" className="layerPop layerType2" style={{ width: '700px' }} onClick={onClose}>
            <dl onClick={e => e.stopPropagation()}>
                {/* 1. 모달 헤더 */}
                <dt>
                    <strong>IT 자산</strong>
                </dt>

                {/* 2. 모달 바디 (폼 내용) */}
                <dd className="content">

                    <table className="row">
                        <caption>caption</caption>
                        <colgroup>
                            <col width="120px" />
                            <col width="*" />
                            <col width="120px" />
                            <col width="*" />
                        </colgroup>
                        <tbody>
                        <tr>
                            <th scope="row">장비명</th>
                            <td>
                                <input type="text" value={assetName} readOnly className="inputTxt p100" />
                            </td>
                            <th scope="row">장비코드</th>
                            <td>
                                <input type="text" value={assetCode} readOnly className="inputTxt p100" />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">사용자</th>
                            <td colSpan={3}>
                                <input type="text" value={user} readOnly className="inputTxt p100" />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">사용신청일</th>
                            <td>
                                <input type="text" value={applicationDate} readOnly className="inputTxt p100" />
                            </td>
                            <th scope="row">사용시작일</th>
                            <td>
                                <input type="text" value={startDate} readOnly className="inputTxt p100" />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">신청사유</th>
                            <td colSpan={3}>
                                <textarea
                                    value={reason}
                                    readOnly={true}
                                    className="inputTxt p100"
                                    style={{ height: '150px' }}
                                ></textarea>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    {/* 3. 모달 푸터 (버튼) */}
                    <div className="btn_areaC mt30">
                        {isReturning && (
                            <>
                                <a href="#" className="btnType blue" id="returnBtn" onClick={handleReturnOne}>
                                    <span>반납</span>
                                </a>
                                <a href="#" className="btnType gray" id="closeBtn" onClick={onClose}>
                                    <span>닫기</span>
                                </a>
                            </>
                        )}

                        {isPending && (
                            <>
                                <a href="#" className="btnType blue" id="cancelBtn" onClick={handleCancel}>
                                    <span>취소</span>
                                </a>
                                <a href="#" className="btnType gray" id="closeBtn" onClick={onClose}>
                                    <span>닫기</span>
                                </a>
                            </>
                        )}

                        {!isReturning && !isPending && (
                            <a href="#" className="btnType gray" id="closeBtn" onClick={onClose}>
                                <span>닫기</span>
                            </a>
                        )}
                    </div>
                </dd>
            </dl>
            <a href="#" className="closePop" onClick={onClose}>
                <span className="hidden">닫기</span>
            </a>
        </div>
    )
}

export default ReturnsModal;