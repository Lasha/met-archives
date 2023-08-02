import React from 'react';
import './Pagination.css';

function Pagination({ totalPages, currentPage, setCurrentPage, isCompact }) {
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    window.scrollTo(0, 0);
  };

  if (isCompact) {
    return (
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <div>
          Page {currentPage} of {totalPages}
        </div>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    );
  }

  const maxPagesToShow = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

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
