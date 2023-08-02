import React, { useEffect, useState } from 'react';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import { useSearchParams, useLocation } from 'react-router-dom';
import './style.css';

// We're going to the Met!

// We're really excited about the trip and want to explore their archives for some
// of our favorite things - `vacuums`.

// We're going to build an app that allows you to find works related to vacuums
// in the Met Museum's archives. We want to be able to query for vacuums
// using their built-in search functionality (https://metmuseum.github.io/#endpoints)
// and return the 5 most recent works, as determined by their `objectEndDate`.
// We'll surface this somehow in the UI - although visuals aren't too important right now.

// Some thoughts:
//   - Feel free to Google around & ask away - I'm here to help
//   - Hack it together to start, polish to finish

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResultsEmpty, setSearchResultsEmpty] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="container">
      <h1>The Metropolitan Museum of Art</h1>
      <h2>Collection Archives</h2>

      <div className="mainContent">
        <aside>
          <h3>What are you looking for?</h3>
          <SearchForm
            setSearchResultsEmpty={setSearchResultsEmpty}
            loading={loading}
            setLoading={setLoading}
          />
        </aside>

        <main>
          <SearchResults
            searchResultsEmpty={searchResultsEmpty}
            setSearchResultsEmpty={setSearchResultsEmpty}
            loading={loading}
            setLoading={setLoading}
            headerCode={() => (
              <h3>
                {searchParams.get('q') ? (
                  <span>Search Results For: {searchParams.get('q')}</span>
                ) : (
                  <>Search Results</>
                )}
              </h3>
            )}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
