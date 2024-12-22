import React, {useState} from "react";
import PropTypes from "prop-types";
import styles from "./Table.module.css";

export const Table = ({columns, dataSource, pagination, onSort}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(pagination?.pageSize || 10);
    const [sortConfig, setSortConfig] = useState(null);

    // Xử lý sắp xếp
    const handleSort = (key) => {
        const direction = sortConfig?.key === key && sortConfig?.direction === "asc" ? "desc" : "asc";
        setSortConfig({key, direction});
        if (onSort) onSort(key, direction);
    };

    // Sắp xếp dữ liệu
    const sortedData = [...dataSource].sort((a, b) => {
        if (!sortConfig) return 0;
        const {key, direction} = sortConfig;
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
    });

    // Dữ liệu hiển thị cho từng trang
    const paginatedData = sortedData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                <tr>
                    {columns.map((col) => (
                        <th
                            key={col.key}
                            onClick={() => col.sortable && handleSort(col.key)}
                            className={col.sortable ? styles.sortable : ""}
                        >
                            {col.title}
                            {col.sortable && (
                                <span>
                    {sortConfig?.key === col.key
                        ? sortConfig.direction === "asc"
                            ? " ▲"
                            : " ▼"
                        : " ⇅"}
                  </span>
                            )}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {paginatedData.length ? (
                    paginatedData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((col) => (
                                <td key={col.key}>{row[col.dataIndex]}</td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={columns.length} className={styles.empty}>
                            No Data
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* Pagination */}
            {pagination && (
                <div className={styles.pagination}>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>
            Page {currentPage} of {Math.ceil(dataSource.length / pageSize)}
          </span>
                    <button
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(prev + 1, Math.ceil(dataSource.length / pageSize))
                            )
                        }
                        disabled={currentPage === Math.ceil(dataSource.length / pageSize)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

// PropTypes
Table.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            dataIndex: PropTypes.string.isRequired,
            key: PropTypes.string.isRequired,
            sortable: PropTypes.bool,
        })
    ).isRequired,
    dataSource: PropTypes.arrayOf(PropTypes.object).isRequired,
    pagination: PropTypes.shape({
        pageSize: PropTypes.number,
    }),
    onSort: PropTypes.func,
};
