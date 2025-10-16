import React, {useEffect, useState} from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import customCss from "../../pages/requests/css_custom/forHistory.module.css"
import { ko } from "date-fns/locale/ko";


const HistorySearchUser = ({searchElement, updateElement, changeElement, searchHandler}) => {

    const [isVisible, setIsVisible] = useState({
        Date : false,
        Title : false,
        Status : false,
    });

    const [statusList, setStatusList] = useState([]);
    const [startDate, setStartDate] = useState(new Date());

    const changeDate = (date) => {
        setStartDate(date);
    }

    useEffect(() => {
        switch (searchElement.searchMajorSel.toUpperCase()) {
            case "itProduct".toUpperCase():
                setIsVisible({
                    Date : false,
                    Title : true,
                    Status : false,
                });
                break;
            case "status".toUpperCase():
                setIsVisible({
                    Date : false,
                    Title : false,
                    Status : true,
                });
                break;
            case "rentalDate".toUpperCase():
                setIsVisible({
                    Date : true,
                    Title : false,
                    Status : false,
                });
                break;
            case "returnDate".toUpperCase():
                setIsVisible({
                    Date : true,
                    Title : false,
                    Status : false,
                });
                break;
            default:
                setIsVisible({
                    Date : false,
                    Title : false,
                    Status : false,
                });
                break;
        }

    },[searchElement.searchMajorSel]);


    useEffect(()=> {
        updateElement((prev)=>(
            {
                ...prev,
                searchSubSel : startDate.getTime(),
            }
        ))
    }, [startDate]);



    useEffect(()=>{
        if(searchElement.searchMajorSel === "status") {
            updateElement((prev)=>(
                {
                    ...prev,
                    searchSubSel: "Y",
                }
            ))
        }
    }, [searchElement.searchMajorSel]);

    useEffect(() => {
        axios.post("/requests/statusCodeList")
            .then((res) => {
                setStatusList(res.data);
           })
            .catch((err) => {

            })
    },[])

    const clickButtonEvent = (e) => {
        e.preventDefault();
        searchHandler();
    };

    return (
        <span className="fr" style={{display: "flex", justifyContent: "space-between"}}>
            <select id="searchMajorSel" name="searchMajorSel" style={{width: "100px"}}
                    value={searchElement.searchMajorSel} onChange={changeElement}
            >
                <option value="" defaultValue>전체</option>
                <option value="itProduct">IT 장비</option>
                <option value="rentalDate">대여일</option>
                <option value="returnDate">반납일</option>
                <option value="status">상태</option>
            </select>
            <span className={customCss.datepickerWrapper}>
                {
                    isVisible.Date ?
                    <DatePicker selected={startDate} onChange={(date) => changeDate(date)}
                                maxDate={new Date()} dateFormat="yyyy-MM-dd" className={customCss.datepickerInput} locale={ko}
                                isClearable showMonthYearDropdown={false}/>
                    :
                    null
                }
            </span>
            <span>
                {
                    isVisible.Title ?
                    <input type="text" style={{width: "300px", height: "30px", display: isVisible.Title ? "inline-block": "none"}}
                       id="searchTitle" name="searchTitle"
                       value={searchElement.searchTitle} onChange={changeElement}/>
                    :
                    null
                }
            </span>
            <span>
                {
                    isVisible.Status ?

                    <select value={searchElement.searchSubSel} id="searchStatus" name="searchSubSel" onChange={changeElement}>
                        {
                            statusList.map(item => (
                                <option key={item.code} value={item.code}>
                                    {item.value}
                                </option>
                            ))
                        }
                    </select>
                    :
                    null
                }
            </span>

            <a href="" className="btnType blue" id="btnSearchword" name="searchword"
               onClick={(e)=>clickButtonEvent(e)}>
                <span>검 색</span>
            </a>
        </span>
    )

}
export default HistorySearchUser;