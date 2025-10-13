import {useEffect, useState} from "react";
import axios from "axios";
import React from 'react';

const InboundModal = (props) => {
    const [detail, setDetail] = useState({
        importDetail: {}
    });

    const [fieldVisibility, setFieldVisibility] = useState({
        category_name_show: false,
        category_sel_show: false,
        product_code_title_show: false,
        product_code_show: false,
        btnSave_show: false
    });

    const [fieldReadOnly, setFieldReadOnly] = useState({
        product_name: false,
        vendor_name: false,
        category_name: false,
        product_code: false,
        import_quantity: false,
        import_price: false,
        import_total_price: true,
        content_text: false,
        import_date: false,
        manager_name: false
    });

    const searchImportDetail = async () => {
        const param = new URLSearchParams();
        param.set("importId", props.importNumber);

        await axios.post("/asset/searchImportDetail", param)
            .then((res) => {
                console.log(res);
                setDetail((old) => ({
                    ...old,
                    importDetail: res.data.importDetail,
                }));
                // 상세보기 모드로 초기화
                initImportDetail(res.data.importDetail);
            })
            .catch((err) => {
                console.log(err.errorCode, err.errorMessage);
            });
    };

    const initImportDetail = (importDetail = null) => {
        if (importDetail === null || importDetail === undefined) {
            setDetail({
                importDetail: {
                    productName: '',
                    vendorName: '',
                    categoryName: '',
                    porductNo: '',
                    quantity: 0,
                    price: 0,
                    content: '',
                    importDate: new Date().toISOString().split('T')[0],
                    managerName: ''
                }
            });

            setFieldVisibility({
                category_name_show: false,
                category_sel_show: true,
                product_code_title_show: false,
                product_code_show: false,
                btnSave_show: true,
            });

            setFieldReadOnly({
                product_name: false,
                vendor_name: false,
                category_name: false,
                product_code: false,
                import_quantity: false,
                import_price: false,
                import_total_price: true,
                content_text: false,
                import_date: true,
                manager_name: false
            });

            loadCategories();

        } else {
            setFieldVisibility({
                category_name_show: true,
                category_sel_show: false,
                product_code_title_show: true,
                product_code_show: true,
                btnSave_show: false,
            });

            setFieldReadOnly({
                product_name: true,
                vendor_name: true,
                category_name: true,
                product_code: true,
                import_quantity: true,
                import_price: true,
                import_total_price: true,
                content_text: true,
                import_date: true,
                manager_name: true,
            });
        }
    };

    const saveImportDetail = async () => {
        if(!detail.importDetail.productName){
            alert("제품명을 입력하세요.");
            return;
        }
        if(!detail.importDetail.vendorName){
            alert("거래처를 입력하세요.");
            return;
        }
        if(!detail.importDetail.categoryCode){
            alert("카테고리를 선택하세요.");
            return;
        }
        if(!detail.importDetail.quantity || detail.importDetail.quantity <= 0){
            alert("입고량을 입력하세요.");
            return;
        }
        if(!detail.importDetail.price || detail.importDetail.price <= 0){
            alert("입고단가를 입력하세요.");
            return;
        }
        if(!detail.importDetail.managerName){
            alert("담당자를 입력하세요.");
            return;
        }

        const param = new URLSearchParams();
        param.set("product_name", detail.importDetail.productName);
        param.set("vendor_name", detail.importDetail.vendorName);
        param.set("category_sel", detail.importDetail.categoryCode);
        param.set("import_quantity", String(detail.importDetail.quantity));
        param.set("import_price", String(detail.importDetail.price));
        param.set("content_text", detail.importDetail.content || '');
        param.set("import_date", detail.importDetail.importDate);
        param.set("manager_name", detail.importDetail.managerName);
        console.log(param.toString());
        await axios.post("/asset/registerImportDetail", param)

            .then((res) => {
                console.log(res);
                if (res.data.result === "SUCCESS") {
                    alert(res.data.resultMsg);
                    props.closeModal("Y");
                } else {
                    alert(res.data.resultMsg);
                }
            })
            .catch((err) => {
                console.error(err);
                alert("저장 중 오류가 발생했습니다.");
            });
    };

    const [categoryList, setCategoryList] = useState([]);

    const loadCategories = () => {
        const param = new URLSearchParams();
        param.set("groupcode", "equip");
        param.set("cpage", "1");
        param.set("pagesize", "100");

        axios.post("/system/listdetailcode", param)
            .then((res) => {
                console.log("카테고리 응답:", res.data);
                if (res.data.result === "Y") {
                    setCategoryList(res.data.commcodeModel || []);
                }
            })
            .catch((err) => {
                console.log("카테고리 로드 실패:", err);
                console.log("응답 데이터:", err.response?.data);
            });
    };

    const calculateTotalPrice = () => {
        const quantity = parseFloat(detail.importDetail.quantity) || 0;
        const price = parseFloat(detail.importDetail.price) || 0;
        const total = quantity * price;

        setDetail(prev => ({
            ...prev,
            importDetail: {
                ...prev.importDetail,
                totalPrice: total
            }
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        const fieldMapping = {
            'product_name': 'productName',
            'vendor_name': 'vendorName',
            'category_name': 'categoryName',
            'product_code': 'porductNo',
            'import_quantity': 'quantity',
            'import_price': 'price',
            'content_text': 'content',
            'import_date': 'importDate',
            'manager_name': 'managerName'
        };

        const fieldName = fieldMapping[name] || name;

        setDetail(prev => ({
            ...prev,
            importDetail: {
                ...prev.importDetail,
                [fieldName]: value
            }
        }));

        let finalValue = value;
        if (name === 'import_quantity' || name === 'import_price') {
            finalValue = value === '' ? 0 : parseFloat(value) || 0;
        }
    };

    useEffect(() => {
        if (props.action === "detail") {
            searchImportDetail();
        } else if (props.action === "new") {
            initImportDetail();
        }
    }, [props.action]);

    return (
        <div>
            <div id="inboundForm">
                <dt>
                    {props.action === "detail" ? (
                        <strong>상세 입고 내역</strong>
                    ) : (
                        <strong>신규 입고 등록</strong>
                    )}
                </dt>
                <table>
                    <colgroup>
                        <col width="120px"/>
                        <col width="*"/>
                        <col width="120px"/>
                        <col width="*"/>
                    </colgroup>
                    <tbody>
                    <tr>
                        <th scope="row">제품명 <span className="font_red">*</span></th>
                        <td>
                            <input
                                type="text"
                                className="inputTxt p100"
                                name="product_name"
                                id="product_name"
                                value={detail.importDetail.productName || ''}
                                readOnly={fieldReadOnly.product_name}
                                onChange={handleInputChange}
                            />
                        </td>
                        <th scope="row">거래처 <span className="font_red">*</span></th>
                        <td>
                            <input
                                type="text"
                                className="inputTxt p100"
                                name="vendor_name"
                                id="vendor_name"
                                value={detail.importDetail.vendorName || ''}
                                readOnly={fieldReadOnly.vendor_name}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">카테고리 <span className="font_red">*</span></th>
                        <td>
                            {fieldVisibility.category_name_show && (
                                <input
                                    type="text"
                                    className="inputTxt p100"
                                    name="category_name"
                                    id="category_name"
                                    value={detail.importDetail.categoryName || ''}
                                    readOnly={fieldReadOnly.category_name}
                                    onChange={handleInputChange}
                                />
                            )}
                            {fieldVisibility.category_sel_show && (
                                <select
                                    id="category_sel"
                                    name="category_sel"
                                    className="inputTxt p100"
                                    value={detail.importDetail.categoryCode || ''}
                                    onChange={(e) => {
                                        setDetail(prev => ({
                                            ...prev,
                                            importDetail: {
                                                ...prev.importDetail,
                                                categoryCode: e.target.value
                                            }
                                        }));
                                    }}
                                >
                                    <option value="">카테고리를 선택하세요</option>
                                    {categoryList.map((category) => (
                                        <option key={category.detail_code} value={category.detail_code}>
                                            {category.detail_name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </td>
                        {fieldVisibility.product_code_title_show && (
                            <th scope="row" id="product_code_title">제품 코드 <span className="font_red">*</span></th>
                        )}
                        {fieldVisibility.product_code_show && (
                            <td>
                                <input
                                    type="text"
                                    className="inputTxt p100"
                                    name="product_code"
                                    id="product_code"
                                    value={detail.importDetail.porductNo || ''}
                                    readOnly={fieldReadOnly.product_code}
                                    onChange={handleInputChange}
                                />
                            </td>
                        )}
                    </tr>

                    <tr>
                        <th scope="row">입고량 <span className="font_red">*</span></th>
                        <td>
                            <input
                                type="text"
                                className="inputTxt p100"
                                name="import_quantity"
                                id="import_quantity"
                                value={detail.importDetail.quantity || ''}
                                readOnly={fieldReadOnly.import_quantity}
                                onChange={handleInputChange}
                            />
                        </td>
                        <th scope="row">입고단가 <span className="font_red">*</span></th>
                        <td>
                            <input
                                type="text"
                                className="inputTxt p100"
                                name="import_price"
                                id="import_price"
                                value={detail.importDetail.price || ''}
                                readOnly={fieldReadOnly.import_price}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">총 입고 금액 <span className="font_red">*</span></th>
                        <td colSpan="3">
                            <input
                                type="text"
                                className="inputTxt p100"
                                name="import_total_price"
                                id="import_total_price"
                                value={(detail.importDetail.quantity || 0) * (detail.importDetail.price || 0)}
                                readOnly={fieldReadOnly.import_total_price}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">비고</th>
                        <td colSpan="3">
                            <input
                                type="text"
                                className="inputTxt p100"
                                name="content_text"
                                id="content_text"
                                value={detail.importDetail.content || ''}
                                readOnly={fieldReadOnly.content_text}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">입고일자 <span className="font_red">*</span></th>
                        <td>
                            <input
                                type="date"
                                className="inputTxt p100"
                                name="import_date"
                                id="import_date"
                                value={detail.importDetail.importDate || ''}
                                readOnly={fieldReadOnly.import_date}
                                onChange={handleInputChange}
                            />
                        </td>
                        <th scope="row">담당자<span className="font_red">*</span></th>
                        <td>
                            <input
                                type="text"
                                className="inputTxt p100"
                                name="manager_name"
                                id="manager_name"
                                value={detail.importDetail.managerName || ''}
                                readOnly={fieldReadOnly.manager_name}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className="btn_areaC mt30">
                    {fieldVisibility.btnSave_show && (
                        <a href="#" className="btnType blue" id="btnSave" name="btn"
                           onClick={(e) => {
                               e.preventDefault();
                               saveImportDetail();
                           }}>
                            <span>저장</span>
                        </a>
                    )}
                    <a href="#" className="btnType gray" id="btnClose" name="btn"
                       onClick={(e) => {
                           e.preventDefault();
                           props.closeModal("N");
                       }}>
                        <span>{fieldVisibility.btnSave_show ? "취소" : "닫기"}</span>
                    </a>
                </div>
            </div>
        </div>
    );
};


export default InboundModal;