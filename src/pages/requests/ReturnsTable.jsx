import React from 'react';

export const ReturnsTable = ({list, onReturnDtl, onCancelDtl}) => {
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
                list.map((item, index) => (
                    <tr key={`${item.product_detail_code}-${index}`}>
                        <td>{index + 1}</td>
                        <td>{item.product_name}</td>
                        <td>{item.category_name}</td>
                        <td>
                            {(() => {
                                switch (item.product_state) { // 백엔드 모델과 일치하는 속성명으로 수정
                                    case 'Y':
                                        return ( // 괄호 추가
                                            <a
                                                className="btnType blue"
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    onReturnDtl(item.product_detail_code, item.category_code);
                                                }}
                                            >
                                                <span>사용중</span>
                                            </a>
                                        );
                                    case 'O':
                                        return (
                                            <a
                                                className="btnType blue"
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    onCancelDtl(item.product_detail_code, item.category_code);
                                                }}
                                            >
                                                <span>사용신청중</span>
                                            </a>
                                        );
                                    case 'R':
                                        return (
                                            <a
                                                className="btnType blue"
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    onCancelDtl(item.product_detail_code, item.category_code);
                                                }}
                                            >
                                                <span>반납신청중</span>
                                            </a>
                                        );
                                    default:
                                        return null;
                                }
                            })()}
                        </td>
                    </tr>
                ))
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