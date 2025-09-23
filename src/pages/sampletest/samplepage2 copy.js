import React, { useState } from 'react'

const [distime, setDistime] = useState(0)

const addtime = () => {
  setDistime(distime + 1)
}

const SamplePage2 = () => {
  return (
    <div>
      현재 시간: {distime} <br />
      <button> 더하기 </button> <button> 빼기 </button>{' '}
    </div>
  )
}

export default SamplePage2
