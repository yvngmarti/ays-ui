import { useState, useEffect } from "react";
import "./Table.css";

export type TableColumn = {
  key: string;
  title: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, record: any) => React.ReactNode;
};

export type TableProps = {
  columns: TableColumn[];
  data: any[];
  className?: string;
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (record: any) => void;
  emptyText?: string;
  onEdit?: (record: any, newData: any) => void;
  onDelete?: (record: any) => void;
};

type EditingState = {
  isEditing: boolean;
  record: any | null;
  values: any;
};

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  className = "",
  striped = false,
  bordered = false,
  hoverable = false,
  compact = false,
  pagination = false,
  pageSize = 10,
  onRowClick,
  emptyText = "No hay datos disponibles",
  onEdit,
  onDelete,
}) => {
  const [sortedData, setSortedData] = useState<any[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending" | null;
  }>({ key: "", direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [editing, setEditing] = useState<EditingState>({
    isEditing: false,
    record: null,
    values: {},
  });

  useEffect(() => {
    const sortableData = [...data];
    if (sortConfig.key && sortConfig.direction) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    setSortedData(sortableData);
  }, [data, sortConfig]);

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" | null = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else if (
      sortConfig.key === key &&
      sortConfig.direction === "descending"
    ) {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  const getSortDirectionIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

  const tableClasses = [
    "custom-table",
    striped ? "striped" : "",
    bordered ? "bordered" : "",
    hoverable ? "hoverable" : "",
    compact ? "compact" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Pagination logic
  const totalPages = pagination ? Math.ceil(sortedData.length / pageSize) : 1;
  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (!pagination || totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-button ${currentPage === i ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          className="pagination-button"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          &lt;
        </button>
        {pages}
        <button
          className="pagination-button"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          &gt;
        </button>
      </div>
    );
  };

  const startEditing = (record: any) => {
    setEditing({
      isEditing: true,
      record,
      values: { ...record },
    });
  };

  const cancelEditing = () => {
    setEditing({
      isEditing: false,
      record: null,
      values: {},
    });
  };

  const handleEditChange = (key: string, value: any) => {
    setEditing((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [key]: value,
      },
    }));
  };

  const confirmEdit = () => {
    if (onEdit && editing.record && editing.values) {
      onEdit(editing.record, editing.values);
      cancelEditing();
    }
  };

  const confirmDelete = (record: any) => {
    if (onDelete) {
      onDelete(record);
    }
  };

  return (
    <div className="table-container">
      <table className={tableClasses}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{ width: column.width }}
                className={column.sortable ? "sortable" : ""}
                onClick={
                  column.sortable ? () => requestSort(column.key) : undefined
                }
              >
                {column.title}{" "}
                {column.sortable && (
                  <span className="sort-icon">
                    {getSortDirectionIcon(column.key)}
                  </span>
                )}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th
                style={{
                  width: "120px",
                  cursor: "default",
                  userSelect: "none",
                }}
              >
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((record, index) => (
              <tr
                key={index}
                onClick={
                  onRowClick && !editing.isEditing
                    ? () => onRowClick(record)
                    : undefined
                }
                className={`
                  ${onRowClick && !editing.isEditing ? "clickable" : ""}
                  ${
                    editing.isEditing && editing.record?.id === record.id
                      ? "editing-row"
                      : ""
                  }
                  ${
                    editing.isEditing && editing.record?.id !== record.id
                      ? "dimmed-row"
                      : ""
                  }
                `}
              >
                {columns.map((column) => (
                  <td key={`${index}-${column.key}`}>
                    {editing.isEditing && editing.record?.id === record.id ? (
                      <input
                        type="text"
                        value={editing.values[column.key] || ""}
                        onChange={(e) =>
                          handleEditChange(column.key, e.target.value)
                        }
                        className="edit-input"
                      />
                    ) : column.render ? (
                      column.render(record[column.key], record)
                    ) : (
                      record[column.key]
                    )}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="actions-cell">
                    {editing.isEditing && editing.record?.id === record.id ? (
                      <>
                        <button
                          className="action-button confirm"
                          onClick={confirmEdit}
                        >
                          ✓
                        </button>
                        <button
                          className="action-button cancel"
                          onClick={cancelEditing}
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <>
                        {onEdit && (
                          <button
                            className="action-button edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(record);
                            }}
                          >
                            ✎
                          </button>
                        )}
                        {onDelete && !editing.isEditing && (
                          <button
                            className="action-button delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete(record);
                            }}
                          >
                            🗑
                          </button>
                        )}
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={
                  onEdit || onDelete ? columns.length + 1 : columns.length
                }
                className="empty-text"
              >
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {renderPagination()}
    </div>
  );
};
