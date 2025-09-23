import React, { useState, useEffect, useCallback } from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Modal from "react-modal";
import "./SamplePage1.css";

import * as commonjs from "../../components/common/commonfunction.js";

//import Samplepage4detailpopup from "./Samplepage4detailpopup.jsx";

const Samplepage14permit = ({closepermitModal, submenuedit}) => {
  // 애플리케이션의 루트 요소를 설정
  Modal.setAppElement("#root");

  const [menuedit, setMenuedit] = useState({
    action : submenuedit.action,
    regyn : submenuedit.regyn,
    mnu_id : submenuedit.mainmenuid,
    mnu_nm : submenuedit.mainmenunm,
    sub_mnu_id : submenuedit.submenuid,
    sub_mnu_nm : submenuedit.submenunm,
    admin : "",
    user : "",
  });

  const selectpermit  = () => {

    const param =new URLSearchParams();
    param.append("submenuid",menuedit.sub_mnu_id);

    axios.post("/menu/selectpermmit", param)
         .then((res) => {
          console.log(res);

          const permitdata = res.data.list;
           
          // user    permit
          //  A          Y
          //  B          N

          permitdata.map((item) => {
            if(item.user === "A") {
               setMenuedit((prev) => ({
                ...prev,
                admin : item.permit,
               }));
            }

            if(item.user === "B") {
               setMenuedit((prev) => ({
                ...prev,
                user : item.permit,
               }));
            }
          })
         })
         .catch((err)=> {
          console.error(err);
         })

    
  }

  const save = () => {
     // 넘겨야 할 내용
     //  mainmenuid
     //  submenuid
     //  manage   
     //  user

    const param =new URLSearchParams();
    param.append("mainmenuid",menuedit.mnu_id);
    param.append("submenuid",menuedit.sub_mnu_id);
    param.append("manage",menuedit.admin);
    param.append("user",menuedit.user);

    axios.post("/menu/savepermit",param)
         .then((res) => {
            alert("권한이 부여 되었습니다.");
            close();
         })
         .catch((err) => {
            console.error(err);
         })
  }

  useEffect(() =>{     

    selectpermit();
  },[])

  const close = () => {
    closepermitModal();
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
                    권한 <span className="font_red">*</span>
                  </td>
                  <td colSpan="3">
                    관리자 
                    <input type="checkbox" id="admin" name="admin" checked={menuedit.admin ==="Y" ? true : false}  
                     onChange={(e)=> {
                        console.log(e.target.value);
                        setMenuedit((prev)=> ({
                          ...prev,
                          admin: e.target.checked ? "Y" : "N",
                        }));
                      }}
                    />
                    사용자
                    <input type="checkbox" id="user" name="user" checked={menuedit.user ==="Y" ? true : false} 
                      onChange={(e)=> {
                        console.log(e.target.value);

                        setMenuedit((prev)=> ({
                          ...prev,
                          user: e.target.checked ? "Y" : "N",
                        }));
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="modal-button">
                <button className="btn btn-primary mx-2" onClick={save}>
                  {" "}
                  저장{" "}
                </button>
                <button className="btn btn-primary" onClick={close}>
                {" "}
                닫기{" "}
              </button>
            </div>
          </div>
    </div>      
  );
};

export default Samplepage14permit;
