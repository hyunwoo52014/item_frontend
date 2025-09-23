
const HistoryModal = () => {
    return (
        <div id="historyModal" className="layerPop layerType2" style={{width: "700px"}}>
            <dl>
                <dt>
                    <strong>IT 자산 히스토리 상세</strong>
                </dt>
                <dd className="content">
                    <table className="row">
                        <caption>caption</caption>
                        <colgroup>
                            <col width="120px"/>
                            <col width="*"/>
                            <col width="120px"/>
                            <col width="*"/>
                        </colgroup>
                        <tbody>
                        <tr>
                            <th scope="row">사용신청일</th>
                            <td colSpan="3"><input type="text" className="inputTxt p100" id="orderDate"
                                                   name="orderDate"
                                                   readOnly/></td>
                        </tr>
                        <tr>
                            <th scope="row">대여인 소속</th>
                            <td><input type="text" className="inputTxt p100" name="team" id="team"
                                       readOnly/></td>
                            <th scope="row">대여인</th>
                            <td><input type="text" className="inputTxt p100" name="name" id="name"
                                       readOnly/></td>
                        </tr>
                        <tr>
                            <th scope="row">대여장비</th>
                            <td colSpan="3"><input type="text" className="inputTxt p100" name="productName"
                                                   id="productName"
                                                   readOnly/></td>
                        </tr>
                        <tr>
                            <th scope="row">제품상세번호</th>
                            <td colSpan="3"><input type="text" className="inputTxt p100"
                                                   name="productDetailCode" id="productDetailCode"
                                                   readOnly/></td>
                        </tr>
                        <tr>
                            <th scope="row">대여시작일</th>
                            <td><input type="text" className="inputTxt p100" id="rentalDate" name="rentalDate"
                                       readOnly/></td>
                            <th scope="row">대여마감일</th>
                            <td><input type="text" className="inputTxt p100" id="returnDate" name="returnDate"
                                       readOnly/></td>
                        </tr>
                        <tr>
                            <th scope="row">기타사항(메모,비고)</th>
                            <td colSpan="3"><input type="text" className="inputTxt p100" style={{height: "150px"}}
                                                   name="orderReason" id="orderReason"
                                                   readOnly/></td>
                        </tr>
                        </tbody>
                    </table>

                    <div className="btn_areaC mt30">
                        <a href="" className="btnType blue" id="btnDelete" name="btn"
                           style={{display: "none"}}><span>폐기</span></a>
                        <a href="" className="btnType gray" id="btnClose" name="btn"><span>닫기</span></a>
                    </div>
                </dd>
            </dl>
        </div>
    );
}

export default HistoryModal;