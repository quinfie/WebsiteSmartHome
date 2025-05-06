import React from "react";

const TableView = ({ headers, data, onEdit, onDelete }) => {
  return (
    <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header} className="px-4 py-2 border-b bg-gray-100 text-left font-semibold">
              {header}
            </th>
          ))}
          <th className="px-4 py-2 border-b bg-gray-100 text-left font-semibold">Hành Động</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            {Object.values(row).map((val, i) => (
              <td key={i} className="px-4 py-2 border-b">{val}</td>
            ))}
            <td className="px-4 py-2 border-b">
              <button
                onClick={() => onEdit(row)}
                className="bg-cyan-400 hover:bg-cyan-500 text-white px-3 py-1 rounded mr-2"
              >
                Chỉnh Sửa
              </button>
              <button
                onClick={() => onDelete(row)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Xóa
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableView;
