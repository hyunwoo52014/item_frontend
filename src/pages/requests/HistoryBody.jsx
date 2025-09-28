import React, {useState, useContext, useEffect} from "react";
import {HistoryModalContext} from "./History";
import axios from "axios";

const HistoryBody = ({historyList}) => {

    const {modalState,setModalState} = useContext(HistoryModalContext);

    const checkStatus = (status) => {
        if (status === 'Y') {
            return "승인";
        } else if (status === 'N' || status === 'R') {
            return "반려";
        } else {
            return "오류";
        }
    }

    const modalOpen = async (item) => {

        const payload = await getProductDetails(item);

        setModalState((prev)=>(
            {
                ...prev,
                isOpen: true,
                payload: payload,
            }
        ));
    }

    const getProductDetails = (item) => {

        const param = new URLSearchParams();
        param.append("productNo",item.productNo);
        param.append("productDetailCode",item.productDetailCode);


        return axios.post("/requests/detailHistory",param)
        .then((res) => {
            return res.data;
        }).catch((err) => {
            return null;
        });

    }


    if (!historyList || historyList.length === 0) {
        return (
            <tbody>
            <tr>
                <td colSpan="7" style={{textAlign: "center"}}>데이터가 존재하지 않습니다.</td>
            </tr>
            </tbody>
        );

    } else {
        return (
            <tbody>
            {
                historyList.map((item, index) => (
                    <tr key={index}
                        className={"customCss.lineDraw"}
                        data-product-no={item.productNo}
                        data-product-detail-code={item.productDetailCode}
                        onClick={()=>{modalOpen(item)}}>
                        <td>{item.team??"-"}</td>
                        <td>{item.name??"-"}</td>
                        <td>{item.productName??"-"}</td>
                        <td>{item.rentalDate??"-"}</td>
                        <td>{item.returnDate??"-"}</td>
                        <td>{checkStatus(item.status)??"-"}</td>
                    </tr>
                ))
            }
            </tbody>
        );

    }

}

export default HistoryBody;