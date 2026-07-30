import { useState } from "react";

export const useRowSelection = <T extends { id: string | number }>() => {
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  const handleSelectAll = (checked: boolean, rows: T[]) => {
    setSelectedRows(checked ? rows : []);
  };

  const handleSelectRow = (checked: boolean, row: T) => {
    setSelectedRows((prev) => {
      if (checked) {
        return [...prev, row];
      }

      return prev.filter((item) => item.id !== row.id);
    });
  };

  const isRowSelected = (id: string | number) =>
    selectedRows.some((item) => item.id === id);

  const clearSelection = () => setSelectedRows([]);

  return {
    selectedRows,
    handleSelectAll,
    handleSelectRow,
    isRowSelected,
    clearSelection,
  };
};