import React from 'react';
import axios from 'axios';

import useSemiPersistentState from './hooks/useSemiPersistentState';
import SearchForm from './components/SearchForm';
import styles from './App.module.css';
import List  from './components/List';
import LastSearches from './components/LastSearches';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return { ...state, isLoading: true, isError: false };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return { ...state, isLoading: false, isError: true };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const getSumComments = stories => {
  return stories.data.reduce(
    (result, value) => result + value.num_comments,
    0
  );
};
const extractSearchTerm = url => url.replace(API_ENDPOINT, '');
const getLastSearches = urls =>
  urls
    .reduce((result, url, index) => {
      const searchTerm = extractSearchTerm(url);
      if (index === 0) { return result.concat(searchTerm); }
      const previousSearchTerm = result[result.length - 1];
      if (searchTerm === previousSearchTerm) { return result; }
      else { return result.concat(searchTerm); }
    }, [])
    .slice(-6)
    .slice(0, -1);
const getUrl = searchTerm => `${API_ENDPOINT}${searchTerm}`;
const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');
  const [urls, setUrls] = React.useState([getUrl(searchTerm)]);
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const sumComments = getSumComments(stories);

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    try {
      const lastUrl = urls[urls.length - 1];
      const result = await axios.get(lastUrl);
      dispatchStories({ type: 'STORIES_FETCH_SUCCESS', payload: result.data.hits });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
    // This const inside the Array, is to recreate this function every time my searchTerm changes.
  }, [urls]);

  React.useEffect(() => {
    handleFetchStories();
    // And this function inside the Array, is to run this function only once, when the component mounts.
  }, [handleFetchStories]);

  const handleRemoveStory = React.useCallback(item => {
    dispatchStories({ type: 'REMOVE_STORY', payload: item });
  },[]);

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
    event.preventDefault();
  };

  const handleSearchSubmit = event => {
    handleSearch(searchTerm);
    event.preventDefault();
  };

  const handleLastSearch = searchTerm => {
    setSearchTerm(searchTerm);
    handleSearch(searchTerm);
  };

  const handleSearch = searchTerm => {
    const url = getUrl(searchTerm);
    setUrls(urls.concat(url));
  };

  const lastSearches = getLastSearches(urls);

  return (
    <div className={styles.container}>
      <h1 className={styles.headlinePrimary}>My Hacker Stories with {sumComments} comments.</h1>
      <div style={{display:'flex', gap: '1rem', marginBottom: '1rem', flexWrap:'wrap'}}>
        <SearchForm
          searchTerm={searchTerm}
          onSearchInput={handleSearchInput}
          onSearchSubmit={handleSearchSubmit}
        />

        <LastSearches lastSearches={lastSearches} onLastSearch={handleLastSearch} />

      </div>
      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

export default App;
