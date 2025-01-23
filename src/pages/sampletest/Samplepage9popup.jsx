import React, { useEffect, useState } from "react";
import axios from "axios";
import Daumpostcode from "react-daum-postcode";
import * as commonjs from "../../components/common/commonfunction.js";
import Commcodeselect from "../../components/common/Commcodeselect";

import "./SamplePage1.css";

/*                    등록(입력여부)         수정
loginID     loginID    O          X readonly
user_type   사용자타입     O          O
name        이름        O          O
password    비밀번호      O          O
sex         성별        O          O
hp          연락처      O          O
email       이메일      O          O
zipcd       우편번호     O          O
addr        주소       O          O
dtladdr     상세주소    O          O
loc         지역      O          O 
birthday    생년월일    O          O
regdate     등록일자    X         readonly
*/

const Samplepage9popup = (prop) => {
  const [editelent, setEditelent] = useState({
    loginID: "",
    user_type: "",
    name: "",
    password: "",
    sex: "",
    hp: "010-",
    email: "",
    zipcd: "",
    addr: "",
    dtladdr: "",
    loc: "",
    birthday: "",
    regdate: "",
    iddupcheck: false,
  });

  const [daimisopen, setDaimisopen] = useState(false);

  const [phone, setPhone] = useState("");
  const [isValid, setIsValid] = useState(true); // 유효성 상태

  useEffect(() => {
    if (prop.modalflag.action === "I") {
      setEditelent((prev) => ({
        ...prev,
        loginID: "",
        user_type: "",
        name: "",
        password: "",
        sex: "",
        hp: "",
        email: "",
        zipcd: "",
        addr: "",
        dtladdr: "",
        loc: "",
        birthday: "",
        regdate: "",
      }));
    } else {
      setEditelent((prev) => ({
        ...prev,
        loginID: prop.modalflag.item.loginID,
        user_type: prop.modalflag.item.user_type,
        name: prop.modalflag.item.name,
        password: prop.modalflag.item.password,
        sex: prop.modalflag.item.sex,
        hp: prop.modalflag.item.hp,
        email: prop.modalflag.item.email,
        zipcd: prop.modalflag.item.zipcd,
        addr: prop.modalflag.item.addr,
        dtladdr: prop.modalflag.item.dtladdr,
        loc: prop.modalflag.item.loc,
        birthday: prop.modalflag.item.birthday,
        regdate: prop.modalflag.item.regdate,
        iddupcheck: true,
      }));
    }
  }, []);

  const clopsepop = () => {
    prop.closeModal(false);
  };

  const iddupcheck = () => {
    // alert(editelent.loginID);

    const param = new URLSearchParams();
    param.append("loginID", editelent.loginID);

    axios
      .post("/usermgr/loginidcheck.do", param)
      .then((res) => {
        if (res.data.count > 0) {
          alert("Login ID가 중복 되었습니다.");
        } else {
          alert("입력된 Login ID가 사용 가능 합니다.");
          editelent.iddupcheck = true;
        }
      })
      .catch((err) => {
        console.log("iddupcheck catch start");
        alert(err.message);
      });
  };

  const phonecheck = (e) => {
    let input = e.target.value;
    // 숫자만 남기기
    input = input.replace(/[^0-9]/g, "");

    // 자동 포맷팅: 000-0000-0000 형식
    if (input.length > 3 && input.length <= 7) {
      input = `${input.slice(0, 3)}-${input.slice(3)}`;
    } else if (input.length > 7) {
      input = `${input.slice(0, 3)}-${input.slice(3, 7)}-${input.slice(7)}`;
    }

    // 상태 업데이트
    setPhone(input);

    // 유효성 검사
    const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
    setIsValid(phoneRegex.test(input));
  };

  const datavalidation = () => {
    const checklist = [
      { inval: editelent.loginID, msg: "loginID를 입력해 주세요" },
      { inval: editelent.user_type, msg: "사용자타입를 선택해 주세요" },
      { inval: editelent.name, msg: "이름을 입력해 주세요" },
      { inval: editelent.password, msg: "비밀번호를 입력해 주세요" },
    ];

    return commonjs.nullcheck(checklist);
  };

  const save = (e) => {
    //alert(editelent.iddupcheck);

    if (!editelent.iddupcheck) {
      alert("Login ID 중복 체크 해주세요.");
      return;
    }

    if (!datavalidation()) return;

    const param = new URLSearchParams(Object.entries(editelent));
    param.append("username", editelent.name);

    console.log("save typeof e : ", typeof e);

    if (typeof e === "string") {
      param.append("action", "D");
    } else {
      param.append("action", prop.modalflag.action);
    }

    axios
      .post("/usermgr/saveuserinfo.do", param)
      .then((res) => {
        console.log(res);

        alert(res.data.resultmsg);

        if (res.data.result === "Y") {
          prop.closeModal(true);
        }
      })
      .catch((err) => {
        console.log("attachfileproc catch start");
        alert(err.message);
      });
  };

  const InputvalueChange = (e) => {
    const { id, value } = e.target;

    setEditelent((prev) => ({
      ...prev,
      [id]: value, // id를 키로 사용하여 상태를 동적으로 업데이트
    }));
  };

  const deleteuser = () => {
    save("D");
  };

  const zipreturn = (data) => {
    // console.log(data);
    setEditelent((prev) => ({
      ...prev,
      zipcd: data.zonecode,
      addr: data.address,
    }));

    daumclopsepop();
  };

  const daumopenpop = () => {
    setDaimisopen(true);
  };

  const daumclopsepop = () => {
    setDaimisopen(false);
  };

  const areareturn = (value) => {
    setEditelent({
      ...editelent,
      loc: value,
    });
  };

  return (
    <div>
      <table className="row modal-content">
        <colgroup>
          <col style={{ width: "20%" }} />
          <col />
          <col style={{ width: "20%" }} />
          <col />
        </colgroup>
        <tbody>
          <tr>
            <td colSpan={4}>
              <p className="conTitle">
                <span>{prop.title}</span>
              </p>
            </td>
          </tr>
          <tr>
            <th style={{ padding: "30px" }}>loginID</th>
            <td>
              <input
                type="text"
                id="loginID"
                name="loginID"
                readOnly={prop.modalflag.action === "I" ? false : true}
                value={editelent.loginID}
                onChange={(e) => InputvalueChange(e)}
              />
              {prop.modalflag.action === "I" && (
                <button className="btn btn-primary" onClick={iddupcheck}>
                  중복체크
                </button>
              )}
            </td>
            <th style={{ padding: "30px" }}>사용자 구분</th>
            <td>
              groupcode : usertype
              <select
                id="user_type"
                name="user_type"
                style={{ width: 80 }}
                value={editelent.user_type}
                onChange={(e) => InputvalueChange(e)}
              >
                <option value="">선택</option>
                <option value="A">관리자</option>
                <option value="B">사용자</option>
              </select>
            </td>
          </tr>
          <tr>
            <th style={{ padding: "30px" }}>이름</th>
            <td>
              <input
                type="text"
                id="name"
                name="name"
                value={editelent.name}
                onChange={(e) => InputvalueChange(e)}
              />
            </td>
            <th style={{ padding: "30px" }}>비밀번호</th>
            <td>
              <input
                type="text"
                id="pwd"
                name="pwd"
                value={editelent.password}
                onChange={(e) => InputvalueChange(e)}
              />
            </td>
          </tr>
          <tr>
            <th style={{ padding: "30px" }}>성별</th>
            <td>
              <select
                id="sex"
                name="sex"
                style={{ width: 80 }}
                value={editelent.sex}
                onChange={(e) => InputvalueChange(e)}
              >
                <option value="">선택</option>
                <option value="M">남</option>
                <option value="W">여</option>
              </select>
            </td>
            <th style={{ padding: "30px" }}>연락처</th>
            <td>
              <input
                type="text"
                id="hp"
                name="hp"
                value={editelent.hp}
                placeholder="010-0000-0000"
                onChange={(e) => {
                  phonecheck(e);
                  InputvalueChange(e);
                }}
              />
              {!isValid && phone !== "" && (
                <p style={{ color: "red" }}>
                  {" "}
                  올바른 형식의 핸드폰 번호를 넣어 주세요.
                </p>
              )}
            </td>
          </tr>
          <tr>
            <th style={{ padding: "30px" }}>e-mail</th>
            <td>
              <input
                type="text"
                id="email"
                name="email"
                value={editelent.email}
                onChange={(e) => InputvalueChange(e)}
              />
            </td>
            <th style={{ padding: "30px" }}>지역</th>
            <td>
              <Commcodeselect
                groupcode="areacd"
                selecttype="sel"
                defaultValue={editelent.loc}
                returnfunction={areareturn}
              />
            </td>
          </tr>
          <tr>
            <th style={{ padding: "30px" }}>우편번호</th>
            <td>
              <input
                type="text"
                id="zipcd"
                name="zipcd"
                readOnly={true}
                value={editelent.zipcd}
                onChange={(e) => InputvalueChange(e)}
              />
              <button className="btn btn-primary" onClick={daumopenpop}>
                우편번호
              </button>
            </td>
            <th style={{ padding: "30px" }}>주소</th>
            <td>
              <input
                type="text"
                id="addr"
                name="addr"
                readOnly={true}
                value={editelent.addr}
                onChange={(e) => InputvalueChange(e)}
              />
              <input
                type="text"
                id="dtladdr"
                name="dtladdr"
                value={editelent.dtladdr}
                onChange={(e) => InputvalueChange(e)}
              />
            </td>
          </tr>
          <tr>
            <th style={{ padding: "30px" }}>생년월일</th>
            <td>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={editelent.birthday}
                onChange={(e) => InputvalueChange(e)}
              />
            </td>
            <th style={{ padding: "30px" }}>등록일자</th>
            <td>
              <input
                type="text"
                id="regdate"
                name="regdate"
                value={editelent.regdate}
                readOnly={true}
                onChange={(e) => InputvalueChange(e)}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={4}>
              <div className="modal-button">
                <button onClick={save}> 저장 </button>
                {prop.modalflag.action === "U" && (
                  <button onClick={deleteuser}> 삭제 </button>
                )}
                <button onClick={clopsepop}> 닫기 </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      {daimisopen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            backgroundColor: "#fff",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.26)",
            borderRadius: "8px",
          }}
        >
          <Daumpostcode onComplete={zipreturn} autoClose={false} />
          <div className="modal-button">
            <button onClick={daumclopsepop}> 닫기 </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Samplepage9popup;
