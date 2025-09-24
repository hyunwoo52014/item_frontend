import React, {useEffect, useState} from "react";
import axios from "axios";
import Modal from "react-modal";
import RemainingDataModal from "./RemainingDataModal";
import * as common from '../../components/common/commonfunction';

const CategoryModal = (props) => {

    const modalStyle = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            transform: "translate(-50%, -50%)",
            width: '50%'
        },
    };

    const [modalInfo, setModalInfo] = useState({
        isOpen: false,
        categoryCode: "",
        closeModal: props.closeModal,
    });

    const [detailInfo, setDetailInfo] = useState({
        categoryCode : "",
        categoryName : "",
        registerDate : "",
        categoryContent : "",
        beforeCategoryCode: "",
        beforeCategoryName: "",
    })

    const searchSelectedCategory = async (categoryCode) => {
        const param = {
            categoryCode: categoryCode
        }
        const urlParams = new URLSearchParams(param);

        await axios.post("/system/categories/searchSelectedCategory", urlParams)
            .then((res) => {
                console.log(res.data.selectedCategory);
                setDetailInfo((prev) => ({
                    ...prev,
                    ...res.data.selectedCategory,
                    registerDate: res.data.selectedCategory.registryDate,
                    categoryContent: res.data.selectedCategory.content
                }))
            }).catch((err) => {
                console.log(err.errorCode, err.errorMessage);
            })

    }

    const saveCategory = async () => {
        
        const nullFlag = common.nullcheck([
            {inval: detailInfo.categoryCode, msg : "category code 를 입력해주세요"},
            {inval: detailInfo.categoryName, msg : "category name 을 입력해주세요"},
        ]);
        if(!nullFlag) return;
        const duplicateResult = await duplicateCheck();

        if(duplicateResult === 'Y' && props.acion === 'I') {
            setDetailInfo((prev) => ({
                ...prev,
                categoryCode : "",
                categoryName : "",
                categoryContent : ""
            }))
            return;
        }

        if(duplicateResult === 'Y' && props.action === 'U') {
            setDetailInfo((prev) => ({
                ...prev,
            }))
            return;
        }

        if(duplicateResult === 'N') {
            alert("취소하셨습니다.");
            return;
        }
        if(duplicateResult === 'U') {
            setDetailInfo((prev) => ({
                ...prev
            }))
        }
        const urlParams = new URLSearchParams(Object.entries(detailInfo));
        urlParams.set("state", props.action);
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
            if(result.data.result === 'Y' && props.action === "I") {
                alert("카테고리 코드 및 카테코리 명이 중복됩니다. 다시 입력 바랍니다.");
                return 'Y';
            }
            const isSameCategoryCode = detailInfo.categoryCode === detailInfo.beforeCategoryCode;
            const isSameCategoryName = detailInfo.categoryName === detailInfo.beforeCategoryName;

            if(result.data.result === 'Y' && props.action === 'U' && (isSameCategoryCode && isSameCategoryName) ) {
                alert("카테고리명이과 카테고리 코드가 전과 동일합니다.");
                if(window.confirm("그래도 저장을 시도하시겠습니까!")) {
                    return 'U';
                } else {
                    return 'N';
                }
            }
            if(result.data.result === 'Y' && props.action === 'U' && (!isSameCategoryCode || !isSameCategoryName)) {
                alert("카테고리 코드 및 카테코리 명이 중복됩니다. 다시 입력 바랍니다.");
                return 'Y';
            }


        } catch(e) {
            console.log(e.errorCode, e.errorMessage);
        }
    }

    const deleteCategory = async () => {
        const param = {
            categoryCode: props.categoryCode
        }

        const urlParam = new URLSearchParams(Object.entries(param));

        await axios.post("/system/categories/deleteCategory", urlParam)
            .then((res) => {
                alert(res.data.resultMsg);
                if(res.data.result === "Y") {
                    props.closeModal();
                } else {
                    if (window.confirm("어떤 데이터가 남았는지 확인하시겠습니까?")) {
                        showRemainingDataModal();
                    } else {
                        props.closeModal();
                    }
                }

            }).catch((e) => {
                console.log(e.errorCode, e.errorMessage);
            })
    }

    const showRemainingDataModal = () => {
        setModalInfo((prev) => ({
            ...prev,
            isOpen: true,
            categoryCode: detailInfo.categoryCode
        }))
    }

    useEffect(() => {
        if(props.action === 'I') {
            setDetailInfo(() => ({
                categoryCode : "",
                categoryName : "",
                registerDate : (new Date()).toISOString().split('T')[0],
                categoryContent : "",
                beforeCategoryCode: "",
            }))
        }
        if(props.action === 'U') {
            setDetailInfo((prev) => ({
                ...prev,
                registerDate : (new Date()).toISOString().split('T')[0],
                beforeCategoryCode: props.categoryCode,
                beforeCategoryName: props.categoryName
            }))
            searchSelectedCategory(props.categoryCode);
        }
    }, []);


    return (
        <>
            <form action="" method="post" id="saveForm" name="saveForm">
                <div id="userform">
                    <p className="conTitle">
                        <span>{props.action === "I" ? "신규 등록" : "카테고리 관리"}</span>
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
                                            if(detailInfo.beforeCategoryCode === "") {
                                                setDetailInfo((prev) => ({
                                                    ...prev,
                                                    beforeCategoryCode: e.target.value,
                                                    categoryCode: e.target.value
                                                }))
                                            } else {
                                                setDetailInfo((prev) => ({
                                                    ...prev,
                                                    beforeCategoryCode: prev.categoryCode,
                                                    categoryCode: e.target.value
                                                }))
                                            }
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
                                        if(detailInfo.beforeCategoryName === "") {
                                            setDetailInfo((prev) => ({
                                                ...prev,
                                                beforeCategoryName: e.target.value,
                                                categoryName: e.target.value
                                            }))
                                        } else {
                                            setDetailInfo((prev) => ({
                                                ...prev,
                                                beforeCategoryName: prev.categoryName,
                                                categoryName: e.target.value
                                            }))
                                        }
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
                        {
                            props.action === 'I' && <>
                                <button type="button" className="btn btn-primary mx-2" onClick={saveCategory} >
                                    {" "}
                                    저장{" "}
                                </button>
                            </>
                        }
                        {
                            props.action === 'U' && <>
                                <button type="button" className="btn btn-primary mx-2" onClick={saveCategory} >
                                    {" "}
                                    수정{" "}
                                </button>
                                <button type="button" className="btn btn-primary mx-2" onClick={deleteCategory} >
                                    {" "}
                                    삭제{" "}
                                </button>
                            </>
                        }

                        <button className="btn btn-primary" onClick={props.closeModal}>
                            {" "}
                            닫기{" "}
                        </button>
                    </div>
                </div>
                <Modal
                    style={modalStyle}
                    isOpen={modalInfo.isOpen}
                    onRequestClose={modalInfo.closeModal}
                    ariaHideApp={false}
                >
                    <RemainingDataModal closeModal={modalInfo.closeModal} categoryCode={modalInfo.categoryCode}/>
                </Modal>
            </form>
        </>
    )
}

export default CategoryModal;