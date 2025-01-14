import React, { useEffect, useState } from "react";
import axios from "axios";

const Commcodeselect = ({
  groupcode,
  selecttype,
  defaultValue,
  returnfunction,
}) => {
  const [listdata, setListdata] = useState({
    listitem: [],
    totalcnt: 0,
    selvalue: "",
  });

  const selreturn = (e) => {
    setListdata((prev) => ({ ...prev, selvalue: e.target.value }));

    returnfunction(e.target.value);
  };

  useEffect(() => {
    if (defaultValue) {
      setListdata((prev) => ({ ...prev, selvalue: defaultValue }));
    }
  }, [defaultValue]);

  useEffect(() => {
    const param = new URLSearchParams();
    param.append("cpage", 1);
    param.append("pagesize", 99999);
    param.append("groupcode", groupcode);

    axios
      .post("/system/listdetailcode", param)
      .then((res) => {
        console.log(res);

        setListdata((prev) => ({
          ...prev,
          listitem: res.data.commcodeModel,
          totalcnt: res.data.totalcnt,
        }));
      })
      .catch((err) => {
        console.log("iddupcheck catch start");
        alert(err.message);
      });
  }, [groupcode]);

  return (
    <select value={listdata.selvalue} onChange={selreturn}>
      {selecttype === "all" && <option value="">전체</option>}
      {selecttype === "sel" && <option value="">선택</option>}
      {listdata.listitem.map((item, index) => {
        return (
          <option key={index} value={item.detail_code}>
            {item.detail_name}
          </option>
        );
      })}
    </select>
  );
};

export default Commcodeselect;
