import React from 'react';
import './ReturnsTable.css';

export const ReturnsTable = ({list, onItemDtl}) => {

    // 상태 코드에 따른 표시 텍스트와 클래스를 결정하는 헬퍼 함수
    const getStatusInfo = (productState) => {
        const state = productState || '';

        switch (state) {
            case 'Y':
                return { label: '사용중', className: 'blue' };
            case 'O':
                return { label: '사용신청중', className: 'green' };
            case 'R':
                return { label: '반납신청중', className: 'orange' };
            default:
                return { label: '알수없음', className: 'gray' };
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
                    const displayIndex = item.rn !== undefined ? item.rn : index + 1;
                    const statusInfo = getStatusInfo(item.product_state);

                    return (
                        <tr key={`${item.product_detail_code}-${item.category_code}`}>
                            <td>{displayIndex}</td>
                            <td>{item.product_name}</td>
                            <td>{item.category_name}</td>
                            <td>
                                {/* 상태값만 출력, 클릭 시 모달 오픈 */}
                                <a
                                    href="#"
                                    className={`btnCustom ${statusInfo.className}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onItemDtl(item); // 모달 열기
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
                    <td colSpan="4" style={{ textAlign: 'center' }}>
                        사용중인 장비가 존재하지 않습니다.
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    );
}

export default ReturnsTable;