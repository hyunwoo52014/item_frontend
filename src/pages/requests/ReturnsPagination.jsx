import React from "react";
//import Pagination from '../../components/common/Pagination.jsx';
import './ReturnsPagination.css';

const ReturnsPagination = (props) => {

    // props 구조 분해
    const { currentPage, totalPages, onPageChange } = props;

    console.log('Rendering ReturnsPagination', { currentPage, totalPages });

    if (!totalPages || totalPages < 1) return null; // 페이지가 없으면 렌더링 안함

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <div className="returns-pagination">
            <button className="arrow" onClick={handlePrev} disabled={currentPage === 1}>
                &lt;
            </button>

            {pageNumbers.map(page => (
                <button
                    key={page}
                    className={currentPage === page ? 'active' : ''}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}

            <button className="arrow" onClick={handleNext} disabled={currentPage === totalPages}>
                &gt;
            </button>
        </div>
    );
};

export default ReturnsPagination;