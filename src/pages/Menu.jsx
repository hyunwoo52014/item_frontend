import { Link } from 'react-router-dom';

const Menu = ()=>{
  return(
    <>
      <h3 className="hidden">lnb 영역</h3>
      <div id="lnb_area">
        <div className="logo">
          <div id="header">
            <Link to='/Layout'>Main</Link>
          </div>
        </div>
      </div>
      <div className="login">
        <img
          src="/src/assets/images/admin/comm/left_myImg.jpg"
          className="LoginImg"
          alt="사진"
        />
        <span className="LoginName">홍길동</span>
        <div className="btn_loginArea">
          <a href="#!" className="logout" name="modal"><span>LOGOUT</span></a>
        </div>
      </div>
      <ul className="lnbMenu">
      <li>
          <dl>
            <dt>
              <a
                className="lnbBtn menu005"
                href="#!"
                >메뉴명
              </a>
            </dt>
          </dl>
        </li>
      </ul>
    </>
  )
}

export default Menu;