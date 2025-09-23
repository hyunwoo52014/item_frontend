import React, { useState, useEffect } from "react";

const Samplepage15progress = (param) => {

    const [initvalue, setInitvalue] = useState(param.initvalue);


    return (
        <div>
            {initvalue}<br />
            <progress
                id="progress"
                value={initvalue}
                min="0"
                max="100"
            ></progress>
        </div>
    )
}

export default Samplepage15progress;
