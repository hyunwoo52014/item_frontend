import React, {useState, useEffect} from "react";
import Samplepage15compo from "./Samplepage15compo";
import Samplepage15progress from "./Samplepage15progress";

const Samplepage15 = () => {

    //const [name, setName] = useState("황기현");
    //const [flag, setFlag] = useState(true);
    //const [count, setCount] = useState(0);

    const [disele, setDisele] = useState({
        name : "황기현",
        flag : true,
        count : 0,
    });

    const [procount, setProcount] = useState(0);

    const [listdata, setListdata] = useState([
        { name : "홍길동", age : 10, gender : "M" },
        { name : "이만기", age : 20, gender : "W" },
        { name : "이소룡", age : 40, gender : "M" },
    ]);

    const [testinput, setTestinput] = useState("황기현");

    useEffect(() => {
        // alert("Mount !!!!!!!!!");
    },[]);

    useEffect(() => {
        let dusname = "";

        if(disele.flag) {
            dusname = "황기현";
        } else {
            dusname = "홀길동";
        }

        //setName( (old) => {
        //        return dusname;
        //    }
        //);

        setDisele( (old) => (
            {
                ...old,
                name : dusname,
            }
        ));

        // console.log(dusname);
        // console.log(disele.name);

    },[disele.flag]);

    useEffect(() => {
        console.log(" disele.name change",disele.name);
    }, [disele.name]);


    const buttonclick = () => {
        // alert("버튼 누름");
        // setName("홍길동");
        setDisele( (old) => (
            {
                ...old,
                flag : !disele.flag
            }

        ));
    }

    const add = () => {
        console.log("add start !!!!!!!!!");

        setDisele((old) => (
            {
                ...old,
                count : ++disele.count
            }
        ));

        /*
        setCount((oldnum) => {
            return ++oldnum;
        });
        */
    }

    const minus = () => {
        console.log("minus start !!!!!!!!!");

        setDisele((old) => (
            {
                ...old,
                count : --disele.count
            }
        ));

        /*
        setCount((oldnum) => {
            return --oldnum;
        });
        */
    }


    return (
        <div>
            Samplepage15 !!!!! <br />
            <button onClick={buttonclick}>바꾸기</button> <br />
            {disele.name} <br />
            {disele.count} <button onClick={add}>+</button>
            <button onClick={minus}>-</button> <br />
            { disele.flag ? "황기현 " : "홍길동 " }
            { disele.flag ? <input type='text' id='trueinput' />  : <input type='text' id='falseinput' /> }

            <br />
            <progress
                id="progress"
                value={procount}
                min="0"
                max="100"
            ></progress>
            {procount}
            <button onClick={() => {  setProcount( (oldcount) => oldcount + 1 )    }}>더하기</button>
            <button onClick={() => {  setProcount( (oldcount) => oldcount - 1 )    }}>빼기</button> <br />
            <br />

            <table>
                <tbody>
                {
                    listdata.map( (item,index) => {
                            return (
                                <tr>
                                    <td>{item.name}</td>
                                    <td>{item.age}</td>
                                    <td>{item.gender === "M" ? "남자" : "여자"}</td>
                                </tr>
                            )
                        }
                    )
                }
                </tbody>
            </table>
            <br />

            <input type="text" id="testinput" name="testinput" value={testinput}  onChange={ (e) => { setTestinput(e.target.value)   } }  />
            <br />
            Samplepage15compo <br />
            <Samplepage15compo name={disele.name} age="30"/>
            <Samplepage15compo name="대한민국" age="50" />

            <br />
            <Samplepage15progress  initvalue="50" />
            <Samplepage15progress  initvalue="80" />
        </div>

    )
}

export default Samplepage15;