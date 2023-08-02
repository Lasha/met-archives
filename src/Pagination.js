import React from 'react';
import './Pagination.css';

function Pagination({ totalPages, currentPage, setCurrentPage }) {
  const maxPagesToShow = 5;

  // Calculate range of page numbers to display
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    <div className="pagination">
      <button onClick={handlePreviousPage} disabled={currentPage === 1}>
        Previous
      </button>
      {startPage > 1 && (
        <>
          <button onClick={() => handlePageChange(1)}>1</button>
          <button disabled>...</button>
        </>
      )}
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          className={pageNumber === currentPage ? 'active' : ''}
          onClick={() => handlePageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
      {endPage < totalPages && (
        <>
          <button disabled>...</button>
          <button onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </button>
        </>
      )}
      <button onClick={handleNextPage} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
}

export default Pagination;
