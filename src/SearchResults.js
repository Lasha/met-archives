import React, { useEffect, useState } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { clearAllLocalStorageCache } from './helpers';
import Pagination from './Pagination';
import { DEFAULT_PAGE_COUNT } from './constants';

function SearchResults({
  searchResultsEmpty,
  setSearchResultsEmpty,
  loading,
  setLoading,
  headerCode,
  currentPage,
  setCurrentPage,
  totalPages,
  setTotalPages,
  itemsPerPage,
  setItemsPerPage,
}) {
  const [searchResults, setSearchResults] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [clearedLocalStorage, setClearedLocalStorage] = useState(false);

  useEffect(() => {
    doFetch();
  }, [location, currentPage]);

  const doFetch = async () => {
    try {
      if (!searchParams.get('q')) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      const response = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search${location.search}`
      );
      const responseJson = await response.json();

      // const itemsPerPage = 10; // Number of items to display per page
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;

      if (responseJson.total === 0) {
        setLoading(false);
        setSearchResultsEmpty(true);
        setSearchResults([]);
        setTotalPages(0);
        setCurrentPage(DEFAULT_PAGE_COUNT);
        return;
      }

      setTotalPages(Math.ceil(responseJson.total / itemsPerPage));

      const arrayOfFetches = [];
      const arrayOfCachedObjects = [];

      responseJson.objectIDs.slice(start, end).forEach((objectID) => {
        if (localStorage.getItem(objectID)) {
          arrayOfCachedObjects.push(JSON.parse(localStorage.getItem(objectID)));
        } else {
          arrayOfFetches.push(
            fetch(
              `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
            )
          );
        }
      });

      await fetchData(arrayOfFetches, arrayOfCachedObjects);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (arrayOfFetches, arrayOfCachedObjects) => {
    const response = await Promise.all(arrayOfFetches);
    const data = await Promise.all(
      response.map(async (object) => {
        let objectJson = await object.json();
        localStorage.setItem(objectJson.objectID, JSON.stringify(objectJson));
        return objectJson;
      })
    );

    const dataSorted = data
      .filter((object) => 'objectID' in object) // Filter out badly formed data
      .sort((a, b) => b.objectEndDate - a.objectEndDate);

    setSearchResultsEmpty(false);
    setSearchResults([...dataSorted, ...arrayOfCachedObjects]);
  };

  const clearLocalStorageCache = () => {
    clearAllLocalStorageCache();
    setClearedLocalStorage(true);

    setTimeout(() => {
      setClearedLocalStorage(false);
    }, 1000);
  };

  const showResultsEmpty = () => {
    if (loading) return;

    return searchResultsEmpty ? (
      <div>
        <h3 className="resultsEmptyText">
          Oops! We couldn't find anything that matched.
        </h3>
        <span className="resultsEmptyText">Try a different search?</span>
      </div>
    ) : (
      <div>
        <h3>Try searching for something awesome!</h3>
        <h4>Check out these suggestions:</h4>
        <span className="resultsEmptyText">
          <Link to="/?q=violins">Violins</Link>
        </span>
        <span className="resultsEmptyText">
          <Link to="/?q=roses&departmentId=14">Roses</Link>
        </span>
        <span className="resultsEmptyText">
          <Link to="/?q=sunflowers&hasImages=true&departmentId=11">
            Sunflowers
          </Link>
        </span>
        <span className="resultsEmptyText">
          <Link to="/?q=Vacuums">Vacuums</Link>
        </span>
        <span className="resultsEmptyText">
          <Link to="/?q=pyramids&departmentId=10">Pyramids</Link>
        </span>
        <span className="resultsEmptyText">
          <button
            className="clearCacheBtn"
            onClick={() => clearLocalStorageCache()}
          >
            {clearedLocalStorage ? 'Done!' : 'Clear localSorage Cache'}
          </button>
        </span>
      </div>
    );
  };

  return (
    <>
      <div className="resultsheader">
        {headerCode && headerCode()}{' '}
        {searchResults.length ? (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            isCompact
          />
        ) : null}
      </div>

      <section className="resultsContainer">
        {loading && <div className="resultsLoader"></div>}

        {searchResults.length
          ? searchResults.map((result) => {
              return (
                <article key={result.objectID}>
                  <div className="articleLeft">
                    <h1>{result.title ? result.title : 'Untitled'}</h1>
                    <ul>
                      {result.creditLine && (
                        <li>Credit: {result.creditLine}</li>
                      )}
                      {result.medium && <li>Medium: {result.medium}</li>}
                      {result.GalleryNumber && (
                        <li>Gallery: {result.GalleryNumber}</li>
                      )}
                      {result.dimensions && (
                        <li>Dimensions: {result.dimensions}</li>
                      )}
                    </ul>

                    {result.objectURL && (
                      <a
                        className="learnMore"
                        href={result.objectURL}
                        target="_new"
                        title={`Learn more about ${
                          result.title ? result.title : 'Untitled'
                        }`}
                      >
                        Learn More
                      </a>
                    )}
                  </div>
                  {result.primaryImageSmall && (
                    <div className="articleRight">
                      {<img src={result.primaryImageSmall} />}
                    </div>
                  )}
                </article>
              );
            })
          : showResultsEmpty()}
        {searchResults.length ? (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            isBottomSticky={true}
          />
        ) : null}
      </section>
    </>
  );
}

export default SearchResults;
