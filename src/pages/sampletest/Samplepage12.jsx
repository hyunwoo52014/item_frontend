import React, { useState } from "react";
import "./SamplePage12.css";
import axios from "axios";

function TreeTable() {
  const [expandedRows, setExpandedRows] = useState({});
  const [filteredData, setFilteredData] = useState({
    empList: [],
    totalcnt: 0,
    /*
    pagenumcnt: 0,
    emp_no: "",
    emp_name: "",
    dept_cd: "",
    dept_name : "",
    reg_date : ""
    */
  }); // 검색조건
  const [filters, setFilters] = useState({
    search: "",
    type: "All",
    date: "",
  });

  //부서 공통코드
  const [searchDept, setSearchDept] = useState({
    deptCd: "",
    deptNm: "All",
  });
  
  const onPageLoad = (() => {
    //조회조건

  },[])

  //공통코드 조회 *공통코드 테이블 사용하지않고 내가만든거 쓰느라 그지같은 분기로 만듬
  const searchTypeList = async (typeUrl, typeCode) => {
    let params = new URLSearchParams();
    params.append("emp_name", filters.search);

    await axios
      .post("/system/listdetailcode", params)
      .then((res) => {
        console.log("result console : " + JSON.stringify(res));
        setFilteredData({
          ...filteredData,
          empList: res.data.empInfolist,
          totalcnt: res.data.totalcnt
        });
      })
      .catch((err) => {
        console.log("list error");
        alert(err.message);
      });
  }

  const searchlist = async () => {

    let params = new URLSearchParams();
    params.append("emp_name", filters.search);
    params.append("dept_cd", filters.type);
    params.append("pagesize", 100);
    params.append("cpage", 1);

    await axios
      .post("/emp/empInfolist", params)
      .then((res) => {
        //setTotalcnt(res.data.listcnt);
        //setNoticelist(res.data.listdata);
        //console.log("result console : " + res);
        console.log("result console : " + JSON.stringify(res));
        console.log(
          "result console : " +
            res.data.totalcnt +
            " : " +
            JSON.stringify(res.data.listdate) +
            " : " +
            JSON.stringify(res.status) +
            " : " +
            JSON.stringify(res.statusText)
        );
        setFilteredData({
          ...filteredData,
          empList: res.data.empInfolist,
          totalcnt: res.data.totalcnt
        });
      })
      .catch((err) => {
        console.log("list error");
        alert(err.message);
      });
      
  };
//최상위를 클릭하면 emp_no 위치에 최상위의 id값이 오게되고 하위 애들을 render에서 그림
  const toggleRow = (emp_no) => {
    setExpandedRows((prev) => ({
      ...prev,
      [emp_no]: !prev[emp_no],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDate = (reg_date) => {
    // 연도, 월, 일 부분을 슬라이싱
    const year = reg_date.slice(0, 4);  // 처음 4자리: 연도
    const month = reg_date.slice(4, 6); // 5~6번째 자리: 월
    const day = reg_date.slice(6, 8);   // 7~8번째 자리: 일

    // 원하는 포맷으로 결합
    return `${year}-${month}-${day}`;
  }

  const handleSearch = () => {
    //const { search, type, date } = filters;
    console.log('pre list console');
    searchlist();
  };

  const renderRows = (nodes, level = 0) => {

    return nodes.map((node) => (
     <React.Fragment key={node.emp_no}>
        <tr className="bg-white hover:bg-gray-50">
          <td className={`px-4 py-2 ${level > 0 ? `pl-${level * 6}` : ""}`}>
            {node.boardVoList && (
              <button
                onClick={() => toggleRow(node.dept_cd)}
                className="mr-2 text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                {expandedRows[node.dept_cd] ? "▼" : "▶"}
              </button>
            )}
            {node.dept_name}
          </td>
          <td className="px-4 py-2 text-gray-700">{node.fraction_yn === 'N' ? node.emp_no : ''}</td>
          <td className="px-4 py-2 text-gray-700">{node.emp_name}</td>
            <td className="px-4 py-2 text-gray-500">{node.fraction_yn === 'N' ? formatDate(node.reg_date) : ''}</td>
        </tr>
        {node.boardVoList &&
          expandedRows[node.dept_cd] &&
          renderRows(node.boardVoList, level + 1)}
     </React.Fragment>
    ));
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">사원관리</h1>

      {/* 검색 조건 영역 */}
      <div className="bg-white p-4 shadow-md rounded-md mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">사원명</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter name"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">부서</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="All">All</option>
              <option value="Folder">Folder</option>
              <option value="File">File</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Filter by Date:</label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* 테이블 영역 */}
      <div className="overflow-x-auto bg-white shadow-md rounded-md">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left text-gray-700">부서명</th>
              <th className="px-4 py-2 text-left text-gray-700">사원번호</th>
              <th className="px-4 py-2 text-left text-gray-700">이름</th>
              <th className="px-4 py-2 text-left text-gray-500">등록일</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.empList.length > 0 ? (
              renderRows(filteredData.empList)
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TreeTable;
/*
export default function App() {

  
  const sampleData2 = [
    {
      id: 1,
      name: "Root 1",
      type: "Folder",
      updatedAt: "2025-01-16",
      children: [
        {
          id: 2,
          name: "Child 1.1",
          type: "File",
          updatedAt: "2025-01-15",
        },
        {
          id: 3,
          name: "Child 1.2",
          type: "Folder",
          updatedAt: "2025-01-14",
          children: [
            {
              id: 4,
              name: "Child 1.2.1",
              type: "File",
              updatedAt: "2025-01-13",
            },
          ],
        },
      ],
    },
    {
      id: 5,
      name: "Root 2",
      type: "File",
      updatedAt: "2025-01-12",
    },
  ];

  return <TreeTable data={sampleData} />;
}
*/