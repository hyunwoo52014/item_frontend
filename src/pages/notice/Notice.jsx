import React, { useState, useEffect, useRef } from 'react'
//import '../SamplePage1.css'
import axios from 'axios'
import Modal from 'react-modal'
import Pagination from '../../components/common/Pagination'
import {useSelector} from 'react-redux'


const Notice = ()=>{
  //noticeList
  const [searchKey, setSearchKey] = useState('')
  const [keyword, setKeyword] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const blockSize = 5
  const pageSize = 5
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [noticeList, setNoticeList] = useState([])

  //noticeDetail
  const [loginId, setLoginId] = useState('')
  const [noticeTitle, setNoticeTitle] = useState('')
  const [noticeContent, setNoticeContent] = useState('')
  const [noticeNo, setNoticeNo] = useState('')
  const [loginName, setLoginName] = useState('')

  // 모달
  const [modalIsOpen, setModalIsOpen] = useState(false)

  //체크박스
  const [allCheck, setAllCheck] = useState(false)
  const [noticeCheck, setNoticeCheck] = useState([])

  //보이기
  const [isRegBtn, setIsRegBtn] = useState(false)
  const [isUptBtn, setIsUptBtn] = useState(false)
  const [isDelBtn, setIsDelBtn] = useState(false)

  const [preview, setPreview] = useState('')
  const [disfilename, setDisfilename] = useState('')
  const [selfileyn, setSelfileyn] = useState(false)
  const [attfile, setAttfile] = useState({})
  const imgRef = useRef()
  const [filename, setFilename] = useState('')
  //const dispatch = useDispatch();
  const num = useSelector((state) => state)

  useEffect(() => {
    //dispatch({type:'ADD_NUM', data: 'tttt'})
    
    //console.log(sessionStorage.getItem('userNm'))
    // setSessionLoginId(sessionStorage.getItem('loginId'))
    // setSessionUserName(sessionStorage.getItem('userNm'))

    // console.log(sessionLoginId)
    // console.log(sessionUserName)
    searchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const modalStyle = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
      transform: 'translate(-50%, -50%)',
    },
  }
  
  const noticeInsert = (e) => {
    e.preventDefault()

    console.log('noticeInsert start')

    // let params = new URLSearchParams()
    //let frm = document.getElementById('noticeform')
    //frm.enctype = 'multipart/form-data'

    let params = new FormData()
    params.append('loginId', sessionStorage.getItem('loginId'))
    params.append('noticeTitle', noticeTitle)
    params.append('noticeContent', noticeContent)
    params.append('file', attfile)

    axios
      .post('/api/system/insertNotice', params)
      .then((res) => {
        console.log('insertNotice res start')
        alert('등록성공')
        closeModal()
        searchList()
      })
      .catch((err) => {
        console.log('insertNotice catch start')
        alert(err.message)
      })
  }
  const noticeCheckChange = (e, noticeNo) => {
    console.log('noticeCheckChange start')
    console.log(noticeNo)
    if (e.target.checked) {
      console.log('checked')
      let flag = true
      for (let i = 0; i < noticeCheck.length; i++) {
        if (noticeCheck[i] === noticeNo) flag = false
      }
      if (flag) {
        const updateNoticeCheck = [...noticeCheck, noticeNo]
        setNoticeCheck(updateNoticeCheck)
      }
      console.log(noticeCheck)
    } else {
      console.log('!checked')
      for (let i = 0; i < noticeCheck.length; i++) {
        if (noticeCheck[i] === noticeNo) {
          noticeCheck.splice(i, 1)
        }
      }
      console.log(noticeCheck)
    }
  }

  const noticeAllCheck = (e) => {
    console.log('noticeAllCheck')
    if (!allCheck) {
      setAllCheck(true)
      console.log(noticeList)
      let noticeNoArr = []
      for (let i = 0; i < noticeList.length; i++) {
        console.log(noticeList[i].noticeNo)
        noticeNoArr.push(noticeList[i].noticeNo)
        document.getElementsByName(
          'notice_' + noticeList[i].noticeNo,
        )[0].checked = true
      }
      setNoticeCheck(noticeNoArr)
      //let noticeNoTest=noticeNo;
      //document.getElementsByName('notice_'+noticeList[i].noticeNo)[0].checked=true;
    } else {
      setAllCheck(false)
      for (let i = 0; i < noticeList.length; i++) {
        console.log(noticeList[i].noticeNo)
        document.getElementsByName(
          'notice_' + noticeList[i].noticeNo,
        )[0].checked = false
      }
      setNoticeCheck([])
    }
  }

  const noticeUpdate = async () => {
    console.log('noticeUpdate start')

    //let params = new URLSearchParams()
    let params = new FormData()
    params.append('noticeNo', noticeNo)
    params.append('noticeTitle', noticeTitle)
    params.append('noticeContent', noticeContent)
    params.append('file', attfile)
    params.append('loginId', sessionStorage.getItem('loginId'))

    await axios
      .post('/system/noticeUpdate', params)
      .then((res) => {
        console.log('noticeUpdate res start')
        alert('수정성공')
        closeModal()
        searchList()
      })
      .catch((err) => {
        console.log('noticeUpdate catch start')
        alert(err.message)
      })
  }

  const titleOnChange = (e) => {
    console.log('titleOnChange start')
    setNoticeTitle(e.target.value)
  }
  const contentOnChange = (e) => {
    console.log('contentOnChange start')
    setNoticeContent(e.target.value)
  }

  const openModal = () => {
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  const noticeListDetail = async (noticeNo) => {
    console.log('noticeListDetail start')
    let params = new URLSearchParams()
    params.append('noticeNo', noticeNo)

    await axios
      .post('/api/system/noticeDetail.do', params)
      .then((res) => {
        console.log('noticeDetail res start')
        console.log(res)
        console.log(res.data.result.loginId)
        console.log(res.data.result.noticeTitle)
        console.log(res.data.result.noticeContent)
        console.log(res.data.result.noticeNo)
        console.log(res.data.result.userName)
        console.log('!!!!!!!!!!!!!!!!!!!! ' + res.data.result.fileName)

        setLoginId(res.data.result.loginId)
        setNoticeTitle(res.data.result.noticeTitle)
        setNoticeContent(res.data.result.noticeContent)
        setNoticeNo(res.data.result.noticeNo)
        setLoginName(res.data.result.userName)

        //const [preview, setPreview] = useState('')
        //const [selfileyn, setSelfileyn] = useState(false)
        //const [attfile, setAttfile] = useState()

        if (res.data.result.fileName === '') {
          // 파일 미첨부
          setPreview('')
          setSelfileyn(false)
          setAttfile()
          setFilename('')
        } else {
          if (
            res.data.result.fileExt === 'jpg' ||
            res.data.result.fileExt === 'png' ||
            res.data.result.fileExt === 'gif' ||
            res.data.result.fileExt === 'jpeg'
          ) {
            setSelfileyn(true) //  이미지 파일 업로드 된 경우  미리보기 처리   다운로드 URL 호출
            attachfileproc('P', noticeNo)
            //console.log(
            //  '!!!!!!!!!!!!!!!!!!!!!! ' + res.data.noticeDetail.phygical_path,
            //)
            //setPreview(res.data.result.phygical_path)
          } else {
            setSelfileyn(false) //  이미지 파일이 아닌 경우 파일명만 보여준다,
            setDisfilename(res.data.result.fileName)
          }
        }

        setFilename(res.data.result.fileName)

        console.log(res.data.result.fileName)
        console.log(res.data.result.fileLocalPath)
        console.log(res.data.result.fileRelativePath)
        console.log(res.data.result.fileSize)
        //console.log(res.data.result.file_ext)

        openModal()
        setIsRegBtn(false)
        setIsUptBtn(true)
        setIsDelBtn(true)
      })
      .catch((err) => {
        console.log('noticeDetail catch start')
        alert(err.message)
      })
  }

  const filePreview = () => {
    attachfileproc('D', noticeNo)
  }

  const attachfileproc = (ptype, noticeNo) => {
    let params = new URLSearchParams()
    params.append('noticeNo', noticeNo)

    axios
      .post('/system/noticefileDetail', params)
      .then((res) => {
        console.log('attachfileproc res start')
        console.log(res)
        //const [preview, setPreview] = useState('')
        //const [attfile, setAttfile] = useState()

        const reader = new FileReader()
        reader.readAsDataURL(new Blob([res.data]))
        reader.onloadend = (event) => {
          //alert(reader.result)
          if (ptype === 'P') {
            console.log('event.target.result : ' + event.target.result)
            //const previewImage = String(event.target.result)
            console.log(reader)
            setPreview(reader.result)
          } else {
            console.log(reader)
            let docUrl = document.createElement('a')
            docUrl.href = reader.result
            docUrl.setAttribute('download', filename)
            document.body.appendChild(docUrl)
            docUrl.click()
          }
        }

        //setPreview(window.URL.createObjectURL(new Blob([res.data])))
        //setAttfile(res.data)
      })
      .catch((err) => {
        console.log('attachfileproc catch start')
        alert(err.message)
      })
  }

  const searchList = async (cpage) => {
    console.log('searchList start')
    console.log('num:::' + num.num)
    cpage = cpage || 1
    setCurrentPage(cpage)
    console.log('cpage:::' +cpage)
    console.log('currentPage:::' + currentPage)
                
    let params = new URLSearchParams()
    params.append('option', searchKey)
    params.append('keyword', keyword)
    params.append('fromDate', fromDate)
    params.append('toDate', toDate)
    params.append('currentPage', cpage)
    params.append('pageSize', pageSize)

    await axios
      .post('/api/system/noticeList.do', params)
      .then((res) => {
        console.log('res start')
        console.log(res)
        setNoticeList(res.data.noticeList)
        setTotalCount(res.data.noticeCnt)
        setTotalPage(Math.ceil(res.data.noticeCnt / pageSize))
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const newReg = () => {
    console.log('newReg start')
    setModalIsOpen(true)
    setIsRegBtn(true)
    setIsUptBtn(false)
    setIsDelBtn(false)

    console.log(sessionStorage.getItem('loginId'))
    console.log(sessionStorage.getItem('userNm'))

    setLoginId(sessionStorage.getItem('loginId'))
    setLoginName(sessionStorage.getItem('userNm'))
    setNoticeTitle('')
    setNoticeContent('')
    setPreview('')
    setSelfileyn(false)
    setAttfile()
  }

  const noticeDelete = async () => {
    console.log('noticeDelete start')
    let params = new URLSearchParams()
    params.append('noticeNo', noticeNo)

    console.log('noticeDelete params : ' + params)

    await axios
      .post('/api/system/noticeDelete', params)
      .then((res) => {
        console.log('noticeUpdate res start')
        alert('삭제성공')
        closeModal()
        searchList()
      })
      .catch((err) => {
        console.log('noticeUpdate catch start')
        alert(err.message)
      })
  }

  const previewfunc = (e) => {
    let selfile = e.currentTarget

    console.log('previewfunc : ' + selfile.files[0])
    if (selfile.files[0]) {
      setAttfile(selfile.files[0])
      //alert(window.URL.createObjectURL(image.files[0]));
      //this.imgpath = window.URL.createObjectURL(image.files[0]);
      let filePath = selfile.value
console.log(filePath)
      //전체경로를 \ 나눔.
      let filePathSplit = filePath.split('\\')

      //전체경로를 \로 나눈 길이.
      let filePathLength = filePathSplit.length
      //마지막 경로를 .으로 나눔.
      let fileNameSplit = filePathSplit[filePathLength - 1].split('.')
      //파일명 : .으로 나눈 앞부분
      let fileName = fileNameSplit[0]
      //파일 확장자 : .으로 나눈 뒷부분
      let fileExt = fileNameSplit[1]
      //파일 크기
      let fileSize = selfile.files[0].size

      console.log('파일 경로 : ' + filePath)
      console.log('파일명 : ' + fileName)
      console.log('파일 확장자 : ' + fileExt)
      console.log('파일 크기 : ' + fileSize)

      if (
        fileExt === 'jpg' ||
        fileExt === 'png' ||
        fileExt === 'gif' ||
        fileExt === 'jpeg'
      ) {
        console.log('selfile.files[0] : ' + selfile.files[0])
        const reader = new FileReader()
        reader.readAsDataURL(selfile.files[0])
        reader.onloadend = () => {
          console.log(reader)
          setPreview(reader.result)
        }
        setSelfileyn(true)
        //setPreview(
        //  "<img src='" +
        //    window.URL.createObjectURL(selfile.files[0]) +
        //    "'  style='width: 100px; height: 100px;' />",
        //)
      } else {
        setPreview('./logo.svg')
        setSelfileyn(false)
      }
    }
  }

  return(
    <div id="notice">
    <p className="Location">
      <a href="/dashboard" className="btn_set home">home</a>
      <span className="btn_nav bold">기준정보</span>
      <span className="btn_nav bold">공지사항 관리</span>
      <a href="../system/notice" className="btn_set refresh">새로고침</a>
    </p>
    <p className="conTitle">
      <span>공지사항</span>
    </p>
    <div id="searchArea">
      <select
        id="searchKey"
        className="form-control"
        style={{width: '150px', height: '35px', marginRight: '5px'}}
        onChange={(e) => {
          setSearchKey(e.target.value)
        }}
      >
        <option value="all">전체</option>
        <option value="title">제목</option>
        <option value="content">내용</option>
      </select>
      <input
        type="text"
        className="form-control"
        style={{width: '200px', marginRight: '5px'}}
        onChange={(e) => {
          setKeyword(e.target.value)
        }}
      />

      <input
        type="date"
        className="form-control"
        style={{width: '15%', marginRight: '5px'}}
        onChange={(e) => {
          setFromDate(e.target.value)
        }}
      />
      ~
      <input
        type="date"
        className="form-control"
        style={{width: '15%', marginLeft: '5px'}}
        onChange={(e) => {
          setToDate(e.target.value)
        }}
      />
      <span className="fr">
        <button
          onClick={(e) => {searchList(currentPage)}}
          className='btn btn-primary'
          id='btnSearchGrpcod'
          name='btn'
        >
          <span> 검 색 </span>
        </button>
        <button
          className="btn btn-primary mx-2"
          onClick={newReg}
          style={{width:'80px',marginLeft: '5px'}}
          name="modal"
        >
          <span>신규등록</span>
        </button>
      </span>
    </div>
    <div style={{ marginTop: '50px' }}>
      <span>
        {totalCount !== 0 && '총 게시글: ' + totalCount}
        {currentPage !== 0 && ' / 현재 페이지 번호 : ' + currentPage}
      </span>
      <table className='col'>
        <thead>
          <tr>
            <th>
              <input
                type='checkbox'
                name='noticeAllCheck'
                checked={allCheck}
                onChange={noticeAllCheck}
              />
            </th>
            <th scope='col'> 공지번호 </th>
            <th scope='col'> 제목 </th>
            <th scope='col'> 등록일자 </th>
            <th scope='col'> 등록자ID </th> 
            <th scope='col'> 등록자명 </th>
          </tr>
        </thead>
        <tbody>
          {noticeList.map((list, index) => {
            let checkName = 'notice_' + list.noticeNo
            return (
              <tr key={list.noticeNo}>
                <td>
                  <input
                    type='checkbox'
                    name={checkName}
                    onChange={(e) => noticeCheckChange(e, list.noticeNo)}
                  />
                </td>
                <td> {list.noticeNo} </td>
                <td className="pointer-cursor" onClick={() => noticeListDetail(list.noticeNo)}>
                  
                  {list.noticeTitle}
                </td>
                <td> {list.noticeRegdate} </td> <td> {list.loginId} </td>
                <td> {list.loginName} </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {/* 페이징 처리 */}
      <Pagination
        currentPage = {currentPage}
        totalPage = {totalPage}
        blockSize = {blockSize}
        onClick  = {searchList}
      />
    </div>
    <Modal
        style={modalStyle}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
      >
        <div id='noticeform' >
          <p className="conTitle">
            <span>{isRegBtn? '공지사항 등록':'공지사항 수정'}</span>
          </p>
          <table style={{width: '550px', height: '350px'}}>
            <tbody>
              <tr>
                <th> 공지번호 </th>
                <td>
                  
                  {isDelBtn && (
                    <input
                      type='text'
                      className="form-control"
                      style={{width: '150px'}}
                      readOnly={true}
                      value={noticeNo}
                    />
                  )}
                </td>
              </tr>
              <tr>
                <th> 등록자ID </th>
                <td>
                  <input 
                  type='text' 
                  className="form-control input-sm"
                  style={{width: '150px'}}
                  readOnly={true} 
                  value={loginId} />
                </td>
              </tr>
              <tr>
                <th> 등록자명 </th>
                <td>
                  <input type='text' 
                  className="form-control input-sm" 
                  style={{width: '150px'}}
                  readOnly={true} 
                  value={loginName} />
                </td>
              </tr>
              <tr>
                <th> 제목 </th>
                <td>
                  <input
                    type='text'
                    className="form-control input-sm"
                    value={noticeTitle}
                    onChange={titleOnChange}
                  />
                </td>
              </tr>
              <tr>
                <th> 내용 </th>
                <td>
                  <textarea rows="3" className="form-control input-sm" value={noticeContent} onChange={contentOnChange} />
                </td>
              </tr>
              <tr>
                <th> 첨부파일 </th>
                <td>
                  <input
                    type='file'
                    id='regfile'
                    onChange={previewfunc}
                    ref={imgRef}
                  />
                </td>
              </tr>
              <tr>
                <th> 미리보기 </th>
                <td style={{height:'100px'}}>
                  {selfileyn && (
                    <img
                      src={preview ? preview : `./logo.svg`}
                      alt='preview'
                      onClick={filePreview}
                      className='filepreview'
                    />
                  )}
                  {!selfileyn && disfilename}
                </td>
              </tr>
            </tbody>
          </table>
          <div className='modal-button'>
            {isRegBtn && <button className="btn btn-primary mx-2" onClick={noticeInsert}> 등록 </button>}
            {isUptBtn && <button className="btn btn-primary mx-2" onClick={noticeUpdate}> 수정 </button>}
            {isDelBtn && <button className="btn btn-primary mx-2" onClick={noticeDelete}> 삭제 </button>}
            <button className="btn btn-primary" onClick={closeModal}> 닫기 </button>
          </div>
        </div>
      </Modal>
  </div>
  )
}

export default Notice;