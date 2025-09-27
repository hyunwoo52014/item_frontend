import React from 'react';
import '../../assets/css/admin/approvals.css';

const ApprovalsConfirmeModal = (props) => {
    // props.status > 여기서 승인 된건지 거절된건지 선택할 수 있지.
    // props.closeModal > modal 닫기
    // props.firstCloseModal > 첫번째 modal 닫기
    // console.log(props);
    
    return (
        <div>
            <div className="wrap_modal_approval">
                <div className="approval_modal">승인 알림</div>
                
                <div className="modal_content_approval">
                    승인되었습니다.
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