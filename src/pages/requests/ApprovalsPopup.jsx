import React from 'react';
import '../../assets/css/admin/common.css';

const ApprovalsPopup=()=>{
    return(
        <div>
            <div id="approvalsReturnDetailDiv" className="layerPop layerType2" style={{width:"800px"}}>
                <dl>
                    <dt><strong>IT 비품 반납 상세</strong></dt>
                    <dd className="content">
                        <p id="r_modalStatusText" style={{fontWeight: "bold", fontSize: "1.2em", textAlign: "center", marginBottom: "10px"}}></p>
                        <table className="row">
                            <tbody>
                                <tr>
                                    <th scope="row">사용신청일</th>
                                    <td colspan="3"><input type="text" className="inputTxt p100" id="r_orderDate" name="r_orderDate" readonly/></td>
                                </tr>
                                <tr><th>대여인</th><td><input type="text" id="r_name" readonly/></td></tr>
                                <tr><th>반납 장비</th><td><input type="text" id="r_productName" readonly/></td></tr>
                                <tr><th>반납 사유</th><td><input type="text" id="r_returnReason" readonly/></td></tr>
                            </tbody>
                        </table>
                        <div className="btn_areaC mt30">
                            <a href="#" className="btnType blue" id="btnReturnApprove"><span>승인</span></a>
                            <a href="#" className="btnType gray" id="btnReturnReject"><span>거절</span></a>
                            <a href="#" className="btnType gray" id="btnCloseReturn"><span>창닫기</span></a>
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