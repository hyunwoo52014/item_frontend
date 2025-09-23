import React, {useState, useEffect} from "react";
import Samplepage15progress from "./Samplepage15progress";

const Samplepage15compo = ({name, age}) => {

    const [disname, SetDisname] = useState(name);
    const [disage, SetDisage] = useState(age);

    useEffect(() => {
        console.log("Samplepage15compo props :", name, age);

    }, []);

    return (
        <div>
            {disname}, {disage} <br />
            <input type="text" id="testinput" name="testinput" value={disname}  onChange={ (e) => { SetDisname(e.target.value)   } }  />
            <br />
            <Samplepage15progress initvalue="90" />
            <br />

        </div>


    )
}

export default Samplepage15compo;