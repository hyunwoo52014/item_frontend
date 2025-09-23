import React from 'react';
import ReactPaginate from 'react-paginate';
import '../../assets/css/admin/common.css';
import Pagination from '../../components/common/Pagination'

const Approvals = () => {

    //페이지 관련 json 필요 (현재 페이지, 전체 목록 갯수)
    const paginationJSON = {
        currentPage : 0,
        totalListCnt : 0,
    };
    //select 전체 받아오는 json 형태의 list 필요
    const getAllList = () =>{
        axios.get("/api/approvals/showList")
        .then((res)=>{
            console.log("/api/approvals/showList 반환값 :   "+res.data);
        })
        .catch((err)=>{
            
        });
    }//getAllList


    return (
        <div id="container">
			<ul>
				<li className="contents">
					<div className="content">
                        <p class="Location">
                            <a href="../dashboard/dashboard.do" className="btn_set home">메인으로</a>
                            <span className="btn_nav bold">신청/반납</span>
                            <span className="btn_nav bold">사용신청</span>
                            <a href="/requests/apply" className="btn_set refresh"></a>
                        </p>
						<p className="conTitle">
							<span>결제</span>
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
										<th>이름</th>
										<th>대여 장비</th>
										<th>신청날짜</th>
										<th>상태</th>
									</tr>
								</thead>
								<tbody id="approvalsList">
                                    {/* 만약 select 값이 0 이면, 조회되는 값이 없습니다. 출력 */}
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tbody>
							</table>
						</div>
						
						<div className="paging_area">
                            <ReactPaginate pageCount={} onPageChange={} />
                        </div>
					</div>

				</li>
			</ul>
		</div>
    );
};//approvals

export default Approvals;