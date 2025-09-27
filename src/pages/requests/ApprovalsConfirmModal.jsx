import React, {useState,useEffect} from 'react';
import '../../assets/css/admin/approvals.css';

const ApprovalsConfirmeModal = (props) => {
    // props.status > 여기서 승인 된건지 거절된건지 선택할 수 있지.
    // props.closeModal > modal 닫기
    // props.firstCloseModal > 첫번째 modal 닫기
    // console.log(props);
    const approvalStr = {
        fullBorderLineClassName : "wrap_modal_approval",
        titleClassName : "approval_modal",
        titleStr : "승인 알림",
        contentStr : "승인되었습니다.",
    };

    const rejectStr = {
        fullBorderLineClassName : "wrap_modal_reject",
        titleClassName : "reject_modal",
        titleStr : "거절 알림",
        contentStr : "거절되었습니다.",
    };

    const [tempStr,setTempStr] = useState({});
    const tempStrFunc = () => {
        console.log("ApprovalsConfirmModal....................");
        console.log(props);
        if(props.status === "approval"){
            setTempStr(approvalStr);
        }else if(props.status === "reject"){
            setTempStr(rejectStr);
        }
    };

    /* onload */
    useEffect(()=>{
        tempStrFunc();
    },[]);

    
    return (
        <div>
            <div className={tempStr.fullBorderLineClassName}>
                <div className={tempStr.titleClassName}>{tempStr.titleStr}</div>
                
                <div className="modal_content_approval">
                    {tempStr.contentStr}
                </div>
                <button className="btnType10 btnClose btnlocation_approval" 
                        onClick={()=>{
                            props.closeModal();
                            props.firstCloseModal();
                        }}>
                    확인
                </button>
            
            </div>
        </div>

    );


}//ApprovalsConfirmeModal

export default ApprovalsConfirmeModal;