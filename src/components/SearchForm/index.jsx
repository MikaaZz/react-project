/* eslint-disable react/prop-types */
import InputWithLabel from "../InputWithLabel";
import styles from '../../App.module.css';

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => (
  <form onSubmit={onSearchSubmit} className={styles.searchForm}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>

    <button type="submit" className={`${styles.button} ${styles.buttonLarge}`} disabled={!searchTerm}>
      Submit
    </button>
  </form>
);
export default SearchForm;
