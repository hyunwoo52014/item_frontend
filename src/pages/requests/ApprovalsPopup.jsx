import React,{useState,useEffect} from 'react';
import '../../assets/css/admin/common.css';
import axios from 'axios';

const ApprovalsPopup=(props)=>{
    // const [propsValue, setPropsValue] = useState(
    //     {
    //         status : props.action, //사용신청인지, 반납신청인지
    //         closeModal : props.closeModal,
    //     }
    // );

    const [titleStr,setTitleStr] = useState({});

    const useRequestStr = {
        className :"layerPop layerType2",
        titleName : "IT 비품 사용 신청 처리",
        tableDateStr : "사용 요청일",
        purposeStr : "사용 목적",
    };//useRequestStr

    const returnRequestStr = {
        className :"layerPop layerType2 return",
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

    
    const [purposeStrFromDB, setPurposeStrFromDB] = useState();
    //사용목적, 반납목적 기입한거, DB에서 가져와야 함.
    const writtenPurposeStr = () => {
        
        //props.oneRowData를 DB 쪽으로 넘겨야해.
        //axios POST를 이용해서 넘기면 되겠지.
        axios.post("/api/approvals/getWrittenPurpose",props.oneRowData)
        .then((res)=>{
            console.log("-----------/api/approvals/getWrittenPurpose----------");
            console.log(res);

            //받아온 결과 화면에 뿌리기(randering이 필요하기 때문에 useState 이용)
            setPurposeStrFromDB(res.data);
        })
        .catch((err)=>{

        });
    };

    /* onload */
    useEffect(()=>{
        tempStr(props.action); //사용신청인지 반납신청인지 틀 만드는거.
        writtenPurposeStr(); // 신청 사유 받아오기
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
                                    <td colSpan="3"><span>{props.oneRowData.order_date}</span></td>
                                </tr>
                                <tr><th>{commonStr.tableNameStr}</th><td><span>{props.oneRowData.name}</span></td></tr>
                                <tr><th>{commonStr.tableEquiveCodeStr}</th><td><span>{props.oneRowData.category_code}-{props.oneRowData.product_detail_code}</span></td></tr>
                                <tr><th>{commonStr.tableEquivStr}</th><td><span>{props.oneRowData.product_name}</span></td></tr>
                                <tr><th>{titleStr.purposeStr}</th><td><span>{purposeStrFromDB}</span></td></tr>
                            </tbody>
                        </table>
                        <div className="btn_areaC mt30">
                            <button className="btnType approval">승인</button>
                            <button className="btnType reject">거절</button>
                            <button className="btnType btnClose" onClick={props.closeModal}>닫기</button>
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