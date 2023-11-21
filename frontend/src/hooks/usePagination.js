import { useState } from 'react';

const usePagination = (totalItems, initialItemsPerPage = 3) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const setCurrentPageSafe = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPageSafe(1); // Reset to first page
  };

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    setCurrentPage: setCurrentPageSafe,
    handleItemsPerPageChange,
  };
};

export default usePagination;
