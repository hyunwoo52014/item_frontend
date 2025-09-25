import {useEffect, useState} from "react";
import axios from "axios";

const CategoryRegisterModal = (props) => {

    const [detailInfo, setDetailInfo] = useState({
        categoryCode : "",
        categoryName : "",
        registerDate : "",
        categoryContent : ""
    })

    const saveCategory = async () => {
        const duplicateResult = await duplicateCheck();
        console.log(duplicateResult);
        if(duplicateResult === 'Y') {
            setDetailInfo((prev) => ({
                ...prev,
                categoryCode : "",
                categoryName : "",
                categoryContent : ""
            }))
            return;
        }
        const urlParams = new URLSearchParams(Object.entries(detailInfo));

        const result = await axios.post("/system/categories/saveCategory", urlParams);
        try {
            alert(result.data.resultMsg);
            props.closeModal();
        } catch(e) {
            console.log(e.errorCode, e.errorMessage);
        }
    }

    const duplicateCheck = async () => {
        const params = {
            categoryCode: detailInfo.categoryCode,
            categoryName: detailInfo.categoryName
        }

        const urlParams = new URLSearchParams(Object.entries(params));

        const result = await axios.post("/system/categories/duplicateCheck", urlParams);

        try {
            console.log(result);
            if(result.data.result === 'Y') {
                alert("카테고리 코드 및 카테코리 명이 중복됩니다. 다시 입력 바랍니다.");
                return 'Y';
            }
        } catch(e) {
            console.log(e.errorCode, e.errorMessage);
        }
    }

    useEffect(() => {
        setDetailInfo(() => ({
            categoryCode : "",
            categoryName : "",
            registerDate : (new Date()).toISOString().split('T')[0],
            categoryContent : ""
        }))
    }, []);


    return (
        <>
            <form action="" method="post" id="saveForm" name="saveForm">
                <div id="userform">
                    <p className="conTitle">
                        <span>{props.action === "I" ? "신규 등록" : "카테고리 확인"}</span>
                    </p>
                    <table style={{ width: "550px", height: "350px" }}>
                        <colgroup>
                            <col width="50%" />
                            <col width="50%" />
                        </colgroup>
                        <tbody>
                            <tr>
                                <th>카테고리 코드<span className="font_red">*</span></th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control input-sm"
                                        id="category_code"
                                        name="category_code"
                                        value={detailInfo.categoryCode}
                                        onChange={(e) => {
                                            setDetailInfo((prev) => ({
                                                ...prev,
                                                categoryCode: e.target.value
                                            }))
                                        }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>카테고리명<span className="font_red">*</span></th>
                                <td>
                                    <input
                                    type="text"
                                    className="form-control input-sm"
                                    id="category_name"
                                    name="category_name"
                                    value={detailInfo.categoryName}
                                    onChange={(e) => {
                                        setDetailInfo((prev) => ({
                                            ...prev,
                                            categoryName: e.target.value
                                        }))
                                    }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>등록일<span className="font_red">*</span></th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control input-sm"
                                        id="register_date"
                                        name="register_date"
                                        value={detailInfo.registerDate}
                                        readOnly
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>비고</th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control input-sm"
                                        id="category_content"
                                        name="category_content"
                                        value={detailInfo.categoryContent}
                                        onChange={(e) => {
                                            setDetailInfo((prev) => ({
                                                ...prev,
                                                categoryContent: e.target.value
                                            }))
                                        }}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="modal-button">

                        <button type="button" className="btn btn-primary mx-2" onClick={saveCategory} >
                            {" "}
                            저장{" "}
                        </button>
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

export default CategoryRegisterModal;