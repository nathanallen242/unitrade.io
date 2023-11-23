import React from 'react';

const Pagination = ({ className, currentPage, totalPages, onNavigate, onItemsPerPageChange, itemsPerPage }) => {
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onNavigate(newPage);
    }
  };

  return (
    <div className={className}>
      {/* Navigation Buttons */}
      <button 
        onClick={() => changePage(currentPage - 1)} 
        disabled={currentPage === 1}
        style={{ marginRight: '10px' }}
      >
        Previous
      </button>
      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button 
          key={page} 
          onClick={() => changePage(page)} 
          disabled={currentPage === page}
          style={{ marginRight: '5px' }}
        >
          {page}
        </button>
      ))}
      <button 
        onClick={() => changePage(currentPage + 1)} 
        disabled={currentPage === totalPages}
        style={{ marginLeft: '10px' }}
      >
        Next
      </button>

      {/* Items Per Page Selector */}
      <select 
        onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))} 
        value={itemsPerPage}
        style={{ marginLeft: '20px' }}
      >
        {[3, 5, 10].map(size => (
          <option key={size} value={size}>
            {size} per page
          </option>
        ))}
      </select>
    </div>
  );
};

export default Pagination;
