import React, { useState, useEffect, useCallback } from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Modal from "react-modal";
import "./SamplePage1.css";

import * as commonjs from "../../components/common/commonfunction.js";
import Samplepage14submenu from "./Samplepage14submenu.jsx";
import Samplepage14permit from "./Samplepage14permit.jsx";
//import Samplepage4detailpopup from "./Samplepage4detailpopup.jsx";

/////////////////////////// 그룹 코드 //////////////////////////////////

const SamplePage14 = () => {
  // 애플리케이션의 루트 요소를 설정
  Modal.setAppElement("#root");

const [searcharea, setSearcharea] = useState({
    smenuid : "",
    smenuname : "",
    suseyn : "",
    currentpage : 1,
    pagesize : 5,
    blocksize : 10,
    level : 0
  });

  const [mainmenudata, setMainmenudata]  = useState({
    totalcnt : 0,
    mainmenulist : [],
  })

  const [subsearcharea, setSubsearcharea] = useState({
    smenuid : "",
    currentpage : 1,
    pagesize : 5,
    blocksize : 10,
    level : 1
  });

  const [submenudata, setSubmenudata]  = useState({
    totalcnt : 0,
    submenulist : [],
  });

  const [mainmenuedit, setMainmenuedit] = useState({
    mainmunewinflag : false,
    regyn : false,
    action : "",
    mnu_id: "",
    menucd : "",
    mnu_nm: "",
    use_poa: "",    
    delteyn : false,
    iddupcheckyn: false,
  });

  const search = async () => {
      console.log(" searcharea : ", searcharea)

      await axios.post("/menu/mainmenusearch", new URLSearchParams(Object.entries(searcharea)))
           .then((res) => {
             console.log(res);

             setMainmenudata((prev) => ({
                ...prev,
                totalcnt :res.data.totalcnt,
                mainmenulist : res.data.mainmenulist,
             }))
           })
           .catch((error) => {
             console.error(error);
           })
       
  };

  const pagebutton = (event) => {
     //alert(event.selected);
    // searchlist(parseInt(event.selected) + 1);

    setSearcharea((prev) => ({
      ...prev,
      currentpage : parseInt(event.selected) + 1,
    }));
  };


  const searchdetailmenu = (mainmenuid,mainmenunm)=> {
        console.log("searchdetailmenu : ", mainmenuid);

        setSubsearcharea((prev) => ({
             ...prev,
             smenuid : mainmenuid,
        }));

        setSubmenuedit((prev) => ({
             ...prev,
             mainmenuid : mainmenuid,
             mainmenunm : mainmenunm,
        }));

  }

  const searchdetailmenulist = async () => {
     console.log("searchdetailmenulist");

     await axios.post("/menu/submenusearch", new URLSearchParams(Object.entries(subsearcharea)))
          .then((res) => {
            console.log(res);

            setSubmenudata((prev) => ({
              ...prev,
              submenulist : res.data.submenulist,
              totalcnt : res.data.totalcnt,
            }));
          })
          .catch((error) => {
            console.log(error);
          })
  }

  const subpagebutton = (event) => {
     //alert(event.selected);
    // searchlist(parseInt(event.selected) + 1);

    setSubsearcharea((prev) => ({
      ...prev,
      currentpage : parseInt(event.selected) + 1,
    }));
  };

  const mainmenureg = () => {
      setMainmenuedit((prev) => (        {
          ...prev,
          mainmunewinflag : true,
          regyn : true,
          action : "I",
          mnu_id : "",
          menucd : "",
          mnu_nm : "",
          use_poa : "",
          delteyn : false,
        }));
  }

  const mainmenumodify = (item) => {
      setMainmenuedit((prev) => (        {
          ...prev,
          mainmunewinflag : true,
          regyn : false, 
          action : "U",
          mnu_id : item.mnu_id,
          menucd : item.mnu_id,
          mnu_nm : item.mnu_nm,
          use_poa : item.use_poa,
          delteyn : item.submenucnt > 0 ? false : true,
        }));
  }  

  const save = () => {

    const checkparam = [
          {inval : mainmenuedit.mnu_id , msg : "메뉴 ID 를 입력 해주세요."},
          {inval : mainmenuedit.mnu_nm , msg : "메뉴명 를 입력 해주세요."},
          {inval : mainmenuedit.use_poa , msg : "사용 여부를 입력 해주세요."}
        ];

    if(!commonjs.nullcheck(checkparam)) return;

    if(!mainmenuedit.iddupcheckyn) {
        alert("메뉴 ID 중복 테크 해주세요");
        return;
    }  
    
    axios.post("/menu/mainmenusave", new URLSearchParams(Object.entries(mainmenuedit)))
         .then((res) => {
               if(res.data.result === "Y") {
                  alert(res.data.resultMsg);
                  closemainmenuModal();
                  search();
               } else {
                  alert("저장에 실패 했습니다.");
               }
         })   
         .catch((error) => {
            console.error(error);
         })
        }

  const deletemainmenu = () => {
        setMainmenuedit((prev) => (        {
          ...prev,
          action : "D",
        }));   
  }

  const iddupcheck = ()=> {
    
    axios.post("/menu/mainmenudupcheck", new URLSearchParams(Object.entries(mainmenuedit)))
         .then((res)=>{
            alert(res.data.resultMsg);

            if(res.data.result === "Y") {
               setMainmenuedit((prev) => (        {
                      ...prev,
                       iddupcheckyn : true,
                    }));   
            }
         })
  }

  const closemainmenuModal= () => {
        setMainmenuedit((prev) => (        {
          ...prev,
          mainmunewinflag : false,
        }));
  }


  useEffect(() => {
     // alert("eddect : " + searcharea.currentpage);
     search();
  }, [searcharea.currentpage]);

   useEffect(() => {
     //alert("eddect : " + subsearcharea.smenuid);
     searchdetailmenulist();
  }, [subsearcharea.smenuid, subsearcharea.currentpage]); 

   useEffect(() => {  
     if(mainmenuedit.action === "D"){
        //alert("useEffect : " + mainmenuedit.action);
        save();
     }
  }, [mainmenuedit.action]); 

  /////////////////////////// sub menu ///////////
 const [submenuedit, setSubmenuedit] = useState({
    submunewinflag : false,
    permitwinflag : false,
    regyn : false,
    action : "",
    mainmenuid : "",
    mainmenunm : "",
    submenuid : "",
    submenunm : "",
  });

  const submenureg = () => {

    if(submenuedit.mainmenuid === ""){
      alert("Main Menu를 먼저 선택해 주세요.");
      return;
    }
    
    setSubmenuedit((prev)  => ({
      ...prev,
      submunewinflag: true,
      regyn : true,
      action : "I",
      submenuid : "",
      submenunm : "",
    }));
  }

  const submenumodify = (submenuid, submenunm) => {
    setSubmenuedit((prev)  => ({
      ...prev,
      submunewinflag: true,
      regyn : false,
      action : "U",
      submenuid : submenuid,
      submenunm : submenunm,
    }));
  }

  const closesubmenuModal = (returnval = "N") => {

    setSubmenuedit((prev)  => ({
      ...prev,
      submunewinflag: false,
    }));

    if(returnval  === "Y") {
       searchdetailmenulist();
    }

  }
  //////////////////////////  권한 Popup
  const openpermitpopup = (menuid, menunm) => {

    setSubmenuedit((prev)  => ({
      ...prev,
      permitwinflag: true,
      submenuid : menuid,
      submenunm : menunm,
    }));
  }  

  const closepermitModal = () => {

    setSubmenuedit((prev)  => ({
      ...prev,
      permitwinflag: false,
    }));
  }  
  /////////////////////////// CSS //////////////////////////////////

  const pagenavicss = {
    margin: "20px 0",
    display: "flex",
    justifycontent: "center",
    alignitems: "center",
    liststyletype: "none",
    padding: "10px",
  };

  const modalStyle = {
    content: {
      width: "450px", // 팝업 너비
      height: "410px", // 높이를 내용에 맞게 자동 조정
      margin: "auto", // 중앙 정렬
      maxHeight: "90vh", // 최대 높이를 화면 높이에 맞게 제한
      padding: "0px", // 내부 여백
      backgroundColor: "#fff", // 배경 흰색
      border: "none", // 테두리 제거
      borderRadius: "8px", // 둥근 모서리
      boxShadow: "none",
      overflow: "auto", // 내용이 넘치면 스크롤 활성화
    },
    overlay: {
      backgroundColor: "transparent", // 외부 배경 투명화
      display: "flex", // 팝업 중앙 정렬
      alignItems: "center", // 수직 중앙 정렬
      justifyContent: "center", // 수평 중앙 정렬
    },
  };

  const submodalStyle = {
    content: {
      width: "600px", // 팝업 너비
      height: "410px", // 높이를 내용에 맞게 자동 조정
      margin: "auto", // 중앙 정렬
      maxHeight: "90vh", // 최대 높이를 화면 높이에 맞게 제한
      padding: "0px", // 내부 여백
      backgroundColor: "#fff", // 배경 흰색
      border: "none", // 테두리 제거
      borderRadius: "8px", // 둥근 모서리
      boxShadow: "none",
      overflow: "auto", // 내용이 넘치면 스크롤 활성화
    },
    overlay: {
      backgroundColor: "transparent", // 외부 배경 투명화
      display: "flex", // 팝업 중앙 정렬
      alignItems: "center", // 수직 중앙 정렬
      justifyContent: "center", // 수평 중앙 정렬
    },
  };  

  const detailmodalStyle = {
    content: {
      width: "800px", // 팝업 너비
      height: "470px", // 높이를 내용에 맞게 자동 조정
      margin: "auto", // 중앙 정렬
      maxHeight: "90vh", // 최대 높이를 화면 높이에 맞게 제한
      padding: "0px", // 내부 여백
      backgroundColor: "#fff", // 배경 흰색
      border: "none", // 테두리 제거
      borderRadius: "8px", // 둥근 모서리
      boxShadow: "none",
      overflow: "auto", // 내용이 넘치면 스크롤 활성화
    },
    overlay: {
      backgroundColor: "transparent", // 외부 배경 투명화
      display: "flex", // 팝업 중앙 정렬
      alignItems: "center", // 수직 중앙 정렬
      justifyContent: "center", // 수평 중앙 정렬
    },
  };

  return (
    <>
      <div className="content">
        <p className="conTitle">
          <span> Main Menu</span>
          <span className="fr" style={{ textAlign: "left", display: "block" }}>
            Menu id
            <input
              type="text"
              className="form-control"
              id="smenuid"
              name="smenuid"
              value={searcharea.smenuid}
              style={{ width: 150 }}              
              onInput={(e) => {
                 setSearcharea(
                  (prev) => ({
                    ...prev,
                    smenuid: e.target.value,
                  })
                 );
               }
              }
            />
            Menu 명
            <input
              type="text"
              className="form-control"
              id="smenuname"
              name="smenuname"
              value={searcharea.smenuname}
              style={{ width: 150 }}
              onInput={(e) => {
                 setSearcharea(
                  (prev) => ({
                    ...prev,
                    smenuname: e.target.value,
                  })
                 );
               }
              }
            />
            사용 여부
            <select
              id="suseyn"
              name="suseyn"
              value={searcharea.suseyn}
              onChange={(e) => {
                 setSearcharea(
                  (prev) => ({
                    ...prev,
                    suseyn: e.target.value,
                  })
                 );
               }
              }
            >
              <option value="">전체</option>
              <option value="Y">사용</option>
              <option value="N">미사용</option>
            </select>
            <button
              className="btn btn-primary mx-2"
              id="btnSearchGrpcod"
              name="btn"
              onClick={search}
            >
              <span> 검 색 </span>
            </button>
            <button
              className="btn btn-light mx-2"
              id="btnSearchGrpcod"
              name="btn"
              onClick={mainmenureg}
            >
              <span> 신규등록 </span>
            </button>
          </span>
        </p>
        <div style={{ marginTop: "5px" }}>
          <span>
            총건수 : {mainmenudata.totalcnt} 
          </span>
          <table className="col">
            <thead>
              <tr>
                <th scope="col"> Menu id </th>
                <th scope="col"> Menu 명 </th>
                <th scope="col"> 사용 여부 </th>
                <th scope="col"> 수정 </th>
              </tr>
            </thead>
            <tbody>
              {
                mainmenudata.totalcnt === 0 ? (
                   <tr>
                     <td colSpan="4">조회된 제이터가 없습니다.</td>
                  </tr>    

                ) : (
                  mainmenudata.mainmenulist.map((item,index) =>  {
                    return (
                      <tr key={index}>
                        <td>{item.mnu_id}</td>
                        <td onClick={ ()=> { searchdetailmenu(item.mnu_id,item.mnu_nm) } }  style={{ cursor: "pointer" }}>{item.mnu_nm}</td>
                        <td>{item.use_poa}</td>
                        <td>
                          <button id="mainmenumodify" name="mainmenumodify" onClick={() =>  {mainmenumodify(item)}}>수정</button>
                        </td>
                      </tr>
                    )
                  })
                )
              } 
            </tbody>
          </table>
          <br />          
          <ReactPaginate
          claaaName={pagenavicss}
          breakLabel="..."
          nextLabel="다음 >"
          onClick={pagebutton}
          pageRangeDisplayed={searcharea.blocksize}
          pageCount={mainmenudata.totalcnt % searcharea.pagesize  === 0 ? mainmenudata.totalcnt / searcharea.pagesize : Math.floor(mainmenudata.totalcnt / searcharea.pagesize) + 1}
          previousLabel="< 이전"
          renderOnZeroPageCount={null}
          pageClassName={"pageItem"}
          activeClassName={"currentPagecss"}
          previousClassName={"pageLabelBtn"}
          nextClassName={"pageLabelBtn"}
        />
        </div>
        <div style={{ marginTop: "5px" }}>
          <p className="conTitle">
          <span> Sub Menu</span>
          <span className="fr" style={{ textAlign: "left", display: "block" }}>
            
            <button
              className="btn btn-primary mx-2"
              id="btnSearchGrpcod"
              name="btn"
              onClick={submenureg}
            >
              <span> 신 규 </span>
            </button>
          </span>
        </p>
          <span>
            총건수 : {submenudata.totalcnt}
          </span>
          <table className="col">
            <thead>
              <tr>
                <th scope="col"> Menu id </th>
                <th scope="col"> Menu 명 </th>
                <th scope="col"> 상위 Menu id </th>
                <th scope="col"> 상위 Menu 명 </th>               
                <th scope="col"> 사용 여부 </th>
                <th scope="col"> 권한 </th>
              </tr>
            </thead>
            <tbody>
              {
                submenudata.totalcnt === 0 ? (
                <tr>
                  <td colSpan={5}>조회된 데이터가 없습니다.</td>
                </tr> 
                )  : (
                  submenudata.submenulist.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item.mnu_id}</td>
                        <td onClick={ () => {submenumodify(item.mnu_id, item.mnu_nm)} } style={{ cursor: "pointer" }} >{item.mnu_nm}</td>
                        <td>{item.hir_mnu_id}</td>
                        <td>{item.hir_mnu_nm}</td>
                        <td>{item.use_poa}</td>
                        <td><button id="permmitchange" name="permmitchange" onClick={() => {openpermitpopup(item.mnu_id, item.mnu_nm)} }>권한</button></td>
                      </tr>
                    )
                  })
                )
              }             
            </tbody>
          </table>
          <br />
          <ReactPaginate
          claaaName={pagenavicss}
          breakLabel="..."
          nextLabel="다음 >"
          onClick={subpagebutton}
          pageRangeDisplayed={subsearcharea.blocksize}
          pageCount={submenudata.totalcnt % subsearcharea.pagesize  === 0 ? submenudata.totalcnt / subsearcharea.pagesize : Math.floor(submenudata.totalcnt / subsearcharea.pagesize) + 1}
          previousLabel="< 이전"
          renderOnZeroPageCount={null}
          pageClassName={"pageItem"}
          activeClassName={"currentPagecss"}
          previousClassName={"pageLabelBtn"}
          nextClassName={"pageLabelBtn"}
        />
        </div>
      </div>
      <Modal
        style={modalStyle}
        isOpen={mainmenuedit.mainmunewinflag}
        onRequestClose={closemainmenuModal}
        ariaHideApp={false}
      >        
          <div id="noticeform">
            <p className="conTitle">
              <span>{mainmenuedit.regyn ? "Main Menu 등록" : "Main Menu 수정"}</span>
            </p>
            <table style={{ width: "400px", height: "250px" }}>
              <colgroup>
                 <col width="50%" />
                 <col width="50%" />
              </colgroup>
              <tbody>
                <tr>
                  <td>
                    {" "}
                    Munu ID <span className="font_red">*</span>
                  </td>
                  <td>
                    <input
                      type="text"
                      id="mnu_id"
                      name="mnu_id"
                      value={mainmenuedit.mnu_id}
                      className="input-sm"
                      style={{ width: "150px" }}
                      readOnly={mainmenuedit.regyn ? false : true}
                      onChange={ (e) => {
                            setMainmenuedit((prev) => ({
                                 ...prev,
                                  mnu_id : e.target.value,
                            }));
                        } 
                      }
                    />
                    {mainmenuedit.regyn && ( <button id="iddupcheck" name="iddupcheck" onClick={iddupcheck}>중복체크</button>)}
                  </td>
                </tr>
                <tr>
                  <td>
                    {" "}
                    Menu 명<span className="font_red">*</span>
                  </td>
                  <td>
                    <input
                      type="text"
                      id="mnu_nm"
                      name="mnu_nm"
                      value={mainmenuedit.mnu_nm}
                      className="input-sm"
                      style={{ width: "300px" }}
                      onChange={ (e) => {
                            setMainmenuedit((prev) => ({
                                 ...prev,
                                  mnu_nm : e.target.value,
                            }));
                        } 
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    {" "}
                    사용 유무<span className="font_red">*</span>
                  </td>
                  <td >
                    <select id="use_poa" name="use_poa" value={mainmenuedit.use_poa}
                        onChange={ (e) => {
                            setMainmenuedit((prev) => ({
                                 ...prev,
                                  use_poa : e.target.value,
                            }));
                        } 
                      }
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
              {mainmenuedit.regyn && (
                <button className="btn btn-primary mx-2" onClick={save}>
                  {" "}
                  등록{" "}
                </button>
              )}
              {!mainmenuedit.regyn && (
                <button className="btn btn-primary mx-2" onClick={save}>
                  {" "}
                  수정{" "}
                </button>
              )}
              {!mainmenuedit.regyn && mainmenuedit.delteyn && (
                <button className="btn btn-primary mx-2" onClick={deletemainmenu}>
                  {" "}
                  삭제{" "}
                </button>
              )}
              <button className="btn btn-primary" onClick={closemainmenuModal}>
                {" "}
                닫기{" "}
              </button>
            </div>
          </div>
      </Modal>
      <Modal
        style={submodalStyle}
        isOpen={submenuedit.submunewinflag}
        onRequestClose={closesubmenuModal}
        ariaHideApp={false}
      >  
        <Samplepage14submenu closesubmenuModal={closesubmenuModal} submenuedit={submenuedit}/>
      </Modal>
      <Modal
        style={submodalStyle}
        isOpen={submenuedit.permitwinflag}
        onRequestClose={closepermitModal}
        ariaHideApp={false}
      >  
        <Samplepage14permit closepermitModal={closepermitModal} submenuedit={submenuedit}/>
      </Modal>
      
    </>
  );
};

export default SamplePage14;
