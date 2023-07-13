/* eslint-disable react/prop-types */
const LastSearches = ({ lastSearches, onLastSearch }) => (
  <>
    {lastSearches.map((searchTerm, index) => (
      <button
        key={searchTerm + index}
        type="button"
        onClick={() => onLastSearch(searchTerm)}
        style={{width:'100%', maxWidth:'150px'}}
      >
        {searchTerm}
      </button>
    ))}
  </>
);
export default LastSearches;
