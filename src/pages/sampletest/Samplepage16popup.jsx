import React, {useState, useEffect} from "react";
import Postcode from './Postcode';
import Commcodeselect from "../../components/common/Commcodeselect.jsx";
import * as common from "../../components/common/commonfunction.js";

import axios from "axios";

const Samplepage16popup = (props) => {

    const [propsvar, setPropsvar] = useState({
        action : props.action,
        closeModal : props.closeModal,
    });

    const [edititm, setEdititem] = useState({
        loginID : "",
        user_type : "",
        name : "",
        password : "",
        sex : "",
        hp : "",
        email : "",
        zipcd : "",
        addr : "",
        dtladdr : "",
        loc : "",
        birthday : "",
        dupcheckflag : "N",
        imgecheck : true,
    });

    const [fileinfo,setFileinfo] = useState({
        filesel : false,
        filename : "",
        filebin : null,
        ext : "",
        size : 0,
        imageyn : false,
        preview : "",
    });

    useEffect(
        () => {
            if(props.action === "I") {

                setEdititem((prev) => (
                    {
                        ...prev,
                        loginID : "",
                        user_type : "",
                        name : "",
                        password : "",
                        sex : "",
                        hp : "",
                        email : "",
                        zipcd : "",
                        addr : "",
                        dtladdr : "",
                        loc : "",
                        birthday : "",
                        imgecheck : false,
                    }
                ));

                setFileinfo( (prev) => (
                    {
                        ...prev,
                        filesel : false,
                        filename : "",
                        filebin : [],
                        ext : "",
                        size : 0,
                        imageyn : false,
                        preview : "",
                    }));
            } else {
                // props.loginid
                const param = new URLSearchParams();
                param.append("loginID", props.loginid);

                axios.post("/usermgrreact/selectuser", param)
                    .then((res) => {
                        console.log(res.data);

                        if(res.data.result === "Y") {
                            let fileyn = true;
                            let imaheyn = true;

                            /*
                            setEdititem((prev) => (
                                {
                                    ...prev,
                                    loginID : props.loginid,
                                    user_type : res.data.userdata.user_type,
                                    name : res.data.userdata.name,
                                    password : res.data.userdata.password,
                                    sex : res.data.userdata.sex,
                                    hp : res.data.userdata.hp,
                                    email : res.data.userdata.email,
                                    zipcd : res.data.userdata.zipcd,
                                    addr : res.data.userdata.addr,
                                    dtladdr : res.data.userdata.dtladdr,
                                    loc : res.data.userdata.loc,
                                    birthday : res.data.userdata.birthday,
                                }
                            ));
                            */
                            setEdititem((prev) => (
                                {
                                    ...prev,
                                    ...res.data.userdata,
                                }
                            ));

                            if(res.data.userdata.filesize > 0) {
                                setEdititem((prev) => (
                                    {
                                        ...prev,
                                        imgecheck : true,
                                    }
                                ));

                                fileyn = true;
                                if(res.data.userdata.fileext.toLowerCase() === "jpg"
                                    || res.data.userdata.fileext.toLowerCase() === "png"
                                    || res.data.userdata.fileext.toLowerCase() === "gif") {
                                    imaheyn = true;
                                } else {
                                    imaheyn = false;
                                }

                                setFileinfo( (prev) => (
                                    {
                                        ...prev,
                                        filesel : fileyn,
                                        filename : res.data.userdata.filename,
                                        ext : res.data.userdata.fileext,
                                        size : res.data.userdata.filesize,
                                        imageyn : imaheyn,
                                    }));

                                fileaxios();

                            } else {
                                fileyn = false;
                                setEdititem((prev) => (
                                    {
                                        ...prev,
                                        imgecheck : false,
                                    }
                                ));
                                setFileinfo( (prev) => (
                                    {
                                        ...prev,
                                        filesel : false,
                                        filename : "",
                                        filebin : [],
                                        ext : "",
                                        size : 0,
                                        imageyn : false,
                                        preview : "",
                                    }));

                            }
                        } else {
                            alert(props.loginid + " 조회가 실패 했습니다.");
                        }
                    })
                    .catch((err) => {
                        console.log(err.code, err.message);
                    })
            }
        }, []
    );

    const areareturn = (code) => {

        console.log(code);
        setEdititem((prev) => (
            {
                ...prev,
                loc : code,
            }
        ));
    }

    const fileaxios = () => {
        const param = new URLSearchParams();
        param.append("loginID", props.loginid);

        axios.post("/usermgrreact/filedownload", param, { responseType: "blob" })
            .then((res) => {
                const blob = new Blob([res.data], { type: res.headers['content-type'] });
                const previewUrl = window.URL.createObjectURL(blob);
                // filebin: blob,
                setFileinfo((prev) => ({
                    ...prev,
                    preview: previewUrl,
                }));            })
            .catch((err) => {
                console.log(err.code, err.message);
            });

    }

    const setfunc = (e) => {
        const {id, value} = e.target;

        setEdititem(
            (prev) => (
                {
                    ...prev, [id]: value,
                }
            )
        );
    }

    const zipreturn = (zipcd, addr) => {
        setEdititem(
            (prev) => (
                {
                    ...prev,
                    zipcd : zipcd,
                    addr : addr,
                }
            )
        );
    }

    const selfile = (e) => {

        const filetag = e.currentTarget;

        if(filetag.files[0]) {
            const selfilename = filetag.files[0].name;   // d:\\dsdsd\a.jpd
            const fileParts = selfilename.split("\\").pop(); // 경로 제거

            const dotIndex = fileParts.lastIndexOf(".");
            const filename = fileParts.substring(0, dotIndex);
            const fileext = fileParts.substring(dotIndex + 1).toLowerCase();


            //console.log(filenamearr[0],filenamearr[1]);
            if(fileext.toLowerCase() === "jpg"
                || fileext.toLowerCase() === "png"
                || fileext.toLowerCase() === "gif") {

                setFileinfo(
                    (prev) => (
                        {
                            ...prev,
                            filesel : true,
                            filename : filename,
                            ext : fileext,
                            size : filetag.files[0].size,
                            imageyn : true,
                            filebin : filetag.files[0],
                            preview : window.URL.createObjectURL(filetag.files[0]),
                        }

                    )

                );

            } else {
                setFileinfo(
                    (prev) => (
                        {
                            ...prev,
                            filesel : true,
                            filename : filename,
                            ext : fileext,
                            size : filetag.files[0].size,
                            imageyn : false,
                            filebin : filetag.files[0],
                            preview : window.URL.createObjectURL(filetag.files[0]),
                        }

                    )

                );

            }

            setEdititem((prev) => (
                {
                    ...prev,
                    imgecheck : false,
                }
            ));

        } else {
            setFileinfo(
                (prev) => (
                    {
                        ...prev,
                        filesel : false,
                        filename : "",
                        ext : "",
                        size : 0,
                        imageyn : false,
                        filebin : "",
                    }

                )

            );
        }

    }

    const save = (e) => {
        e.preventDefault();

        console.log(edititm.imgecheck);

        const nullflag = common.nullcheck([
            {inval : edititm.loginID , msg : "loginID를 입력해 주세요."},
            {inval : edititm.user_type , msg : "사용자 유형을 입력해 주세요."},
            {inval : edititm.name , msg : "이름을 입력해 주세요."},
            {inval : edititm.password , msg : "비밀번호를 입력해 주세요."},
        ]);

        if(!nullflag) return;

        if(props.action === "I" && edititm.dupcheckflag === "N") {
            alert("중복체크 해주세요.");
            return;
        }

        const param = new FormData();
        Object.entries(edititm).forEach(([key, value]) => {
            param.append(key, value);
        });

        param.append("action",props.action);

        if (fileinfo.filebin) {
            console.log(fileinfo.filename);
            param.append("file", fileinfo.filebin);
        }

        axios.post("/usermgrreact/saveuser", param)
            .then((res) => {

                alert(res.data.resultmsg);

                if(res.data.result === "Y") {
                    // 창 닫기
                    // 부모 컴포넌트 목록 재조회

                    props.closeModal(res.data.result);
                }

            })
            .catch((err) => {
                console.log(err.code, err.message);
            });


    }

    const savedelete = (e) => {
        e.preventDefault();

        const param = new FormData();
        Object.entries(edititm).forEach(([key, value]) => {
            param.append(key, value);
        });

        param.append("action","D");


        axios.post("/usermgrreact/saveuser", param)
            .then((res) => {

                alert(res.data.resultmsg);

                if(res.data.result === "Y") {
                    // 창 닫기
                    // 부모 컴포넌트 목록 재조회
                    props.closeModal(res.data.result);
                }

            })
            .catch((err) => {
                console.log(err.code, err.message);
            });


    }

    const dupcheck = (e) => {
        e.preventDefault();

        const param = new URLSearchParams();
        param.append("loginID", edititm.loginID);

        axios.post("/usermgrreact/dupcheck",param)
            .then((res)=>{
                console.log(res.data);

                alert(res.data.resultmsg);

                setEdititem((prev) => (
                    {
                        ...prev,
                        dupcheckflag : res.data.result
                    }
                ))
            })
            .catch((err) => {
                console.log(err.code, err.message);
            });

    }

    const closeModal = (e) => {
        e.preventDefault();
        propsvar.closeModal("N");
    }

    return (
        <div>
            <form action="" method="post" id="saveForm" name="saveForm">
                <div id="userform">
                    <p className="conTitle">
                        <span>{props.action === "I" ? "사용자 등록" : "사용자 수정"}</span>
                    </p>
                    <table style={{ width: "550px", height: "350px" }}>
                        <colgroup>
                            <col width="15%" />
                            <col width="35%" />
                            <col width="15%" />
                            <col width="35%" />
                        </colgroup>
                        <tbody>
                        <tr>
                            <th>
                                {" "}
                                Login ID <span className="font_red">*</span>
                            </th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    id="loginID"
                                    name="loginID"
                                    readOnly={props.action === "I" ? false : true}
                                    value={edititm.loginID}
                                    onChange={
                                        (e) => {
                                            setfunc(e);
                                        }
                                    }
                                />
                                { props.action === "I" && <button type="button" className="btn btn-primary mx-2" onClick={(e) => dupcheck(e) } >
                                    {" "}
                                    중복체크{" "}
                                </button>}

                            </td>
                            <th>
                                {" "}
                                유형 <span className="font_red">*</span>
                            </th>
                            <td>
                                <select id="user_type" name="user_type" value={edititm.user_type}
                                        onChange={
                                            (e) => {
                                                setfunc(e);
                                            }
                                        }
                                >
                                    <option value="">선택</option>
                                    <option value="A">관리자</option>
                                    <option value="B">사용자</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                {" "}
                                이름 <span className="font_red">*</span>
                            </th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    id="name"
                                    name="name"
                                    value={edititm.name}
                                    onChange={
                                        (e) => {
                                            setfunc(e);
                                        }
                                    }
                                />
                            </td>
                            <th>
                                {" "}
                                비밀번호 <span className="font_red">*</span>
                            </th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    id="password"
                                    name="password"
                                    value={edititm.password}
                                    onChange={
                                        (e) => {
                                            setfunc(e);
                                        }
                                    }
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                {" "}
                                성별
                            </th>
                            <td>
                                <select id="sex" name="sex" value={edititm.sex}
                                        onChange={
                                            (e) => {
                                                setfunc(e);
                                            }
                                        }>
                                    <option value="">선택</option>
                                    <option value="M">남자</option>
                                    <option value="W">여자</option>
                                </select>
                            </td>
                            <th>
                                {" "}
                                연락처
                            </th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    id="hp"
                                    name="hp"
                                    value={edititm.hp}
                                    onChange={
                                        (e) => {
                                            setfunc(e);
                                        }
                                    }
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                {" "}
                                eMail
                            </th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    id="email"
                                    name="email"
                                    value={edititm.email}
                                    onChange={
                                        (e) => {
                                            setfunc(e);
                                        }
                                    }
                                />
                            </td>
                            <th>
                                {" "}
                                우편번호
                            </th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    id="zipcd"
                                    name="zipcd"
                                    value={edititm.zipcd}
                                    onChange={
                                        (e) => {
                                            setfunc(e);
                                        }
                                    }
                                    readOnly
                                />
                                <Postcode zipreturn={zipreturn} />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                {" "}
                                주소
                            </th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    id="addr"
                                    name="addr"
                                    style={{ width: "200px" }}
                                    value={edititm.addr}
                                    onChange={
                                        (e) => {
                                            setfunc(e);
                                        }
                                    }
                                    readOnly
                                />
                            </td>
                            <th>
                                {" "}
                                상세주소
                            </th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    id="dtladdr"
                                    name="dtladdr"
                                    value={edititm.dtladdr}
                                    style={{ width: "200px" }}
                                    onChange={
                                        (e) => {
                                            setfunc(e);
                                        }
                                    }
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                {" "}
                                지역
                            </th>
                            <td>

                                <Commcodeselect groupcode="areacd" selecttype="sel" defaultValue={edititm.loc} returnfunction={areareturn} />

                            </td>
                            <th>
                                {" "}
                                생년월일
                            </th>
                            <td>
                                <input
                                    type="date"
                                    className="form-control input-sm"
                                    id="birthday"
                                    name="birthday"
                                    value={edititm.birthday}
                                    onChange={
                                        (e) => {
                                            setfunc(e);
                                        }
                                    }
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                {" "}
                                사진
                            </th>
                            <td>
                                <input
                                    type="file"
                                    className="form-control input-sm"
                                    id="infile"
                                    name="infile"
                                    onChange={selfile}
                                />
                                {
                                    props.action === "U" && fileinfo.filesel && <> <input type="checkbox" id="imgecheck"  name="imgecheck" checked={edititm.imgecheck} onChange={
                                        (e) => {
                                            setEdititem( (prev) => (
                                                    {
                                                        ...prev,
                                                        imgecheck : false,
                                                    }
                                                )
                                            );
                                        }
                                    } /> 기존 파일 유지</>
                                }
                            </td>
                            <th>
                                {" "}
                                미리보기
                            </th>
                            <td>
                                <div>
                                    {
                                        fileinfo.filesel && fileinfo.imageyn  && <div><img alt="미리보기" src={fileinfo.preview} style={{ whidth : 100, height : 100}} /></div>
                                    }
                                    {
                                        fileinfo.filesel && !fileinfo.imageyn  && <div>{fileinfo.filename}</div>
                                    }
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div className="modal-button">

                        <button className="btn btn-primary mx-2" onClick={save} >
                            {" "}
                            저장{" "}
                        </button>

                        {props.action === "U" && (
                            <button className="btn btn-primary mx-2" onClick={savedelete}>
                                {" "}
                                삭제{" "}
                            </button>
                        )}
                        <button className="btn btn-primary" onClick={closeModal}>
                            {" "}
                            닫기{" "}
                        </button>
                    </div>
                </div>
            </form>

        </div>

    )

}

export default Samplepage16popup;