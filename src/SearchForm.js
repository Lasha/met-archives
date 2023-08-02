import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import {
  constructQueryString,
  fetchDepartments,
  parseQueryString,
} from './helpers';
import { DEFAULT_PAGE_COUNT } from './constants';

const SearchForm = ({
  setSearchResultsEmpty,
  loading,
  setLoading,
  setCurrentPage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOnView, setIsOnView] = useState('');
  const [hasImages, setHasImages] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [queryString, setQueryString] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const formButtonsDisabled = !queryString || (queryString && !searchTerm);

  useEffect(() => {
    const loadDepartments = async () => {
      const data = await fetchDepartments();
      setDepartments(data.departments);
    };

    // Set form fields based on URL parameters
    const params = parseQueryString();
    if (params.q) setSearchTerm(params.q);
    if (params.isOnView) setIsOnView(params.isOnView);
    if (params.hasImages) setHasImages(params.hasImages);
    if (params.departmentId) setDepartmentId(params.departmentId);

    // Fetch list of departments to populate form dropdown
    loadDepartments();
  }, [location]);

  useEffect(() => {
    const newQueryString = constructQueryString(
      searchTerm,
      isOnView,
      hasImages,
      departmentId
    );
    setQueryString(newQueryString);
  }, [searchTerm, isOnView, hasImages, departmentId]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const newQueryString = constructQueryString(
      searchTerm,
      isOnView,
      hasImages,
      departmentId
    );

    // setQueryString(newQueryString);
    setSearchParams(newQueryString);

    // Reset to pagination to page 1 each time a new search is run
    setCurrentPage(DEFAULT_PAGE_COUNT);

    // Update browser URL to include query params
    navigate(`/?${newQueryString}`);
  };

  const handleReset = () => {
    setSearchTerm('');
    setIsOnView('');
    setHasImages('');
    setDepartmentId('');
    setQueryString('');
    setCurrentPage(DEFAULT_PAGE_COUNT);

    setSearchResultsEmpty(false);
    setLoading(false);
    // Clear URL query params
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <label className="label">
        <span>
          Search Term: <span className="required">*</span>
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input"
          placeholder="Word or phrase e.g. vacuums"
        />
      </label>
      <label className="label">
        Is On View:
        <select
          value={isOnView}
          onChange={(e) => setIsOnView(e.target.value)}
          className="input"
        >
          <option value="">Select...</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </label>
      <label className="label">
        Has Images:
        <select
          value={hasImages}
          onChange={(e) => setHasImages(e.target.value)}
          className="input"
        >
          <option value="">Select...</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </label>
      <label className="label">
        Department:
        <select
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          className="input"
        >
          <option value="">Select...</option>
          {departments.map((department) => (
            <option
              key={department.departmentId}
              value={department.departmentId}
            >
              {department.displayName}
            </option>
          ))}
        </select>
      </label>
      <label className="label">
        <input
          type="submit"
          value="Submit"
          className="submitButton"
          disabled={formButtonsDisabled || loading}
        />
        <input
          type="button"
          value="Reset"
          onClick={handleReset}
          className="resetButton"
          disabled={loading}
        />
      </label>
    </form>
  );
};

export default SearchForm;
