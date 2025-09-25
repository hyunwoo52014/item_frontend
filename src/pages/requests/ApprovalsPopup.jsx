import React,{useState} from 'react';
import '../../assets/css/admin/common.css';

const ApprovalsPopup=(props)=>{
    const [propsValue, setPropsValue] = useState(
        {
            closeModal : props.closeModal,
        }
    );

    return(
        <div>
            <div id="approvalsReturnDetailDiv" className="layerPop layerType2 return" style={{width:"800px"}}>
                <dl>
                    <dt><strong>IT 비품 신청 처리</strong></dt>
                    <dd className="content">
                        <p id="r_modalStatusText" style={{fontWeight: "bold", fontSize: "1.2em", textAlign: "center", marginBottom: "10px"}}></p>
                        <table className="row">
                            <tbody>
                                <tr>
                                    <th scope="row">사용요청일</th>
                                    <td colSpan="3"><span>22020-123401234 fix된 값</span></td>
                                </tr>
                                <tr><th>신청자</th><td><span>길동테스트fix된 값</span></td></tr>
                                <tr><th>장비명</th><td><span>장비테스트fix된 값</span></td></tr>
                                <tr><th>사용 목적</th><td><span>사용목적테스트fix된 값</span></td></tr>
                            </tbody>
                        </table>
                        <div className="btn_areaC mt30">
                            <button className="btnType approval">승인</button>
                            <button className="btnType reject">거절</button>
                            <button className="btnType btnClose" onClick={propsValue.closeModal}>닫기</button>
                        </div>

                        <div id="r_modalStatusBadgeBox" style={{textAlign:"center", margin:"10px 0", display:"none"}}>
                        <span id="r_modalStatusBadge"></span>
                        </div>
                    </dd>
                </dl>
            </div>
        </div>
    );//return
};//ApprovalsPopup
export default ApprovalsPopup;