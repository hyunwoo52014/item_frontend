import React from 'react';
import './ReturnsPagination.css'; // 새로 만든 CSS 파일을 임포트합니다.

const ReturnsPagination = ({
                               currentPage,
                               totalPage,
                               pageSize,
                               blockSize,
                               onClick,
                           }) => {
    const pageNumbers = [];
    const maxPagesToShow = blockSize; // blockSize를 페이지 블록 수로 사용합니다.

    if (totalPage <= 1) {
        return null;
    }

    const currentBlock = Math.ceil(currentPage / maxPagesToShow);
    const startPage = (currentBlock - 1) * maxPagesToShow + 1;
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPage);

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="paging">
            {/* 첫 페이지로 이동하는 버튼 */}
            <a
                href="#"
                className="first"
                onClick={(e) => {
                    e.preventDefault();
                    onClick(1);
                }}
            ></a>
            {/* 이전 페이지로 이동하는 버튼 */}
            <a
                href="#"
                className="pre"
                onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                        onClick(currentPage - 1);
                    }
                }}
            ></a>
            <span>
        {pageNumbers.map((page) => (
            currentPage === page ? (
                <strong key={page}>{page}</strong>
            ) : (
                <a
                    href="#"
                    key={page}
                    onClick={(e) => {
                        e.preventDefault();
                        onClick(page);
                    }}
                >
                    {page}
                </a>
            )
        ))}
      </span>
            {/* 다음 페이지로 이동하는 버튼 */}
            <a
                href="#"
                className="next"
                onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPage) {
                        onClick(currentPage + 1);
                    }
                }}
            ></a>
            {/* 마지막 페이지로 이동하는 버튼 */}
            <a
                href="#"
                className="last"
                onClick={(e) => {
                    e.preventDefault();
                    onClick(totalPage);
                }}
            ></a>
        </div>
    );
};

export default ReturnsPagination;