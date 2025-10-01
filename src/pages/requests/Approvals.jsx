import React, {useState, useEffect} from 'react';
import ReactPaginate from 'react-paginate';
import '../../assets/css/admin/common.css';
import axios from 'axios';
import styled from 'styled-components';
import ApprovalsPopup from './ApprovalsPopup';
import Modal from 'react-modal';
import '../../assets/css/admin/approvals.css';

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
    
	/* 검색 기능에 사용 */
	const [searchStr, setSearchStr] = useState("all"); //전체, IT 장비, 이름 중 선택 // 초기값 : "전체"
	const [searchWordStr, setSearchWordStr] = useState(""); //검색어 입력, 신청 날짜도 이거 사용
	const [filteredList, setFilteredList] = useState([]); //front단에서 검색할 때 사용
	const [randeringList, setRanderingList] = useState(showAllList);
	useEffect(()=>{
		searchWordStr === "" ? setRanderingList(showAllList) : setRanderingList(filteredList);
	},[showAllList, filteredList,searchWordStr]);

	//현재 페이지
	const [currentPage, setCurrentPage] = useState(0);
	//시작 페이지
	const startPage = currentPage * paginationJSON.itemPerPage;

	//한 페이지 데이터 계산
	const currentItems = randeringList.slice(startPage, startPage + paginationJSON.itemPerPage);





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


	


	/* 검색 버튼이 클릭되었을 때 동작 */
	//backend에서 처리할 때 사용. - But, frontend에서 처리하는 걸로 변경할 예정
	const clickSearchBtnFunc=()=>{
		const searchStrJson={
			searchStr : searchStr,
			searchWordStr : searchWordStr,
		};

		//searchStrJson을 넘기면 되지
		axios.post("/api/approvals/search",searchStrJson)
		.then((res)=>{
			console.log(res);
		})
		.catch((err)=>{
			console.log(err.config);
			console.log(err.response?.data);
		});
	
		setSearchWordStr(""); //검색창 초기화
	}//clickSearchBtnFunc

	const searchFunc=(writtenWord)=>{
		let result;
		let tmpStr;


		setFilteredList(
			showAllList.filter(item=>{
				//여기에 switch ~ case 넣으면 딱일 것 같은데
				switch(searchStr){
					case "itCode" :
						tmpStr=(item.category_code+"-"+item.product_detail_code).toLowerCase();
						result=tmpStr.includes(writtenWord.toLowerCase());
						break;
					case "name" :
						result=item.name.includes(writtenWord);
						break;
					case "requestDate":
						result=item.order_date.includes(writtenWord);
						break;
					default :
						result=true;
				}
				return result;
			})//filter
		)//setFilteredList

	}//end searchFunc

    return (
        <div id="container">
			<ul>
				<li className="contents">
					<div className="content">
                        <p className="Location">
                            <a href="../dashboard/dashboard.do" className="btn_set home">메인으로</a>
                            <span className="btn_nav bold">신청/반납</span>
                            <span className="btn_nav bold">사용신청</span>
							<button aria-label="새로고침" onClick={() => window.location.reload()} className="btn_set_approval refresh_approval">
								<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#6c757d" viewBox="0 0 16 16">
								<path d="M8 3a5 5 0 1 0 4.546 2.916.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
								<path d="M8 1v4h4l-1.5-1.5A5.978 5.978 0 0 0 8 1z"/>
								</svg>
							</button>


                        </p>
						<p className="conTitle">
							<span>결재</span>
							<span className="fr">
								<select id="searchKey" name="searchKey" style={{width:"100px", marginRight:"10px"}} className="searchOption_approval" onChange={(e)=>{setSearchStr(e.target.value); setSearchWordStr("");}}>
									<option value="all">전체</option>
									<option value="itCode">장비 코드</option>
									<option value="name">이름</option>
									<option value="requestDate">신청 날짜</option>
								</select>
								{searchStr === "requestDate"?
								<input type="date" className="searchOption_approval" style={{width:"120px", height:"30px", marginRight:"10px"}} value={searchWordStr} onChange={(e)=>{setSearchWordStr(e.target.value); searchFunc(e.target.value);}}/>
								:
								<input type="text" value={searchWordStr} style={{width:"250px", height:"30px", marginRight:"10px"}} className="searchOption_approval" id="searchword" name="searchword" onChange={(e)=>{setSearchWordStr(e.target.value); searchFunc(e.target.value);}} readOnly={searchStr === "all"} placeholder={searchStr === "all"?"":"검색어를 입력하세요."} disabled={searchStr==="all"}/>
								}
								<button className="searchBtn_approval" onClick={(e)=>{searchFunc(searchWordStr)}}><span>검 색</span></button>
							</span>
						</p>

						<div id="divProductList">
							<div><span className="bold">총 개수 : </span>{"\u00A0"}{showAllList.length} {"\u00A0\u00A0\u00A0\u00A0\u00A0"} <span className="bold">검색 개수 : </span>{"\u00A0"}{randeringList.length} </div>
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
									{randeringList.length === 0 ? 
										<tr>
											<td colSpan="6">조회된 데이터가 없습니다.</td>
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
														{item.product_state === "O"?
															(<BtnUseStyle onClick={()=>openModal(item.product_state, item)}>{item.product_state_str}</BtnUseStyle>) 
																: 
															(<BtnReturnStyle onClick={()=>openModal(item.product_state, item)}>{item.product_state_str}</BtnReturnStyle>)	
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
						<div className="paging_area_approval">
                                <ReactPaginate
										previousLabel = {"← 이전"}
										nextLabel={"다음 →"}
										breakLabel={"..."}
										pageCount={Math.ceil(randeringList.length / paginationJSON.itemPerPage)} // 총 페이지 수
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

			<Modal style={modalStyle} overlayClassName="approval_modal_overlay-level1" isOpen={modalwin.isopen} onRequestClose={closeModal} ariaHideApp={false} shouldCloseOnOverlayClick={false} shouldCloseOnEsc={false} closeTimeoutMS={200} className="approval_modal_content-level1">
				<ApprovalsPopup closeModal={closeModal} action={modalwin.action} oneRowData={oneRowData} onSuccess={()=>{getAllList();}}/>
			</Modal>
		</div>
    );
};//approvals

export default Approvals;