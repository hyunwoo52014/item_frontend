import React from 'react';

const RentalList = ({ rentalList, rentalListCnt, pageSize, currentPage }) => {
    return (
        <>
            {/* 갯수가 0인 경우 */}
            {rentalListCnt === 0 && (
                <tr>
                    <td colSpan="5">데이터가 존재하지 않습니다.</td>
                </tr>
            )}

            {/* 갯수가 있는 경우 */}
            {rentalListCnt > 0 && (
                <>
                    {rentalList.map((list, index) => {
                        const nRow = pageSize * (currentPage - 1) + index;
                        return (
                            <tr key={`${list.category_code}-${list.product_detail_code}-${index}`}>
                                <td>{list.category_code} - {list.product_detail_code}</td>
                                <td>{list.category_name} - {list.product_name}</td>
                                <td>{list.team}</td>
                                <td>{list.detail_name}</td>
                                <td>{list.name}</td>
                            </tr>
                        );
                    })}
                </>
            )}

            {/* Hidden input for rentalListCnt */}
            <input
                type="hidden"
                id="rentalListCnt"
                name="rentalListCnt"
                value={rentalListCnt}
            />
        </>
    );
};

export default RentalList;