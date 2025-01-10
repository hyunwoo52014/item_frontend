import React, { useLayoutEffect } from 'react'
import LeftMenu from './components/common/LeftMenu'
import { useParams } from 'react-router-dom'
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const ContentSection = styled.section``;
const Wrapper = styled.div`
    padding-top: 60px; /* 헤더 높이 */
`;

const Dashboard = () => {
  console.log('Dashboard start')
  const userParam = useParams()
  
  //const [url, setUrl] = useState('')
  console.log('userParam:::' + JSON.stringify(userParam));

  useLayoutEffect(() => {
    console.log('Dashboard useEffect start')

    // if (userParam.samplePage === 'samplepage1') {
    // console.log('samplepage1 start!!!!!!!!!!')
    //    setSampletest(userParam.samplePage)
    // }

    const loginInfo = sessionStorage.getItem('loginInfo')
    if (!loginInfo) {
      alert('로그인이 필요합니다')
      //navigate('/login')
      window.location.replace('/login')
      //history.push({pathname:"/lgin"})
    }
  }, [])

  return (
    <>
      <div id='dashboard'>
        <div id='wrap_area'>
          <div id='container'>
            <ul>
              <li className='lnb'>{<LeftMenu />}</li>
              <li className='contents'>
                <div className='content'>
                <Wrapper>
                  <ContentSection style={{position: 'absolute', top: '15px', width: '950px', height:'800px'}}>
                    <Outlet />
                  </ContentSection>
                </Wrapper>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
