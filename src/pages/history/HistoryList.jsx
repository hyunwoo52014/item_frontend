import React from "react";

const HistoryList = (props) => {

    const checkStatus = (status) => {
        if ('Y'.equals(status)) {
            return "승인";
        } else if ('N'.equals(status) || 'R'.equals(status)) {
            return "반려";
        } else {
            return "오류";
        }
    }

    if (props.historyCnt === 0) {
        return (
            <tr>
                <td colSpan="7" style={{textAlign: "center"}}>데이터가 존재하지 않습니다.</td>
            </tr>
        );

    } else {
        props.historyList.map((item, index) => {
            return (
                <tr key={index} data-product-no={item.productNo}
                    data-product-detail-code={item.productDetailCode}
                    style={{cursor: "pointer"}}>
                    <td>{item.team}</td>
                    <td>{item.name}</td>
                    <td>{item.productName}</td>
                    <td>{item.rentalDate}</td>
                    <td>{item.returnDate}</td>
                    <td>{checkStatus(item.status)}</td>
                </tr>
            )
        })


    }
}

export default HistoryList;