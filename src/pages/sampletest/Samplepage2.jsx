//   /*eslint-disale */  아래 Worning 메세지 안나옴

import React, { useState, useEffect } from "react";
import SamplePage3 from "./Samplepage3";
import Selectcomponent from "./Selectcomponent";

const SamplePage2 = () => {

  const [distime, setDistime] = useState(0);
  const [distimetwo, setDistimetwo] = useState(0);
  const [param1, setParam1] = useState("황기현");
  const [param2, setParam2] = useState("방가방가 !!!!!!!");
  let indata = "11";
  const [radioid, setRadioid] = useState("genderid");
  const [radioname, setRadioname] = useState("gendername");
  const [radiovalue, setRadiovalue] = useState("M");
  let [inputtest, setInputtest] = useState("test");
  // let [inputtest2, setInputtest2] = useState('test2')
  let [seltest, setSeltest] = useState("2");
  let [chktest, setChkest] = useState([]);

  //useEffect의 기본틀
  useEffect(
    () => {
      alert('useEffect = '+ distime);
      //distime의 값이 변경된다면 useEffect실행, [distime, ditime2] 이와같은 형식으로 여러개 사용가능
    },[distime]
  )

  const addtime = () => {
    //useState는  큐 처리 때문에 이 addtime method가 종료되어야 적용되기때문에
    //현재 도는 여기에서 변경된 distime값을 사용하는것은 불가 이게 문제니 useeffect를 사용한다
    setDistime(distime + 1);

    setParam1("황기현");
  };

  const minustime = () => {
    setDistime(distime - 1);
    setParam2("방가방가 !!!!!!!");
  };

  const reset = () => {
    //prev는 리액트가 자동으로 주는 이전값
    setDistime((prev) => {
      alert(prev);
      // indata = "22";
      return 0;
    });
  };

  // changetime = (flag) => {
  //   if (flag === 'a') {
  //    setDistime(distime + 1)
  //   } else {
  //     setDistime(distime - 1)
  //   }
  // }

  const addtime2 = () => {
    setDistimetwo(distimetwo + 1);
    setParam1("배용준");
  };

  const minustime2 = () => {
    setDistimetwo(distimetwo - 1);
    setParam2("잘생김");
  };

  const reset2 = () => {
    setDistimetwo((prev) => {
      alert(prev);
      return 0;
    });
  };

  const radiochange = () => {
    if (radiovalue === "M") {
      setRadioid("changeid");
      setRadioname("changename");
      setRadiovalue("F");
    } else {
      setRadioid("genderid");
      setRadioname("gendername");
      setRadiovalue("M");
    }
  };

  const radiovalueconf = () => {
    alert(radiovalue);
  };

  const radioclick = (e) => {
    alert(e.target.value);
    //const newval = e.target.value
    setRadiovalue(e.target.value);
  };

  const settingchk = (e, index) => {
    //let copy = chktest // 데이터가 복사 되는것이 아니고 주소 복사가 되어서 같은 값
    //console.log(copy == chktest)
    //copy[index] = e.target.value
    //console.log(e.target.value)
    //setChkest(copy) // 주소가 같은 값이면 랜더링 안됨

    let copyarr = [...chktest]; // 데이터 복사 후 새로운 저장 공간에 복사
    console.log(copyarr == chktest);

    if (e.target.checked) {
      copyarr.push(e.target.value);
    } else {
      for (let i = 0; i < copyarr.length; i++) {
        if (copyarr[i] === e.target.value) {
          console.log(index - 1); // 1(선택) -> 2(선택) -> 1(선택 해제) -> 2(선택 해제)  안됨   실제 index 0 인대 삭제 index는 1임
          copyarr.splice(i, 1);
        }
      }
    }

    chktest = [...copyarr];
    setChkest(chktest);
  };

  useEffect(() => {
    console.log("SamplePage2 useEffect  시작");
    //[]에 아무것도 쓰지않으면 onLoad때 한번만 실행됨
  }, []);

  const scomreturn = (rvalue) => {
    alert("Sampletest2 : " + rvalue);
  };

  return (
    <div>
      <h1>React 주요 특징</h1>
      <h6>
        useState 외 useEffect, React.Fragment, Fragment 등 훅 사용법은 별도로
        샘플 설명
      </h6>
      <br />
      <h6>Lifecycle 사용법, useState(Json) 형태 샘플 은 별도로 샘플 설명</h6>
      <br />
      <br />
      <br />
      <a
        href="https://codingapple.com/unit/react-if-else-patterns-enum-switch-case/"
        target="_blank" rel="noreferrer"
      >
        <h6>if 문 샘픔</h6>
      </a>
      <a href="https://codingbroker.tistory.com/123" target="_blank" rel="noreferrer">
        <h6>Looping 샘픔</h6>
      </a>
      <br />
      <br />
      시간: {distime} : {distimetwo}
      <br />
      <button onClick={addtime}> 더하기 1</button>{" "}
      <button onClick={minustime}> 빼기 1</button>{" "}
      <button onClick={reset}> reset 1</button> <br />
      <button onClick={addtime2}> 더하기 2</button>{" "}
      <button onClick={minustime2}> 빼기 2</button>{" "}
      <button onClick={reset2}> reset 2</button> <br />
      <br />
      <input type="text" id="inputtext1" name="inputtext1" value={indata} />
      <br />
      inputtext1값이 reset 눌러도 변경 안됨... useState(상태관리) 사용 해야 변경
      가능
      <br />
      ==================== 외부 componnt Call =============================
      <SamplePage3 param1={param1} param2={param2} />
      <br />
      !!!!!!!!!!!!!!!!!!! <Incomponent msg="홍길동" />
      ==================== Radio 테스트 =============================
      <br />
      <br />
      <br />
      <br />남 :{" "}
      <input
        type="radio"
        id={radioid}
        name={radioname}
        value="M"
        checked={radiovalue === "M"}
        onChange={radioclick}
      />
      여 :{" "}
      <input
        type="radio"
        id={radioid}
        name={radioname}
        value="F"
        checked={radiovalue === "F"}
        onChange={radioclick}
      />
      <br />
      <button onClick={radiochange}> 라디오값 변경</button> <br />
      <button onClick={radiovalueconf}> 라디오값 확인</button> <br />
      <br />
      <br />
      ====================== Input Test =======================
      <SamplePage3 param1="이순신" param2="장군님" />
      <br />
      <input
        type="text"
        id="inputtext"
        value={inputtest}
        name="inputtext"
        onChange={(e, prev) => {
          setInputtest(e.target.value);
          // undefined : 1233 : 123    alert 이후 setInputtest에 의해 randering 됨
          //alert(prev + " : " + e.target.value + " : " + inputtest);
        }}
      />
      {/*
      <input
        type='text'
        id='inputtext'
        value={inputtest2}
        name='inputtext'
        onChange={(e) => {
          let evntval = e
          // evntval  에러 발생
          setInputtest(
            (prev,evntval) = {
              return evntval.target.value
            },
          )

          alert(prev + ' : ' + e.target.value + ' : ' + inputtest)
        }}
      />
      */}
      <br />
      ====================== Select Test ======================= <br />
      onChange 의 setSeltest 부분을 빼면 재랜더링이 안되어 값이 안바뀜
      <br />
      <select
        id="seltest"
        name="seltest"
        value={seltest}
        onChange={(e) => {
          setSeltest(e.target.value);
        }}
      >
        <option value="">전체</option>
        <option value="1">one</option>
        <option value="2">two</option>
        <option value="3">three</option>
      </select>
      <button
        onClick={() => {
          alert(seltest);
        }}
      >
        {" "}
        Select 확인
      </button>{" "}
      <br />
      <br />
      ====================== Check Box Test ======================= <br />1 :{" "}
      <input
        type="checkbox"
        id="check1"
        name="chktest"
        value="1"
        onChange={(e) => {
          settingchk(e, 1);
          //setChkest(e.target.value)
        }}
      />
      <br />2 :{" "}
      <input
        type="checkbox"
        id="check2"
        name="chktest"
        value="2"
        onChange={(e) => {
          settingchk(e, 2);

          //setChkest(e.target.value)
        }}
      />
      <br />
      배열 내용 : {chktest}
      <br />
      <br />
      ====================== Select Box Test(Loop) ======================={" "}
      <br />
      체크박스 선택한 체크박스 값이 배열로 들어가는데, 배열의 내용으로 Select
      Box 구성
      <br />
      <select id="selectloop" name="selectloop">
        <option key="0" value="">
          전체
        </option>
        {chktest.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
      <br />
      <br />
      {chktest.map((item, index) => (
        <p>
          {item}
          <input type="radio" id={item} name={item} value={item} />
        </p>
      ))}
      <br />
      <br />
      {chktest.map((item, index) => (
        <p>
          <Selectcomponent datalist={chktest} refunc={scomreturn} />
        </p>
      ))}
      <br />
      <br />
    </div>
  );
};

//내부에서 선언된 컴포넌트 현재파일에서만 사용가능 실제로는 잘 사용하지않는다고한다 하지만 써도되는듯
function Incomponent(props) {
  return (
    <div>
      <h1>{props.msg} 방가방가!!!!!!!!!!!!!!!!</h1>
      <SamplePage3 param1="나는" param2={props.msg} />
    </div>
  );
}

export default SamplePage2;
