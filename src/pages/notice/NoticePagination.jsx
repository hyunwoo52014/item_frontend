import React from "react";

const NoticePagination = ({ currentPage, totalPage, blockSize, onClick }) => {
    const currentBlock = Math.floor((currentPage - 1) / blockSize);
    const startPage = currentBlock * blockSize + 1;
    const endPage = Math.min(startPage + blockSize - 1, totalPage);

    return (
        <nav aria-label="Notice pagination" style={{ padding: "5px", textAlign: "center" }}>
            <ul className="pagination">
                {/* 항상 Prev */}
                <li className="page-item">
                    <a
                        href="#"
                        className="page-link"
                        onClick={(e) => {
                            e.preventDefault();
                            onClick(Math.max(1, currentPage - 1));
                        }}
                    >
                        Prev
                    </a>
                </li>

                {/* 페이지 번호 */}
                {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(
                    (pageNumber) => (
                        <li
                            key={pageNumber}
                            className={`page-item ${currentPage === pageNumber ? "on" : ""}`}
                        >
                            <a
                                href="#"
                                className="page-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onClick(pageNumber);
                                }}
                            >
                                {pageNumber}
                            </a>
                        </li>
                    )
                )}

                {/* 항상 Next */}
                <li className="page-item">
                    <a
                        href="#"
                        className="page-link"
                        onClick={(e) => {
                            e.preventDefault();
                            onClick(Math.min(totalPage, currentPage + 1));
                        }}
                    >
                        Next
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default NoticePagination;
