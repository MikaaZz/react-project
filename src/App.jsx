import React from 'react';
import axios from 'axios';

import useSemiPersistentState from './hooks/useSemiPersistentState';
import SearchForm from './components/SearchForm';
import styles from './App.module.css';
import List  from './components/List';

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

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const sumComments = getSumComments(stories);

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    try {
      const result = await axios.get(url);
      dispatchStories({ type: 'STORIES_FETCH_SUCCESS', payload: result.data.hits });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
    // This const inside the Array, is to recreate this function every time my searchTerm changes.
  }, [url]);

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

  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.headlinePrimary}>My Hacker Stories with {sumComments} comments.</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

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
