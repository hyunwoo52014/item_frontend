import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApplyPopup = (props) => {
    const { action, applyInfo, closeModal } = props;

    const [formData, setFormData] = useState({
        product_name: '',
        product_detail_code: '',
        loginID: '',
        name: '',
        order_date: '',
        rental_date: '',
        order_reason: '',
        category_name: ''
    });

    const [loading, setLoading] = useState(false);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(''); // 선택된 카테고리

    // 컴포넌트 마운트 시 데이터 초기화
    useEffect(() => {
        initializeData();
        // 신규 신청인 경우 카테고리와 사용 가능한 장비 목록 조회
        if (action === 'APPLY' && !applyInfo?.product_detail_code) {
            fetchCategories();
            fetchAvailableProducts();
        }
        // 실제 사용자 정보 확인
        checkRealUser();
    }, [action, applyInfo]);

    const initializeData = async () => {
        try {
            // 사용자 정보 가져오기 (세션/쿠키에서)
            const userInfo = getUserInfo();

            // 현재 날짜
            const today = new Date().toISOString().split('T')[0];

            // 기본 폼 데이터 설정
            const baseData = {
                product_name: applyInfo?.product_name || '',
                product_detail_code: applyInfo?.product_detail_code || '',
                category_name: applyInfo?.category_name || '',
                loginID: userInfo.loginID || '',
                name: userInfo.name || '',
                order_date: today,
                rental_date: today,
                order_reason: ''
            };

            setFormData(baseData);

            // 디버깅: 실제 로드된 사용자 정보 확인
            console.log('로드된 사용자 정보:', userInfo);
            console.log('설정된 formData:', baseData);

            // 사용중/반납신청 상태인 경우 상세 정보 조회
            if ((action === 'RETURN' || action === 'CANCEL_RETURN') && applyInfo?.product_detail_code) {
                await fetchDetailInfo(applyInfo.product_detail_code);
            }
        } catch (error) {
            console.error('데이터 초기화 오류:', error);
        }
    };

    // 사용자 정보 가져오기 (실제 로그인 세션에서)
    const getUserInfo = () => {
        try {
            // 1. Login.jsx에서 설정한 개별 sessionStorage 확인 (우선순위)
            const loginId = sessionStorage.getItem('loginId');
            const userNm = sessionStorage.getItem('userNm');

            if (loginId && userNm) {
                console.log('개별 sessionStorage에서 사용자 정보 로드:', { loginId, userNm });
                return {
                    loginID: loginId,
                    name: userNm
                };
            }

            // 2. Login.jsx에서 설정한 loginInfo JSON 확인
            const loginInfo = sessionStorage.getItem('loginInfo');
            if (loginInfo) {
                const userInfo = JSON.parse(loginInfo);
                if (userInfo.loginId && userInfo.userNm) {
                    console.log('loginInfo에서 사용자 정보 로드:', userInfo);
                    return {
                        loginID: userInfo.loginId,
                        name: userInfo.userNm
                    };
                }
            }

            // 3. 기존 방식들 (호환성)
            const sessionUser = sessionStorage.getItem('userInfo');
            if (sessionUser) {
                const userInfo = JSON.parse(sessionUser);
                if (userInfo.loginID && userInfo.name) {
                    return userInfo;
                }
            }

            // 4. 백업용 하드코딩 (개발/테스트용)
            console.warn('사용자 정보를 찾을 수 없어 기본값을 사용합니다.');
            console.warn('sessionStorage 내용 확인:', {
                loginId: sessionStorage.getItem('loginId'),
                userNm: sessionStorage.getItem('userNm'),
                loginInfo: sessionStorage.getItem('loginInfo')
            });
            return {
                loginID: 'admin',
                name: '관리자'
            };
        } catch (error) {
            console.error('사용자 정보 로딩 오류:', error);
            return {
                loginID: 'admin',
                name: '관리자'
            };
        }
    };

    // 장비 상세 정보 조회
    const fetchDetailInfo = async (productDetailCode) => {
        try {
            const response = await axios.get('http://localhost:80/api/requests/detailApply', {
                params: { product_detail_code: productDetailCode }
            });

            if (response.data) {
                setFormData(prev => ({
                    ...prev,
                    ...response.data
                }));
            }
        } catch (error) {
            console.error('상세 정보 조회 오류:', error);
        }
    };

    // 카테고리 목록 조회
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:80/api/requests/categories');
            if (response.data) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('카테고리 목록 조회 오류:', error);
        }
    };

    // 사용 가능한 장비 목록 조회 (카테고리별 필터링 포함)
    const fetchAvailableProducts = async (categoryFilter = '') => {
        try {
            // 사용자 정보 가져오기 (권한 확인용)
            const userInfo = getUserInfo();

            const params = {
                currentPage: 1,
                pageSize: 100,
                searchsel: 'product_state',
                searchword: 'N', // 미사용 상태의 장비만
                userLoginId: userInfo.loginID, // 사용자 권한 확인용
                userType: userInfo.userType    // 사용자 타입 확인용
            };

            // 카테고리 필터가 있는 경우 추가
            if (categoryFilter) {
                params.searchsel = 'category_code';  // 카테고리 코드로 정확히 매칭
                params.searchword = categoryFilter;
                // 미사용 상태 조건을 추가로 처리하기 위해 별도 파라미터 사용
                params.filterState = 'N';
            }

            console.log('=== ApplyPopup 장비 조회 파라미터 ===');
            console.log('categoryFilter:', categoryFilter);
            console.log('params:', params);

            const response = await axios.get('http://localhost:80/api/requests/applyData', {
                params
            });

            console.log('=== ApplyPopup 장비 조회 응답 ===');
            console.log('response.data:', response.data);

            if (response.data?.datalist) {
                // 미사용(N) 상태인 장비만 필터링 (백엔드에서 처리되지만 추가 안전장치)
                let filteredProducts = response.data.datalist.filter(product => product.product_state === 'N');

                // 중복 제거 (product_detail_code 기준)
                const uniqueProducts = [];
                const seenCodes = new Set();

                filteredProducts.forEach(product => {
                    if (!seenCodes.has(product.product_detail_code)) {
                        seenCodes.add(product.product_detail_code);
                        uniqueProducts.push(product);
                    }
                });

                console.log('필터링된 미사용 장비:', uniqueProducts);
                setAvailableProducts(uniqueProducts);
            } else {
                console.warn('응답 데이터에 datalist가 없습니다.');
                setAvailableProducts([]);
            }
        } catch (error) {
            console.error('사용 가능한 장비 목록 조회 오류:', error);
            setAvailableProducts([]);
        }
    };

    // 실제 존재하는 사용자 확인
    const checkRealUser = async () => {
        try {
            // 사용중인 장비의 상세 정보를 조회하여 실제 사용자 확인
            const response = await axios.get('http://localhost:80/api/requests/detailApply', {
                params: { product_detail_code: 155 } // 로그에서 확인된 사용중인 장비
            });

            if (response.data && response.data.name) {
                console.log('실제 존재하는 사용자 정보:', {
                    name: response.data.name,
                    // loginID는 응답에 포함되어 있을 수 있음
                });
            }
        } catch (error) {
            console.log('사용자 정보 확인 오류 (무시 가능):', error.message);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // 카테고리 선택 시 장비 목록 갱신
    const handleCategorySelect = (categoryCode) => {
        setSelectedCategory(categoryCode);
        // 선택된 카테고리에 따라 장비 목록 갱신
        fetchAvailableProducts(categoryCode);
        // 기존 선택된 장비 초기화
        setFormData(prev => ({
            ...prev,
            product_detail_code: '',
            product_name: '',
            category_name: ''
        }));
    };

    // 장비 선택 시 관련 정보 자동 설정
    const handleProductSelect = (productDetailCode) => {
        const selectedProduct = availableProducts.find(p => p.product_detail_code == productDetailCode);
        if (selectedProduct) {
            setFormData(prev => ({
                ...prev,
                product_detail_code: selectedProduct.product_detail_code,
                product_name: selectedProduct.product_name,
                category_name: selectedProduct.category_name
            }));
        }
    };

    const handleSubmit = async () => {
        if (loading) return;

        // 필수 필드 검증
        if (action === 'APPLY' && !formData.product_detail_code) {
            alert('장비를 선택해주세요.');
            return;
        }

        if (!formData.order_reason?.trim()) {
            const reasonText = action === 'RETURN' ? '반납사유' :
                              action === 'CANCEL_APPLY' || action === 'CANCEL_RETURN' ? '취소사유' : '신청사유';
            alert(`${reasonText}를 입력해주세요.`);
            return;
        }

        setLoading(true);
        try {
            let apiUrl = '';
            let successMessage = '';

            switch (action) {
                case 'APPLY':
                    apiUrl = 'http://localhost:80/api/requests/applyReq';
                    successMessage = '사용신청이 완료되었습니다.';
                    break;
                case 'RETURN':
                    apiUrl = 'http://localhost:80/api/requests/applyReturn';
                    successMessage = '반납신청이 완료되었습니다.';
                    break;
                case 'CANCEL_APPLY':
                case 'CANCEL_RETURN':
                    apiUrl = 'http://localhost:80/api/requests/applyCancel';
                    successMessage = '신청이 취소되었습니다.';
                    break;
                default:
                    throw new Error('알 수 없는 액션입니다.');
            }

            // Spring Controller @RequestParam에 맞게 URLSearchParams로 전송
            const params = new URLSearchParams();
            params.append('product_detail_code', formData.product_detail_code);
            params.append('loginID', formData.loginID);
            params.append('order_reason', formData.order_reason);
            params.append('order_date', formData.order_date);
            params.append('rental_date', formData.rental_date);

            console.log('API 전송 데이터:', Object.fromEntries(params));

            const response = await axios.post(apiUrl, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            console.log('API 응답:', response.data);

            if (response.data.result === 'SUCCESS') {
                alert(successMessage);
                closeModal();
            } else {
                alert(response.data.resultMsg || '처리 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('제출 오류:', error);
            console.error('오류 상세:', error.response?.data);
            alert('처리 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (closeModal) {
            closeModal();
        }
    };

    // 액션별 제목과 버튼 텍스트 결정
    const getPopupInfo = () => {
        switch (action) {
            case 'APPLY':
                return {
                    title: 'IT 자산 사용신청',
                    buttonText: '사용신청',
                    buttonClass: 'btn btn-primary'
                };
            case 'RETURN':
                return {
                    title: 'IT 자산 반납신청',
                    buttonText: '반납신청',
                    buttonClass: 'btn btn-danger'
                };
            case 'CANCEL_APPLY':
                return {
                    title: '사용신청 취소',
                    buttonText: '신청취소',
                    buttonClass: 'btn btn-warning'
                };
            case 'CANCEL_RETURN':
                return {
                    title: '반납신청 취소',
                    buttonText: '반납취소',
                    buttonClass: 'btn btn-info'
                };
            default:
                return {
                    title: 'IT 자산 관리',
                    buttonText: '확인',
                    buttonClass: 'btn btn-primary'
                };
        }
    };

    const popupInfo = getPopupInfo();

    return (
        <div>
            <form action="" method="post" id="saveForm" name="saveForm">
                <div id="itAssetForm">
                    <p className="conTitle">
                        <span>{popupInfo.title}</span>
                    </p>
                    <table style={{ width: "550px", height: "350px" }}>
                        <colgroup>
                            <col width="15%" />
                            <col width="35%" />
                            <col width="15%" />
                            <col width="35%" />
                        </colgroup>
                        <tbody>
                        {/* 신규 신청인 경우 카테고리와 장비 선택 드롭다운 표시 */}
                        {action === 'APPLY' && !applyInfo?.product_detail_code ? (
                            <>
                                <tr>
                                    <th>
                                        카테고리
                                    </th>
                                    <td colSpan="3">
                                        <select
                                            className="form-control input-sm"
                                            value={selectedCategory}
                                            onChange={(e) => handleCategorySelect(e.target.value)}
                                        >
                                            <option value="">전체 카테고리</option>
                                            {categories.map((category) => (
                                                <option key={category.category_code} value={category.category_code}>
                                                    {category.category_name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        장비선택 <span className="font_red">*</span>
                                    </th>
                                    <td colSpan="3">
                                        <select
                                            className="form-control input-sm"
                                            value={formData.product_detail_code || ''}
                                            onChange={(e) => handleProductSelect(e.target.value)}
                                        >
                                            <option value="">
                                                {availableProducts.length > 0
                                                    ? "장비를 선택하세요"
                                                    : selectedCategory
                                                        ? "선택한 카테고리에 미사용 장비가 없습니다"
                                                        : "미사용 장비가 없습니다"}
                                            </option>
                                            {availableProducts.map((product, index) => (
                                                <option key={`${product.product_detail_code}-${product.category_code}-${index}`} value={product.product_detail_code}>
                                                    [{product.category_name}] {product.product_name} (코드: {product.product_detail_code})
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            </>
                        ) : (
                            <tr>
                                <th>
                                    장비명 <span className="font_red">*</span>
                                </th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control input-sm"
                                        id="product_name"
                                        name="product_name"
                                        value={formData.product_name}
                                        readOnly // 장비명은 선택된 데이터로 자동 채움
                                        style={{ backgroundColor: '#f5f5f5' }}
                                    />
                                </td>
                                <th>
                                    장비코드 <span className="font_red">*</span>
                                </th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control input-sm"
                                        id="product_detail_code"
                                        name="product_detail_code"
                                        value={formData.product_detail_code}
                                        readOnly // 장비코드는 선택된 데이터로 자동 채움
                                        style={{ backgroundColor: '#f5f5f5' }}
                                    />
                                </td>
                            </tr>
                        )}
                        <tr>
                            <th>
                                카테고리
                            </th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    id="category_name"
                                    name="category_name"
                                    value={formData.category_name}
                                    readOnly
                                    style={{ backgroundColor: '#f5f5f5' }}
                                />
                            </td>
                            <th>
                                사용자 <span className="font_red">*</span>
                            </th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    readOnly // 사용자는 세션에서 자동 채움
                                    style={{ backgroundColor: '#f5f5f5' }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                사용신청일
                            </th>
                            <td>
                                <input
                                    type="date"
                                    className="form-control input-sm"
                                    id="order_date"
                                    name="order_date"
                                    value={formData.order_date}
                                    onChange={(e) => handleInputChange('order_date', e.target.value)}
                                    readOnly={action !== 'APPLY'} // 신청 시에만 수정 가능
                                    style={{ backgroundColor: action !== 'APPLY' ? '#f5f5f5' : 'white' }}
                                />
                            </td>
                            <th>
                                {action === 'RETURN' || action === 'CANCEL_RETURN' ? '사용시작일' : '예상시작일'}
                            </th>
                            <td>
                                <input
                                    type="date"
                                    className="form-control input-sm"
                                    id="rental_date"
                                    name="rental_date"
                                    value={formData.rental_date}
                                    onChange={(e) => handleInputChange('rental_date', e.target.value)}
                                    readOnly={action === 'RETURN' || action === 'CANCEL_RETURN'} // 반납 관련에서는 읽기전용
                                    style={{ backgroundColor: (action === 'RETURN' || action === 'CANCEL_RETURN') ? '#f5f5f5' : 'white' }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                {action === 'RETURN' ? '반납사유' : action === 'CANCEL_APPLY' || action === 'CANCEL_RETURN' ? '취소사유' : '신청사유'} <span className="font_red">*</span>
                            </th>
                            <td colSpan="3">
                                <textarea
                                    className="form-control input-sm"
                                    id="order_reason"
                                    name="order_reason"
                                    rows={4}
                                    value={formData.order_reason}
                                    onChange={(e) => handleInputChange('order_reason', e.target.value)}
                                    placeholder={
                                        action === 'RETURN' ? '반납 사유를 입력하세요' :
                                        action === 'CANCEL_APPLY' || action === 'CANCEL_RETURN' ? '취소 사유를 입력하세요' :
                                        '신청 사유를 입력하세요'
                                    }
                                    style={{ resize: 'none' }}
                                    readOnly={action === 'CANCEL_APPLY' || action === 'CANCEL_RETURN'} // 취소 시에는 기존 사유 표시만
                                />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div className="modal-button">
                        <button
                            className={`${popupInfo.buttonClass} mx-2`}
                            onClick={handleSubmit}
                            type="button"
                            disabled={loading}
                        >
                            {loading ? '처리중...' : popupInfo.buttonText}
                        </button>
                        <button className="btn btn-secondary" onClick={handleClose} type="button">
                            닫기
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );

}
export default ApplyPopup;