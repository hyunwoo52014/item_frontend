import React, { useState, useEffect } from "react";

const SamplePage5 = (props) => {
  const [myname, setMyname] = useState("테스트");
  const [myname2, setMyname2] = useState(true);

  const btnclickfunc = () => {
    if (myname === "테스트") {
      setMyname("값변경");
      setMyname2(false);
    } else {
      setMyname("테스트");
      setMyname2(true);
    }

    alert(myname + " : " + myname2);
  };

  const btnvaluecheck = (e) => {
    alert(myname + " : " + myname2 + " : " + e.target.id);
  };

  useEffect(() => {
    alert(" Onload ");
  }, []);

  useEffect(() => {
    alert("myname change : " + myname);
  }, [myname]);

  return (
    <div id="samplePage6">
      <h1>useEffect, useState</h1>
      {myname}{" "}
      <button id="btnid" name="btnid" onClick={btnclickfunc}>
        Click
      </button>
      <button id="btnid2" name="btnid2" onClick={btnvaluecheck}>
        값 확인
      </button>
      {[1, 2, 3].reduce((a, c) => a + c, 0)}
      <div>
        {myname2 && myname} {!myname2 && myname}
        체크박스 <input type="checkbox" checked={myname2} />
      </div>
      <div>
        {myname2 && <input type="text" id="trueinput" />}{" "}
        {!myname2 && <input type="radio" id="trueinput" />}
      </div>
    </div>
  );
};

export default SamplePage5;
