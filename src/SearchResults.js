import React, { useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';

function SearchResults() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    const doFetch = async () => {
      if (!searchParams.get('q')) {
        setSearchResults([]);
        return;
      }

      const response = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search${location.search}`
      );
      const responseJson = await response.json();

      const arrayOfFetches = [];
      const arrayOfCachedObjects = [];

      if (responseJson.total === 0) {
        setSearchResults([]);
        return;
      }

      responseJson.objectIDs.splice(0, 5).map((objectId) => {
        if (localStorage.getItem(objectId)) {
          arrayOfCachedObjects.push(localStorage.getItem(objectId));
        } else {
          arrayOfFetches.push(
            fetch(
              `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`
            )
          );
        }
      });

      console.log(arrayOfFetches);

      try {
        const res = await Promise.all(arrayOfFetches);
        const data = await Promise.all(res.map((r) => r.json()));
        const dataFlatSorted = data
          .flat()
          .sort((a, b) => b.objectEndDate - a.objectEndDate);

        console.log({ dataFlatSorted });

        setSearchResults(dataFlatSorted);

        // sort(a,b => b.objectEndDate - a.objectEndDate)
      } catch {
        throw Error('Promise failed');
      }
    };
    doFetch();
  }, [location]);

  return (
    <section className="resultsContainer">
      {searchResults.length ? (
        searchResults.map((result) => {
          return (
            <article key={result.objectId}>
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
      ) : (
        <h3>Try searching for something awesome!</h3>
      )}
    </section>
  );
}

export default SearchResults;
