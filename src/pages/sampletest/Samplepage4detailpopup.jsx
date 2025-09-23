import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./SamplePage1.css";
import * as commonjs from "../../components/common/commonfunction.js";

const Samplepage4detailpopup = ({
  action,
  detailcode,
  detailclosemodal,
  group_code,
  title,
}) => {
  const [detaileditdata, setDetaileditdata] = useState({
    group_name: "",
    detail_code: "",
    detail_name: "",
    note: "",
    useyn: "Y",
    readonly: false,
  });

  const groupcodselect = (grpcd) => {
    const param = new URLSearchParams();
    param.append("groupcode", grpcd);

    axios
      .post("/system/selectgroupcode", param)
      .then((res) => {
        console.log(res);
        //res.data.commcodeModel
        setDetaileditdata((prev) => ({
          ...prev,
          group_name: res.data.commcodeModel.group_name,
        }));
      })
      .catch((err) => {
        console.log("noticeUpdate catch start");
        alert(err.message);
      });
  };

  const detailcodselect = useCallback(
    (grpcd) => {
      const param = new URLSearchParams();
      param.append("groupcode", grpcd);
      param.append("detailcode", detailcode);

      axios
        .post("/system/selectdetailcode", param)
        .then((res) => {
          console.log(res);
          setDetaileditdata((prev) => ({
            ...prev,
            detail_code: res.data.commcodeModel.detail_code,
            detail_name: res.data.commcodeModel.detail_name,
            note: res.data.commcodeModel.note,
            useyn: res.data.commcodeModel.use_yn,
            readonly: true,
          }));
        })
        .catch((err) => {
          console.log("noticeUpdate catch start");
          alert(err.message);
        });
    },
    [detailcode]
  );

  const save = (flag) => {
    const checklist = [
      { inval: detaileditdata.detail_code, msg: "살세 코드를 입력해 주세요" },
      {
        inval: detaileditdata.detail_name,
        msg: "상세 코드 명를 입력해 주세요",
      },
    ];

    if (!commonjs.nullcheck(checklist)) return;

    const param = new URLSearchParams();
    param.append("igroupcode", group_code);
    param.append("idetailcode", detaileditdata.detail_code);
    param.append("idetailname", detaileditdata.detail_name);
    param.append("idnote", detaileditdata.note);
    param.append("iduseyn", detaileditdata.useyn);

    if (flag === "D") {
      param.append("action", flag);
    } else {
      param.append("action", action);
    }

    axios
      .post("/system/savedetailcode", param)
      .then((res) => {
        console.log(res);

        if (res.data.result === "SUCCESS") {
          if (flag === "D") {
            alert("삭제 되었습니다.");
          } else {
            alert("저장 되었습니다.");
          }
        }

        closepop(true);
      })
      .catch((err) => {
        console.log("noticeUpdate catch start");
        alert(err.message);
      });
  };

  const del = () => {
    save("D");
  };

  const closepop = (flag) => {
    flag = flag || false;

    console.log("samplepage4popup detailclosemodal  flag : ", flag);

    detailclosemodal(flag);
  };

  // onLoad
  useEffect(() => {
    groupcodselect(group_code);

    if (action === "I") {
      setDetaileditdata((prev) => ({
        ...prev,
        detail_code: "",
        detail_name: "",
        note: "",
        useyn: "Y",
        readonly: false,
      }));
    } else {
      detailcodselect(group_code);
    }
  }, [action, group_code, detailcode, detailcodselect]);

  return (
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
              <span>{title}</span>
            </p>
          </td>
        </tr>
        <tr>
          <th style={{ padding: "30px" }}>그룹 코드</th>
          <td>
            <input
              type="text"
              id="group_code"
              name="group_code"
              value={group_code}
              readOnly
            />
          </td>
          <th style={{ padding: "30px" }}>그룹 코드 명</th>
          <td>
            <input
              type="text"
              id="group_name"
              name="group_name"
              value={detaileditdata.group_name}
              readOnly
            />
          </td>
        </tr>
        <tr>
          <th style={{ padding: "30px" }}>상세 코드</th>
          <td>
            <input
              type="text"
              id="detail_code"
              name="detail_code"
              value={detaileditdata.detail_code}
              readOnly={detaileditdata.readonly}
              onInput={(e) => {
                setDetaileditdata((prevdetaileditdata) => ({
                  ...prevdetaileditdata,
                  detail_code: e.target.value,
                }));
              }}
            />
          </td>
          <th style={{ padding: "30px" }}>상세 코드 명</th>
          <td>
            <input
              type="text"
              id="detail_name"
              name="detail_name"
              value={detaileditdata.detail_name}
              onInput={(e) => {
                setDetaileditdata((prevdetaileditdata) => ({
                  ...prevdetaileditdata,
                  detail_name: e.target.value,
                }));
              }}
            />
          </td>
        </tr>
        <tr>
          <th style={{ padding: "30px" }}>내용</th>
          <td colSpan={3}>
            <textarea
              id="note"
              name="note"
              value={detaileditdata.note}
              cols="20"
              rows="3"
              onChange={(e) => {
                setDetaileditdata((prevdetaileditdata) => ({
                  ...prevdetaileditdata,
                  note: e.target.value,
                }));
              }}
            ></textarea>
          </td>
        </tr>
        <tr>
          <th style={{ padding: "30px" }}>사용 유무</th>
          <td colSpan={3}>
            사용{" "}
            <input
              type="radio"
              id="usey"
              name="useyn"
              value="Y"
              checked={detaileditdata.useyn === "Y"}
              onChange={(e) => {
                setDetaileditdata((prevgroupeditdata) => ({
                  ...prevgroupeditdata,
                  useyn: e.target.value,
                }));
              }}
            />
            미사용{" "}
            <input
              type="radio"
              id="usen"
              name="useyn"
              value="N"
              checked={detaileditdata.useyn === "N"}
              onChange={(e) => {
                setDetaileditdata((prevgroupeditdata) => ({
                  ...prevgroupeditdata,
                  useyn: e.target.value,
                }));
              }}
            />
          </td>
        </tr>
        <tr>
          <td colSpan={4}>
            <div className="modal-button">
              <button onClick={save}> 저장 </button>
              <button onClick={del}> 삭제 </button>
              <button onClick={closepop}> 닫기 </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Samplepage4detailpopup;
