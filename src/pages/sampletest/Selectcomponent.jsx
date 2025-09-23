import React from 'react'

const Selectcomponent = ({ datalist, refunc }) => {
  console.log('!!!!!!!!!! : ' + datalist)
  console.log('!!!!!!!!!! : ' + refunc)

  const dl = [...datalist]

  const returnval = (e) => {
    //alert(e.target.value)
    refunc(e.target.value)
  }

  return (
    <div>
      SamplePage4 open <br />
      <select id='dynmaicsel' name='dynmaicsel' onChange={returnval}>
        <option key='0' value=''>
          전체
        </option>
        {dl.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Selectcomponent
