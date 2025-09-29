import {useEffect, useState} from "react";
import * as PropTypes from "prop-types";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Modal from "react-modal";

import InboundModal from "./InboundModal"
const Inbound = () => {
    const [searchInfo,setSearchInfo]= useState({
        searchSel : "",
        searchTitle : "",
        currentPage : 1,
        pageSize : 10,
        blockSize : 5,
    });

    const [inboundList,setInboundList]= useState({
        importList : [],
        totalCount : 0,
    });

    const [modalState,setModalState]= useState({
        isOpen:false,
        action:"",
        loginId:"",
    });

    const search = async (cPage = 1)=>{
        console.log("search");
        if(typeof cPage=="object"){
            cPage=1;
        }

        const param = new URLSearchParams(Object.entries(searchInfo))
        param.set("currentPage", cPage);

        await axios.post("/asset/searchImport",param)
            .then((res)=>{
                console.log(res);
                setInboundList((old)=>(
                    {
                        ...old,
                        importList: res.data.importList,
                        totalCount: res.data.totalCount,
                    }
                ));
                setSearchInfo((old)=>(
                    {
                        ...old,
                        currentPage: cPage,
                    }
                ))
            })
            .catch((err)=>{
                console.log(err.errorCode,err.errorMessage);
            })
    }
    const pageButton = (e)=>{
        console.log(e.selected);
        search(parseInt(e.selected) + 1);
    }
    const openModal = (action,loginId = "")=>{
        console.log(action,loginId);

        setModalState((prev)=>(
            {
                ...prev,
                isOpen: true,
                action: action,
                loginId: loginId,
            }
        ));
    }

    const closeModal= (searchflag)=>{
        setModalState((prev)=>(
            {
                ...prev,
                isOpen: false,
            }
        ));
        if(searchflag === "Y"){
            if(modalState.action === "I"){
                search();
            }else{
                search(searchInfo.currentPage);
            }
        }
    }

    useEffect(()=>{
        search();
    },[]);



    const searchstyle = {
        fontsize: "15px",
        fontweight: "bold",
        margin: 10,
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

    const pagenavicss = {
        margin: "20px 0",
        display: "flex",
        justifycontent: "center",
        alignitems: "center",
        liststyletype: "none",
        padding: "10px",
    };

    return(
        <div>
            <div>
                <p className="Location">
                    <a className="btn_set home">메인으로</a>{" "}
                    <span className="btn_nav bold">Sampletest</span>{" "}
                    <span className="btn_nav bold"> 입고/통계</span>{" "}
                    <a className="btn_set refresh">입고 관리</a>
                </p>
                <p className="conTitle" id="conTitle">
                    <span>입고 관리</span>{" "}
                    <span className="fr">
                         <span style={searchstyle}>검색어</span>
                        <select id="searchSel" name="searchSel" style={{width : 100, margin : 10}}
                            value={searchInfo.searchSel}
                            onChange={
                                (e)=>{
                                    setSearchInfo((old)=>(
                                        {
                                            ...old,
                                            searchSel: e.target.value,
                                        }
                                    ))
                                }
                            }
                        >
                            <option value="vendor_nm">회사명</option>
                            <option value="porduct_nm">제품명</option>

                        </select>

                        <input
                            type=""
                            id=""
                            name=""
                            className=""
                            style={{width:150, margin:10}}
                            placeholder=""
                            value={searchInfo.searchTitle}
                            onChange={
                                (e)=>{
                                    setSearchInfo(
                                        (old)=>(
                                            {
                                                ...old,
                                                searchTitle: e.target.value,
                                            }
                                        )
                                    )
                                }
                            }

                        />
                        <button
                            className="btn btn-primary"
                            name="searchBtn"
                            id="searchBtn"
                            onClick={search}
                        >
                            <span>검색</span>
                          </button>
                          <button
                              className="btn btn-primary"
                              name="newReg"
                              id="newReg"
                              onClick={() => openModal("I")}
                          >
                            <span>신규등록</span>
                          </button>
                    </span>
                </p>
                <div>
                    <table className="col">
                        <colgroup>
                            <col width="20%" />
                            <col width="20%" />
                            <col width="20%" />
                            <col width="20%" />
                            <col width="20%" />
                        </colgroup>
                        <thead>
                        <tr>
                            <th>번호</th>
                            <th>제품명</th>
                            <th>거래처</th>
                            <th>입고날짜</th>
                            <th>입고량</th>
                        </tr>
                        </thead>
                        <tbody>
                        {inboundList.totalCount === 0 && <tr><td colSpan="7">조회된 데이터가 없습니다.</td></tr>}
                        {inboundList.totalCount > 0 &&
                            inboundList.importList.map(
                                (inbound,index)=>{
                                    return(
                                        <tr key={index}>
                                            <td>{inbound.importNumber}</td>
                                            <td>
                                                <a
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault(); // 기본 이동 막기
                                                        openModal("detail", inbound.importNumber);
                                                    }}
                                                >
                                                    {inbound.productName}
                                                </a>
                                            </td>
                                            <td>{inbound.vendorName}</td>
                                            <td>{inbound.importDate}</td>
                                            <td>{inbound.importQuantity}</td>
                                        </tr>
                                    )
                                }
                            )
                        }
                        </tbody>
                    </table>
                    <br />
                    <ReactPaginate
                        claaaName={pagenavicss}
                        breakLabel="..."
                        nextLabel="다음 >"
                        onPageChange={pageButton}
                        pageRangeDisplayed={searchInfo.blocksize}
                        pageCount={inboundList.totalCount % searchInfo.pageSize === 0 ? inboundList.totalCount / searchInfo.pagesize : parseInt(inboundList.totalCount / searchInfo.pageSize) + 1}
                        previousLabel="< 이전"
                        renderOnZeroPageCount={null}
                        pageClassName={"pageItem"}
                        activeClassName={"currentPagecss"}
                        previousClassName={"pageLabelBtn"}
                        nextClassName={"pageLabelBtn"}
                    />
                </div>
            </div>
            <InboundModal
                modalState={modalState}
                closeModal={closeModal}
            />
        </div>
    )

}
export default Inbound;