import React, { useState, useEffect, useCallback } from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Modal from "react-modal";
import "./SamplePage1.css";

import * as commonjs from "../../components/common/commonfunction.js";

//import Samplepage4detailpopup from "./Samplepage4detailpopup.jsx";

const Samplepage14submenu = ({closesubmenuModal, submenuedit}) => {
  // 애플리케이션의 루트 요소를 설정
  Modal.setAppElement("#root");

  const [menuedit, setMenuedit] = useState({
    action : submenuedit.action,
    regyn : submenuedit.regyn,
    mnu_id : submenuedit.mainmenuid,
    mnu_nm : submenuedit.mainmenunm,
    sub_mnu_id : submenuedit.submenuid,
    sub_mnu_nm : submenuedit.submenunm,
    url  : "",
    use_poa : "",
  });

  const selectsubmenu  = () => {
    
    const param = new URLSearchParams();
    param.append("mnu_id",menuedit.sub_mnu_id);

    axios.post("/menu/submenuselect",param)
         .then((res)=> {
            console.log(res);

            setMenuedit((prev) => ({
              ...prev,
              url  : res.data.submenuinfo.mnu_url,
              use_poa : res.data.submenuinfo.use_poa,
            }));
         })
         .catch((err) => {
           console.error(err);
         })
  }

  const save = (flag) => {

    console.log(flag);

    const param = new URLSearchParams(Object.entries(menuedit))

    if(flag === "D") {
       param.set("action",flag);
    }

    axios.post("/menu/submenusave",param )
         .then((res) => {
            console.log(res);

            if(res.data.result === "Y") {
              alert(res.data.resultMsg);
              closesubmenuModal("Y");
            } else {
              alert("실패 하였습니다");
            }
         })
  }

  useEffect(() =>{     

     if(menuedit.action === "I") {
      // alert("등록");
     } else if(menuedit.action === "U") {
      //alert("수정");
      //alert(menuedit.sub_mnu_id);
      selectsubmenu();

     } else{
      alert("이두 저도 아님.",menuedit.action);
     }
  },[])

  const close = () => {
    closesubmenuModal("N");
  }

  return (
      <div className="content">
          <div id="noticeform">
            <p className="conTitle">
              <span>{menuedit.regyn ? "Sub Menu 등록" : "Sub Menu 수정"}   </span>
            </p>
            <table style={{ width: "550px", height: "250px" }}>
              <colgroup>
                 <col width="20%" />
                 <col width="30%" />
                 <col width="20%" />
                 <col width="30%" />
              </colgroup>
              <tbody>
                <tr>
                  <td>
                    {" "}
                    Main Munu ID <span className="font_red">*</span>
                  </td>
                  <td>
                    <input
                      type="text"
                      id="mnu_id"
                      name="mnu_id"
                      className="input-sm"
                      style={{ width: "150px" }}
                      readOnly
                      value={menuedit.mnu_id}
                      onChange={(e)=> {
                        setMenuedit((prev)=> ({
                          ...prev,
                          mnu_id: e.target.value
                        }));
                      }}
                    />
                  </td>
                  <td>
                    {" "}
                    Main Menu 명<span className="font_red">*</span>
                  </td>
                  <td>
                    <input
                      type="text"
                      id="mnu_nm"
                      name="mnu_nm"
                      className="input-sm"
                      style={{ width: "150px" }}
                      readOnly
                      value={menuedit.mnu_nm}
                      onChange={(e)=> {
                        setMenuedit((prev)=> ({
                          ...prev,
                          mnu_nm: e.target.value
                        }));
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    {" "}
                    Munu ID <span className="font_red">*</span>
                  </td>
                  <td>
                    <input
                      type="text"
                      id="sub_mnu_id"
                      name="sub_mnu_id"
                      className="input-sm"
                      style={{ width: "150px" }}
                      value={menuedit.sub_mnu_id}
                      readOnly={menuedit.regyn ? false: true}
                      onChange={(e)=> {
                        setMenuedit((prev)=> ({
                          ...prev,
                          sub_mnu_id: e.target.value
                        }));
                      }}
                    />
                  </td>
                  <td>
                    {" "}
                    Menu 명<span className="font_red">*</span>
                  </td>
                  <td>
                    <input
                      type="text"
                      id="sub_mnu_nm"
                      name="sub_mnu_nm"
                      className="input-sm"
                      style={{ width: "150px" }}
                      value={menuedit.sub_mnu_nm}
                      onChange={(e)=> {
                        setMenuedit((prev)=> ({
                          ...prev,
                          sub_mnu_nm: e.target.value
                        }));
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    {" "}
                    URL <span className="font_red">*</span>
                  </td>
                  <td colSpan="3">
                    <input
                      type="text"
                      id="url"
                      name="url"
                      className="input-sm"
                      style={{ width: "200px" }}
                      value={menuedit.url}
                      onChange={(e)=> {
                        setMenuedit((prev)=> ({
                          ...prev,
                          url: e.target.value
                        }));
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    {" "}
                    사용 유무<span className="font_red">*</span>
                  </td>
                  <td >
                    <select id="use_poa" name="use_poa" value={menuedit.use_poa} 
                     onChange={(e)=> {
                        setMenuedit((prev)=> ({
                          ...prev,
                          use_poa: e.target.value
                        }));
                      }}
                    >
                      <option value="">선태</option>
                      <option value="Y">사용</option>
                      <option value="N">미사용</option>
                    </select>  
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="modal-button">
              {
                menuedit.regyn && (
                <button className="btn btn-primary mx-2" onClick={save}>
                  {" "}
                  등록{" "}
                </button>)
              }                
              { !menuedit.regyn && (
                   <button className="btn btn-primary mx-2" onClick={save}>
                  {" "}
                  수정{" "}
                   </button>         
              )}
              { !menuedit.regyn && (
                   <button className="btn btn-primary mx-2" onClick={ () => {save("D")} }>
                  {" "}
                  삭제{" "}
                  </button>         
              )}     
                <button className="btn btn-primary" onClick={close}>
                {" "}
                닫기{" "}
              </button>
            </div>
          </div>
    </div>      
  );
};

export default Samplepage14submenu;
