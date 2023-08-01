import React, { useEffect, useState } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { clearAllLocalStorageCache } from './helpers';

function SearchResults({
  searchResultsEmpty,
  setSearchResultsEmpty,
  loading,
  setLoading,
}) {
  const [searchResults, setSearchResults] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    const doFetch = async () => {
      if (!searchParams.get('q')) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      const response = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search${location.search}`
      );
      const responseJson = await response.json();

      const arrayOfFetches = [];
      const arrayOfCachedObjects = [];

      if (responseJson.total === 0) {
        setLoading(false);
        setSearchResultsEmpty(true);
        setSearchResults([]);
        return;
      }

      responseJson.objectIDs.splice(0, 15).map((objectID) => {
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

      try {
        const response = await Promise.all(arrayOfFetches);
        const data = await Promise.all(
          response.map(async (object) => {
            let objectJson = await object.json();
            localStorage.setItem(
              objectJson.objectID,
              JSON.stringify(objectJson)
            );
            return objectJson;
          })
        );
        const dataFlatSorted = data.sort(
          (a, b) => b.objectEndDate - a.objectEndDate
        );

        setSearchResultsEmpty(false);
        setSearchResults([...dataFlatSorted, ...arrayOfCachedObjects]);
      } catch {
        throw Error('Promise failed');
      } finally {
        setLoading(false);
      }
    };
    doFetch();
  }, [location]);

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
            onClick={() => clearAllLocalStorageCache()}
          >
            Clear localSorage Cache
          </button>
        </span>
      </div>
    );
  };

  return (
    <section className="resultsContainer">
      {loading && <div className="resultsLoader"></div>}

      {!loading && searchResults.length
        ? searchResults.map((result) => {
            return (
              <article key={result.objectID}>
                <div className="articleLeft">
                  <h1>{result.title ? result.title : 'Untitled'}</h1>
                  <ul>
                    {result.creditLine && <li>Credit: {result.creditLine}</li>}
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
    </section>
  );
}

export default SearchResults;
