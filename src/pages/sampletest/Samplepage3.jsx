import React, { useState } from 'react'

const SamplePage3 = (props) => {
  const [disnum] = useState(1111)

  return (
    <div id='samplePage3'>
      samplePage3 : {props.param1} {props.param2} {disnum}
    </div>
  )
}

export default SamplePage3
