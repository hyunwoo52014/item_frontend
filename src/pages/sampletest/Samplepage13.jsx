import React, { useState } from "react";
import "./SamplePage12.css";
import axios from "axios";

function TreeTable({ data }) {
  const [expandedRows, setExpandedRows] = useState({});
  const [filteredData, setFilteredData] = useState(data); // 필터링된 데이터
  const [filters, setFilters] = useState({
    search: "",
    type: "All",
    date: "",
  });

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    const { search, type, date } = filters;

    const filterData = (nodes) => {
      return nodes
        .filter((node) => {
          const matchesSearch = node.name.toLowerCase().includes(search.toLowerCase());
          const matchesType = type === "All" || node.type === type;
          const matchesDate = !date || node.updatedAt === date;
          return matchesSearch && matchesType && matchesDate;
        })
        .map((node) => ({
          ...node,
          children: node.children ? filterData(node.children) : [],
        }))
        .filter((node) => node.children.length > 0 || !node.children); // 빈 부모 필터 제거
    };

    setFilteredData(filterData(data));
  };

  const renderRows = (nodes, level = 0) => {
    return nodes.map((node) => (
      <React.Fragment key={node.id}>
        <tr className="bg-white hover:bg-gray-50">
          <td className={`px-4 py-2 ${level > 0 ? `pl-${level * 6}` : ""}`}>
            {node.children && (
              <button
                onClick={() => toggleRow(node.id)}
                className="mr-2 text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                {expandedRows[node.id] ? "▼" : "▶"}
              </button>
            )}
            {node.name}
          </td>
          <td className="px-4 py-2 text-gray-700">{node.type}</td>
          <td className="px-4 py-2 text-gray-500">{node.updatedAt}</td>
        </tr>
        {node.children &&
          expandedRows[node.id] &&
          renderRows(node.children, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Code Management</h1>

      {/* 검색 조건 영역 */}
      <div className="bg-white p-4 shadow-md rounded-md mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Search by Name:</label>
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
            <label className="block text-gray-700 mb-1">Filter by Type:</label>
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
              <th className="px-4 py-2 text-left text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-gray-700">Type</th>
              <th className="px-4 py-2 text-left text-gray-700">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              renderRows(filteredData)
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

export default function App() {
  const sampleData = [
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
