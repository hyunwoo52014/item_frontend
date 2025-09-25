import React, {useContext, useEffect, useState} from "react";
import {HistoryModalContext} from "./History";

const HistoryModal = () => {

    const {modalState, setModalState} = useContext(HistoryModalContext);

    const [detailData, setDetailData] = useState({
        orderDate : "",
        team : "",
        name : "",
        productName : "",
        productDetailCode : "",
        rentalDate : "",
        returnDate : "",
        orderReason : "",
    });

    const [sessionToUserTypeData, setSessionToUserTypeData] = useState({
        userType : "",
    });

    const closeModal = (e) => {
        e.preventDefault();
        setModalState((prev) => (
            {
                ...prev,
                isOpen: false,
                payload: {},
            }
        ))
    }

    useEffect(() => {
        if(modalState.isOpen){
            setDetailData((prev)=>(
                {
                    ...prev,
                    orderDate : modalState.payload.orderDate??"",
                    orderReason: modalState.payload.orderReason??"",
                    productName: modalState.payload.productName??"",
                    productDetailCode: modalState.payload.productDetailCode??"",
                    rentalDate: modalState.payload.rentalDate??"",
                    returnDate: modalState.payload.returnDate??"",
                    name: modalState.payload.name??"",
                    team: modalState.payload.team??"",
                }
            ));
        }

    }, [modalState]);

    useEffect(() => {
        const storedUserTypeData = sessionStorage.getItem("userType");

        if(storedUserTypeData){
            setSessionToUserTypeData((prev)=>(
                {
                    ...prev,
                    userType : storedUserTypeData,
                }
            ));
        }
    },[]);

    const modalStyle = {
        width: "700px",
        display: modalState.isOpen ? "block" : "none",
    }

    const modalBackgroundStyle = {
        position: "fixed",
        display: modalState.isOpen ? "block" : "none",
        paddingTop: "7%",
        paddingBottom: "0",
        paddingLeft: "33%",
        paddingRight: "0",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        background: "rgba(0,0,0, 0.8)",
    }

    return (
        <div id="modalBackground" style={modalBackgroundStyle}>

            <div id="historyModal" className="layerPop layerType2" style={modalStyle}>

                <dl>
                    <dt>
                        <strong>IT 자산 히스토리 상세</strong>
                    </dt>
                    <dd className="content">
                        <table className="row">
                            <caption>caption</caption>
                            <colgroup>
                                <col width="120px"/>
                                <col width="*"/>
                                <col width="120px"/>
                                <col width="*"/>
                            </colgroup>
                            <tbody>
                            <tr>
                                <th scope="row">사용신청일</th>
                                <td colSpan="3"><input type="text" className="inputTxt p100" id="orderDate"
                                                       name="orderDate" value={detailData.orderDate??"-"}
                                                       readOnly/></td>
                            </tr>
                            <tr>
                                <th scope="row">대여인 소속</th>
                                <td><input type="text" className="inputTxt p100" name="team" id="team" value={detailData.team??"-"}
                                           readOnly/></td>
                                <th scope="row">대여인</th>
                                <td><input type="text" className="inputTxt p100" name="name" id="name" value={detailData.name??"-"}
                                           readOnly/></td>
                            </tr>
                            <tr>
                                <th scope="row">대여장비</th>
                                <td colSpan="3"><input type="text" className="inputTxt p100" name="productName" value={detailData.productName??"-"}
                                                       id="productName"
                                                       readOnly/></td>
                            </tr>
                            <tr>
                                <th scope="row">제품상세번호</th>
                                <td colSpan="3"><input type="text" className="inputTxt p100"
                                                       name="productDetailCode" id="productDetailCode" value={detailData.productDetailCode??"-"}
                                                       readOnly/></td>
                            </tr>
                            <tr>
                                <th scope="row">대여시작일</th>
                                <td><input type="text" className="inputTxt p100" id="rentalDate" name="rentalDate" value={detailData.rentalDate??"-"}
                                           readOnly/></td>
                                <th scope="row">대여마감일</th>
                                <td><input type="text" className="inputTxt p100" id="returnDate" name="returnDate" value={detailData.returnDate??"-"}
                                           readOnly/></td>
                            </tr>
                            <tr>
                                <th scope="row">기타사항(메모,비고)</th>
                                <td colSpan="3"><input type="text" className="inputTxt p100" style={{height: "150px"}}
                                                       name="orderReason" id="orderReason" value={detailData.orderReason??"-"}
                                                       readOnly/></td>
                            </tr>
                            </tbody>
                        </table>

                        <div className="btn_areaC mt30">
                            <a href="" className="btnType blue" id="btnDelete" name="btn"
                               style={{display: sessionToUserTypeData.userType? "inline-block": "none", marginRight:"10px"}}><span>폐기</span></a>
                            <a href="" className="btnType gray" id="btnClose" name="btn"
                               onClick={closeModal}><span>닫기</span></a>
                        </div>
                    </dd>
                </dl>
            </div>
        </div>
    );
}

export default HistoryModal;