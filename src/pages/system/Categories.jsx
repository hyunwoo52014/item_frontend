import React, {useState, useEffect} from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "./CategoriesCss.css";
import CategoryModal from "./CategoryModal";
import Modal from "react-modal";

const Categories = () => {
    const searchStyle = {
        fontsize: "15px",
        fontweight: "bold",
    };

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

    const pageStyle = {
        margin: "20px 0",
        display: "flex",
        justifycontent: "center",
        alignitems: "center",
        liststyletype: "none",
        padding: "10px",
    };

    const [searchInfo, setSearchInfo] = useState({
        searchByName: "",
        currentPage: 1,
        pageSize: 5,
        blockSize: 5,
    });

    const [category, setCategory] = useState({
        categoryList: [],
        totalCount: 0,
    });

    const [modalState, setModalState] = useState({
        isOpen: false,
        action: '',
        categoryCode: '',
        categoryName: '',
    })

    const searchCategories = async (cPage = 1) => {
        if(typeof cPage === "object") {
            cPage = 1;
        }
        const urlParams = new URLSearchParams(Object.entries(searchInfo));
        urlParams.set('currentPage', cPage);

        const result = await axios.post("/system/categories/searchCategories", urlParams);

        try {
            console.log(result);
            setCategory((prev) => ({
                ...prev,
                categoryList: result.data.categoryList,
                totalCount: result.data.categoryListCount
            }))

            setSearchInfo((prev) => ({
                ...prev,
                currentPage: cPage
            }))
        } catch(e) {
            console.log(e.errorCode, e.errorMessage);
        }

    }

    useEffect(() => {
        searchCategories();
    }, []);

    const openModal = (status, categoryCode, categoryName) => {
        setModalState(() => ({
            isOpen: true,
            action: status,
            categoryCode: categoryCode,
            categoryName: categoryName
        }))
    }

    const closeRegisterModal = () => {
        setModalState(() => ({
            isOpen: false,
        }))
        searchCategories();
    }

    const changePageButton = (e) => {
        searchCategories(parseInt(e.selected) + 1);
    }

    return (
        <>
            <div className="content">
                <p className="Location">
                    <a className="btn_set home">메인으로</a>{" "}
                    <span className="btn_nav bold">시스템관리</span>{" "}
                    <span className="btn_nav bold"> IT장비 카테고리 관리</span>{" "}
                    <a className="btn_set refresh">새로고침</a>
                </p>
                <p className="conTitle" id="conTitle">
                    <span>IT장비 카테고리 관리</span>{" "}
                    <span className="fr">
                        <span style={searchStyle}>카테고리명</span>
                        <input
                            type="text"
                            id="searchByName"
                            name="searchByName"
                            className="form-control"
                            style={{ width: 150 }}
                            placeholder=""
                            value={searchInfo.searchByName}
                            onChange={
                                (e) => {
                                    setSearchInfo(
                                        (old) => (
                                            {
                                                ...old,
                                                searchByName : e.target.value,
                                            }
                                        )
                                    )
                                }
                            }
                        />
                        &nbsp;&nbsp;&nbsp;
                        <button
                            type="button"
                            className="btn btn-primary"
                            name="searchBtn"
                            id="searchBtn"
                            onClick={searchCategories}
                        >
                            <span>검색</span>
                          </button>
                          <button
                              type="button"
                              className="btn btn-primary"
                              name="newRegister"
                              id="newRegister"
                              onClick={() => openModal("I", '')}
                          >
                            <span>신규등록</span>
                          </button>
                    </span>
                </p>
                <div>
                    <b>
                        총건수 : {category.totalCount}  현재 페이지 번호 : {searchInfo.currentPage}
                    </b>
                    <table className="col">
                        <colgroup>
                            <col width="30%" />
                            <col width="40%" />
                            <col width="30%" />
                        </colgroup>
                        <thead>
                        <tr>
                            <th>번호</th>
                            <th>카테고리명</th>
                            <th>현황</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            category.categoryList.map((category, index) => {
                                return (
                                    <>
                                        <tr key={index}>
                                            <td>{category.categoryNumber}</td>
                                            <td style={{
                                                fontWeight: 'bold',
                                                textDecoration: 'underline',
                                                color: 'blue'
                                            }}
                                            onClick={() => {
                                                openModal('U', category.categoryCode, category.categoryName);
                                            }}
                                            >{category.categoryName}</td>
                                            <td>{category.categoryQuantity}</td>
                                        </tr>
                                    </>
                                )
                            })
                        }
                        </tbody>
                    </table>
                    <br />
                    <ReactPaginate
                    claaaName={pageStyle}
                    breakLabel="..."
                    nextLabel="다음 >"
                    onPageChange={changePageButton}
                    pageRangeDisplayed={searchInfo.blockSize}
                    pageCount={category.totalCount % searchInfo.pageSize === 0 ? category.totalCount / searchInfo.pageSize : parseInt(category.totalCount / searchInfo.pageSize) + 1}
                    previousLabel="< 이전"
                    renderOnZeroPageCount={null}
                    pageClassName={"pageItem"}
                    activeClassName={"currentPagecss"}
                    previousClassName={"pageLabelBtn"}
                    nextClassName={"pageLabelBtn"}
                />
                </div>
            </div>
            <Modal
                style={modalStyle}
                isOpen={modalState.isOpen}
                onRequestClose={closeRegisterModal}
                ariaHideApp={false}
            >
                <CategoryModal action={modalState.action} closeModal={closeRegisterModal} categoryCode={modalState.categoryCode} categoryName={modalState.categoryName}/>
            </Modal>
        </>
    )
}

export default Categories;