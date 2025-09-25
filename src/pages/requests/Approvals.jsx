import React, {useState, useEffect} from 'react';
import ReactPaginate from 'react-paginate';
import '../../assets/css/admin/common.css';
import axios from 'axios';
import styled from 'styled-components';
import ApprovalsPopup from './ApprovalsPopup';
import Modal from 'react-modal';

	/* 스타일 */
	const BtnUseStyle = styled.button`
	background-color: #3498db;
	color: #fff;
	border: none;
	padding: 5px 12px;
	border-radius: 4px;
	cursor: pointer;
	&:hover {
		background-color: #2980b9;
	}

	&:active {
		transform: scale(0.95);   /* 살짝 눌린 듯 */
		background-color: #2471a3; /* 좀 더 진한 파랑 */
	}
	`;

	const BtnReturnStyle = styled.button`
	background-color: #e67e22;
	color: #fff;
	border: none;
	padding: 5px 12px;
	border-radius: 4px;
	cursor: pointer;
	&:hover {
		background-color: #d35400;
	}

	&:active {
		transform: scale(0.95);   /* 살짝 눌린 듯 */
		background-color: #ba4a00; /* 눌렀을 때 색 변경 */
	}
	`;


const Approvals = () => {


	/* modal 관련 */
	const modalStyle = {
		content : {
			top: "50%",
			left: "50%",
			right: "auto",
			bottom: "auto",
			transform: "translate(-50%, -50%)", // 👈 중앙 정렬
			width: "850px",
			height: "420px",
			background: "#fff",
			borderRadius: "8px",
			padding: "20px",
			boxShadow: "rgba(0,0,0,0.24) 0px 3px 8px",
		},
	};



    const [modalwin, setModalwin] = useState({
            isopen : false,
            action : "",//등록으로 여는건지 수정으로 여는건지...!
            loginid : "",
        }
    );

	
	const [oneRowData, setOneRowData] = useState({});
	const openModal = (status, itemJson) => {
		setOneRowData(itemJson);

		setModalwin((old)=>(
			{
				...old,
				isopen : true,
				action : status, //사용신청인지, 반납신청인지
			}
		));
	}// openModal


	const closeModal = () => {
		setModalwin((old)=>(
			{
				...old,
				isopen : false,
			}
		));
	}// closeModal

	/* ************************************************ */

	//select 전체 받아오는 json 형태의 list 필요
	const [showAllList, setShowAllList] = useState([]);

    //페이지 관련 json 필요 (현재 페이지, 전체 목록 갯수)
    const paginationJSON = {
		itemPerPage : 10, // 한 페이지당 출력할 행 수
        currentPage : 0,
        totalListCnt : showAllList.length, // 총 행 수
    };
    
	//현재 페이지
	const [currentPage, setCurrentPage] = useState(0);
	//시작 페이지
	const startPage = currentPage * paginationJSON.itemPerPage;

	//한 페이지 데이터 계산
	const currentItems = showAllList.slice(startPage, startPage + paginationJSON.itemPerPage);



    const getAllList = () =>{

        axios.get("/api/approvals/showList")
        .then((res)=>{
            setShowAllList(res.data);
        })
        .catch((err)=>{
            
        });//end axios

    }//getAllList

	//onload 형태
	useEffect(()=>{
		getAllList();
	},[]);


    return (
        <div id="container">
			<ul>
				<li className="contents">
					<div className="content">
                        <p className="Location">
                            <a href="../dashboard/dashboard.do" className="btn_set home">메인으로</a>
                            <span className="btn_nav bold">신청/반납</span>
                            <span className="btn_nav bold">사용신청</span>
                            <a href="/requests/apply" className="btn_set refresh"></a>
                        </p>
						<p className="conTitle">
							<span>결재</span>
							<span className="fr">
								<select id="searchKey" name="searchKey" style={{width:"100px"}}>
									<option value="">전체</option>
									<option value="itProduct">IT 장비</option>
									<option value="name">이름</option>
								</select>
								<input type="text" style={{width:"300px", height:"25px"}} id="searchword" name="searchword"/>
								<a href="#" className="btnType blue" id="btnSearchUser" name="btn"><span>검 색</span></a>
							</span>
						</p>

						<div id="divProductList">
							<table className="col">
								<thead>
									<tr>
										<th>번호</th>
										<th>장비 코드</th>
										<th>이름</th>
										<th>대여 장비</th>
										<th>신청날짜</th>
										<th>상태</th>
									</tr>
								</thead>
								<tbody id="approvalsList" >
									{showAllList.length === 0 ? 
										<tr>
											<td colSpan="5">조회된 데이터가 없습니다.</td>
										</tr>
										:
										currentItems.map((item, index) => (
												<tr key={index}>
													<td>{startPage+index+1}</td>
													<td>{item.category_code}-{item.product_detail_code}</td>
													<td>{item.name}</td>
													<td>{item.product_name}</td>
													<td>{item.order_date}</td>
													<td>
														{item.product_state === "사용신청"?
															(<BtnUseStyle onClick={()=>openModal(item.product_state, item)}>{item.product_state}</BtnUseStyle>) 
																: 
															(<BtnReturnStyle onClick={()=>openModal(item.product_state, item)}>{item.product_state}</BtnReturnStyle>)	
														}
													</td>
												</tr>
											)
										)//end map
									}
									
                                </tbody>
							</table>
						</div>
						<br/>
						<div className="paging_area">
                                <ReactPaginate
										previousLabel = {"← 이전"}
										nextLabel={"다음 →"}
										breakLabel={"..."}
										pageCount={Math.ceil(showAllList.length / paginationJSON.itemPerPage)} // 총 페이지 수
										marginPagesDisplayed={1}
										pageRangeDisplayed={5}
										onPageChange={({ selected }) => setCurrentPage(selected)} // 페이지 변경
										containerClassName={"pagination"}
										activeClassName={"active"}
								/>
                        </div>
					</div>

				</li>
			</ul>

			<Modal style={modalStyle} overlayClassName="mask" isOpen={modalwin.isopen} onRequestClose={closeModal} ariaHideApp={false} shouldCloseOnOverlayClick={false} shouldCloseOnEsc={false}>
				<ApprovalsPopup closeModal={closeModal} action={modalwin.action} oneRowData={oneRowData}/>
			</Modal>
		</div>
    );
};//approvals

export default Approvals;