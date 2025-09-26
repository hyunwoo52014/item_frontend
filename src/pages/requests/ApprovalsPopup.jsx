import React,{useState,useEffect} from 'react';
import '../../assets/css/admin/common.css';

const ApprovalsPopup=(props)=>{

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
        if(status === "사용신청"){
            setTitleStr(()=>(
                {
                    className : useRequestStr.className,
                    titleName : useRequestStr.titleName,
                    tableDateStr : useRequestStr.tableDateStr,
                    purposeStr : useRequestStr.purposeStr,
                }
            ));//setTitleStr
        }else if(status === "반납신청"){
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
                                <tr><th>{commonStr.tableNameStr}</th><td ><span className="font_black">{props.oneRowData.name}</span></td></tr>
                                <tr><th>{commonStr.tableEquiveCodeStr}</th><td><span className="font_black">{props.oneRowData.category_code}-{props.oneRowData.product_detail_code}</span></td></tr>
                                <tr><th>{commonStr.tableEquivStr}</th><td><span className="font_black">{props.oneRowData.product_name}</span></td></tr>
                                <tr><th>{titleStr.purposeStr}</th><td><span className="font_black">{props.oneRowData.order_reason}</span></td></tr>
                            </tbody>
                        </table>
                        <div className="btn_areaC2 mt30">
                            <button className="btnType10 approval">승인</button>
                            <button className="btnType10 reject">거절</button>
                            <button className="btnType10 btnClose" onClick={props.closeModal}>닫기</button>
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