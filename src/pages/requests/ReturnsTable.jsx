import React from 'react';

export const ReturnsTable = ({list, onItemDtl}) => {

    // 상태 코드에 따른 표시 텍스트와 클래스를 결정하는 헬퍼 함수
    const getStatusInfo = (productState) => {
        const state = productState || ''; // null/undefined 시 빈 문자열로 처리

        switch (state) {
            case 'Y':
                return { label: '사용중', className: 'btnType blue' };
            case 'R':
                return { label: '반납신청중', className: 'btnType blue' };
            case 'C': // '사용신청중' 코드가 'C'로 가정
                return { label: '사용신청중', className: 'btnType blue' };
            case '': //
            case '':
            default:
                // 장비 목록은 사용자가 '사용중'인 장비 목록이므로, 알 수 없는 상태는 '사용중'으로 표시.
                return { label: '사용중', className: 'btnType blue' };
        }
    };

    return (
        <table className="col">
            <thead>
            <tr>
                <th scope="col">번호</th>
                <th scope="col">장비명</th>
                <th scope="col">장비 카테고리</th>
                <th scope="col">상태</th>
            </tr>
            </thead>
            <tbody>
            {list && list.length > 0 ? (
                list.map((item, index) => {
                    // 번호(rn) 필드가 있다면 사용하고, 없다면 index + 1을 사용.
                    const displayIndex = item.rn !== undefined ? item.rn : index + 1;
                    const statusInfo = getStatusInfo(item.product_state);

                    return (
                        // product_detail_code만 쓰지 말고, category_code까지 조합해서 고유하게 만듦.
                        <tr key={`${item.product_detail_code}-${item.category_code}`}>
                        <td>{displayIndex}</td>
                            <td>{item.product_name}</td>
                            <td>{item.category_name}</td>
                            <td>
                                <a
                                    className={statusInfo.className}
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onItemDtl(item);
                                    }}
                                >
                                    <span>{statusInfo.label}</span>
                                </a>
                            </td>
                        </tr>
                    );
                })
            ) : (
                <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>사용중인 장비가 존재하지 않습니다.</td>
                </tr>
            )}
            </tbody>
        </table>
    );
}

export default ReturnsTable;