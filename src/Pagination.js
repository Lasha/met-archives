import React from 'react';

const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
  const handleClick = (page) => {
    setCurrentPage(page);
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => handleClick(i)}
        className={currentPage === i ? 'active' : ''}
      >
        {i}
      </button>
    );
  }

  return <div className="pagination">{pages}</div>;
};

export default Pagination;
