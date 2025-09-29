import React,{useState,useEffect} from 'react';
import '../../assets/css/admin/common.css';
import Modal from 'react-modal';
import axios from 'axios';
import '../../assets/css/admin/approvals.css';
import ApprovalsConfirmeModal from './ApprovalsConfirmModal';

const ApprovalsPopup=(props)=>{
    // props.closeModal  > 사용 신청 혹은 반납 신청 팝업 닫기!


	/* modal 관련 */
	const modalStyle = {
		content : {
			width: "450px",
			height: "220px",
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

    const closeModal = () => {
		setModalwin((old)=>(
			{
				...old,
				isopen : false,
			}
		));
	}// closeModal

    /************************************************** */

    const [titleStr,setTitleStr] = useState({});

    const useRequestStr = {
        className :"layerPop10 layerType210",
        titleName : "IT 비품 사용 신청 처리",
        tableDateStr : "사용 요청일",
        purposeStr : "사용 목적",
    };//useRequestStr

    const returnRequestStr = {
        className :"layerPop10 layerType210 return",
        titleName : "IT 비품 반납 신청 처리",
        tableDateStr : "반납 요청일",
        purposeStr : "반납 목적",
    };//returnRequestStr

    const commonStr = {
        tableNameStr : "신청자",
        tableEquiveCodeStr : "장비코드",
        tableEquivStr : "장비명",
    };//commonStr


    const tempStr = (status) => {
        if(status === "O"){
            setTitleStr(()=>(
                {
                    className : useRequestStr.className,
                    titleName : useRequestStr.titleName,
                    tableDateStr : useRequestStr.tableDateStr,
                    purposeStr : useRequestStr.purposeStr,
                }
            ));//setTitleStr
        }else if(status === "R"){
            setTitleStr(()=>(
                {
                    className : returnRequestStr.className,
                    titleName : returnRequestStr.titleName,
                    tableDateStr : returnRequestStr.tableDateStr,
                    purposeStr : returnRequestStr.purposeStr,
                }
            ));
        }

    }; // tempStr


    /***************승인, 거절 모달******************************** */

    const [approvalConfirmModalStatus, setApprovalConfirmModalStatus] = useState(
        {
            status : "",
        }
    );
    const clickApprovalsBtn = (status) => {
        // props.oneRowData 이걸 서버쪽으로 넘겨서 계산해야지

        console.log("oneRowData========");
        console.log(props.oneRowData);

        if(status === "yes"){
            props.oneRowData.approve = 'Y';
        }else if(status === "no"){
            props.oneRowData.approve='N';
        }
        console.log("oneRowData========222[[[====");
        console.log(props.oneRowData);
        axios.post("/api/approvals/clickApprovals",props.oneRowData)
        .then((res)=>{

            console.log("clickApprovalse---------");
            console.log(res);
            if(props.oneRowData.approve='Y' && res.data === 2){
                //승인되었습니다.
                setApprovalConfirmModalStatus(()=>(
                    {
                        status : status,
                    }
                ));
                setModalwin((old)=>(
                    {
                        ...old,
                        isopen:true,
                    }
                ));
                props.onSuccess(); //성공시 데이터 갱신(부모 쪽 리스트 갱신)
            }else if(props.oneRowData.approve='N' && res.data === 2){
                //거절되었습니다.
                setApprovalConfirmModalStatus(()=>(
                    {
                        status : status,
                    }
                ));
                setModalwin((old)=>(
                    {
                        ...old,
                        isopen:true,
                    }
                ));

                props.onSuccess();//성공시 데이터 갱신(부모 쪽 리스트 갱신)
            }else{
                console.log("프로그램 이상 발생 / 관리자에게 문의 필요!");
                console.log(res);
                alert("프로그램 이상 발생\n관리자에게 문의해주세요.");
            }
        })
        .catch((err)=>{

        });
        
    }; //clickApprovalsBtn
    


    /* onload */
    useEffect(()=>{
        tempStr(props.action); //사용신청인지 반납신청인지 틀 만드는거.
    },[]);

    return(
        <div>
            <div id="approvalsReturnDetailDiv" className={titleStr.className} style={{width:"800px"}}>
                <dl>
                    <dt><strong>{titleStr.titleName}</strong></dt>
                    <dd className="content">
                        <p id="r_modalStatusText" style={{fontWeight: "bold", fontSize: "1.2em", textAlign: "center", marginBottom: "10px"}}></p>
                        <table className="row">
                            <tbody>
                                <tr>
                                    <th scope="row">{titleStr.tableDateStr}</th>
                                    <td colSpan="3"><span className="font_black">{props.oneRowData.order_date}</span></td>
                                </tr>
                                <tr><th>{commonStr.tableNameStr}</th><td><span className="font_black">{props.oneRowData.name}</span></td></tr>
                                <tr><th>{commonStr.tableEquiveCodeStr}</th><td><span className="font_black">{props.oneRowData.category_code}-{props.oneRowData.product_detail_code}</span></td></tr>
                                <tr><th>{commonStr.tableEquivStr}</th><td><span className="font_black">{props.oneRowData.product_name}</span></td></tr>
                                <tr><th>{titleStr.purposeStr}</th><td><span className="font_black">{props.oneRowData.order_reason}</span></td></tr>
                            </tbody>
                        </table>
                        <div className="btn_areaC2 mt30">
                            <button className="btnType10 approval" onClick={()=>{clickApprovalsBtn("yes");}}>승인</button>
                            <button className="btnType10 reject" onClick={()=>{clickApprovalsBtn("no");}}>거절</button>
                            <button className="btnType10 btnClose" onClick={props.closeModal}>닫기</button>
                        </div>

                        <div id="r_modalStatusBadgeBox" style={{textAlign:"center", margin:"10px 0", display:"none"}}>
                        <span id="r_modalStatusBadge"></span>
                        </div>
                    </dd>
                </dl>
            </div>
            
            <Modal style={modalStyle} isOpen={modalwin.isopen} onRequestClose={closeModal} ariaHideApp={false} shouldCloseOnOverlayClick={false}  closeTimeoutMS={200} className="approval_modal_content-level2" overlayClassName="approval_modal_overlay-level2">
                <ApprovalsConfirmeModal closeModal={closeModal} firstCloseModal={props.closeModal} status={approvalConfirmModalStatus.status}></ApprovalsConfirmeModal>
            </Modal>
            
        </div>
    );//return
};//ApprovalsPopup
export default ApprovalsPopup;