import React, {useEffect, useState} from "react";
import axios from "axios";

const RemainingDataModal = (props) => {

    const [remainData, setRemainData] = useState({
        remainDataList: [],
        totalCount: 0,
    })

    const searchRemainData  = async () => {
        const param = {
            categoryCode: props.categoryCode
        }
        const urlParam = new URLSearchParams(Object.entries(param));

        await axios.post("/system/categories/searchRemainData", urlParam).then(res => {
            console.log(res);
           setRemainData(() => ({
               remainDataList: res.data.remainDataList,
               totalCount: res.data.totalCount
           }))

        }).catch(err => {
            console.log(err.errorCode, err.errorMessage);
        })
    }

    useEffect(() => {
        searchRemainData();
    }, [])

    return (
        <>
            <form action="" method="post" id="saveForm" name="saveForm">
                <div id="userform">
                    <p className="conTitle">
                        <span>{"잔여 카테고리 정보들"}</span>
                    </p>
                    <table style={{ width: "550px", height: "350px" }}>
                        <colgroup>
                            <col width="5%" />
                            <col width="35%" />
                            <col width="15%" />
                            <col width="35%" />
                            <col width="10%" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>제품 이름</th>
                                <th>카테고리코드</th>
                                <th>벤더명</th>
                                <th>총 개수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                remainData.totalCount > 0 ?
                                    remainData.remainDataList.map((data, index) => {
                                        return (
                                            <>
                                                <tr key={index}>
                                                    <td>{data.remainDataNum}</td>
                                                    <td>{data.productName}</td>
                                                    <td>{data.categoryCode}</td>
                                                    <td>{data.vendorName}</td>
                                                    <td>{data.quantity}</td>
                                                </tr>
                                            </>
                                        )
                                    })
                                    :
                                    <tr>
                                        <td colSpan="5">없습니다~~~</td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                    <div className="modal-button">
                        <button className="btn btn-primary" onClick={props.closeModal}>
                            {" "}
                            닫기{" "}
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default RemainingDataModal;