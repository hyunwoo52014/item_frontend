import React, {useContext} from "react";
import {HistoryModalContext} from "./History";
import customCss from "./css_custom/forHistory.css";

const HistoryBody = ({historyList}) => {

    const modalContext = useContext(HistoryModalContext);

    const checkStatus = (status) => {
        if (status === 'Y') {
            return "승인";
        } else if (status === 'N' || status === 'R') {
            return "반려";
        } else {
            return "오류";
        }
    }

    const modalOpen = (item) => {
        console.log("modal open")
        modalContext.isOpen = true;
        modalContext.payload = item;
        console.log(modalContext.isOpen, modalContext.payload);
    }

    if (!historyList || historyList.length === 0) {
        console.log("HistoryBody list : " , typeof historyList , historyList);
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
                    <tr key={index} data-product-no={item.productNo}
                        data-product-detail-code={item.productDetailCode}
                        className={"customCss.lineDraw"}
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