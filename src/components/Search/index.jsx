/* eslint-disable react/prop-types */
const Search = ({ search, onSearch }) => {

  return (
    <>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" value={search} onChange={onSearch} />
    </>
  );
};
export default Search;
