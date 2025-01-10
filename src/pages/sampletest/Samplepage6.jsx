import React, { useState } from "react";

const SamplePage6 = () => {
  const [disnum, setDisnum] = useState(1111);
  const [vid, setVid] = useState("vid");
  let [vvalue, setVvalue] = useState("초기값");
  let [stylech, setStylech] = useState(true);
  const [buttontext, setButtontext] = useState("바꾸기");
  const [proval, setProval] = useState(0);
  // const [vstyle, setStyle] = useState({'width:100Px'})

  //const disnum = 1111
  let bb = "fffff";

  bb = "5555555555555555555";

  let aa = "&&&&&&&&&&&&&&&&&";

  const changeval = (e) => {
    if (stylech) {
      setStylech(false);
      setButtontext("바꾸기");
      setDisnum(1111);
      setVid("vid");
    } else {
      setStylech(true);
      setButtontext("변경");
      setDisnum(22222);
      setVid("vvvvvid");
    }
    //alert(vvalue)
    //setStyle('{width:500Px}')
    //disnum = 222222222222222222222222
  };

  const changecheck = (e) => {
    //alert(vvalue) // 초기값
    setVvalue(e.target.value);
    //alert(vvalue + ' : ' + e.target.value) // 초기값 : t      t : ta
    //setStyle('{width:500Px}')
    //disnum = 222222222222222222222222
  };

  const proplus = (e) => {
    //alert(e.target.id)

    if (e.target.id === "plus") {
      if (proval < 100) {
        setProval(proval + 5);
      } else {
        setProval(100);
      }
    } else {
      if (proval > 0) {
        setProval(proval - 5);
      } else {
        setProval(0);
      }
    }
  };

  return (
    <div>
      <h1>React 샘플</h1>
      <br />
      {vvalue}
      <br />
      <br />
      <progress id="progressbar" max="100" value={proval}>
        {proval}%
      </progress>
      {proval}%
      <button id="plus" onClick={proplus}>
        +
      </button>
      <button id="minus" onClick={proplus}>
        -
      </button>
      <br />
      <input type="text" onChange={changecheck} value={vvalue} />
      <button
        style={{
          width: stylech ? "100px" : "200px",
          color: stylech ? "blue" : "red",
        }}
        id={vid}
        onClick={changeval}
      >
        {buttontext}
      </button>
      {disnum},{aa},{bb}
    </div>
  );
};

export default SamplePage6;
