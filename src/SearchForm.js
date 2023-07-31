import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  constructQueryString,
  fetchDepartments,
  parseQueryString,
} from './helpers';

const SearchForm = () => {
  const [query, setQuery] = useState('');
  const [isOnView, setIsOnView] = useState('');
  const [hasImages, setHasImages] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [queryString, setQueryString] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadDepartments = async () => {
      const data = await fetchDepartments();
      setDepartments(data.departments);
    };

    // Set form fields based on URL parameters
    const params = parseQueryString();
    if (params.q) setQuery(params.q);
    if (params.isOnView) setIsOnView(params.isOnView);
    if (params.hasImages) setHasImages(params.hasImages);
    if (params.departmentId) setDepartmentId(params.departmentId);

    // Fetch list of departments to populate form dropdown
    loadDepartments();
  }, []);

  useEffect(() => {
    const newQueryString = constructQueryString(
      query,
      isOnView,
      hasImages,
      departmentId
    );
    setQueryString(newQueryString);
    console.log(newQueryString);
  }, [query, isOnView, hasImages, departmentId]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const newQueryString = constructQueryString(
      query,
      isOnView,
      hasImages,
      departmentId
    );

    // setQueryString(newQueryString);
    setSearchParams(newQueryString);

    // Update browser URL
    window.history.pushState({}, '', `/?${newQueryString}`);

    console.log(newQueryString);

    // Here you would usually send a request to the server
  };

  const handleReset = () => {
    setQuery('');
    setIsOnView('');
    setHasImages('');
    setDepartmentId('');
    setQueryString('');
    // Clear URL query params
    // window.history.pushState({}, '', '/');
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <label className="label">
        Search Term:
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
          disabled={!queryString}
        />
        <input
          type="button"
          value="Reset"
          onClick={handleReset}
          className="resetButton"
          disabled={!queryString}
        />
      </label>
    </form>
  );
};

export default SearchForm;
