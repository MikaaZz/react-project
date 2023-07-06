/* eslint-disable react/prop-types */
import React from 'react';
import styles from '../../App.module.css';
import { sortBy } from 'lodash';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENT: list => sortBy(list, 'num_comments').reverse(),
  POINT: list => sortBy(list, 'points').reverse(),
};

const List = ({ list, onRemoveItem }) => {
  const [sort, setSort] = React.useState('NONE');

  const handleSort = (sortKey) => {
    setSort(sortKey);
  };

  const sortFunction = SORTS[sort];
  const sortedList = sortFunction(list);

  return (
    <div>
      <div style={{ display: 'flex', width:'100%' }}>
        <span>
          <button type="button" onClick={() => handleSort('TITLE')}>
            Title
          </button>
        </span>
        <span>
          <button type="button" onClick={() => handleSort('AUTHOR')}>
            Author
          </button>
        </span>
        <span>
          <button type="button" onClick={() => handleSort('COMMENT')}>
            Comments
          </button>
        </span>
        <span>
          <button type="button" onClick={() => handleSort('POINT')}>
            Points
          </button>
        </span>
        <span>Actions</span>
      </div>
      {sortedList.map(({ ...item }) => {
        return (
          <Item key={item.objectID} {...item} onRemoveItem={onRemoveItem} />
        );
      })}
    </div>
  );
};

export const Item = ({
  title,
  url,
  author,
  num_comments,
  points,
  onRemoveItem,
  objectID,
}) => {
  const currentItem = { title, url, author, num_comments, points, objectID };
  return (
    <div className={styles.item}>
      <span style={{ width: '40%' }}>
        <a href={url}>{title}</a>
      </span>
      <span style={{ width: '30%' }}>{author}</span>
      <span style={{ width: '10%' }}>{num_comments}</span>
      <span style={{ width: '10%' }}>{points}</span>
      <span style={{ width: '10%' }}>
        <button
          type="button"
          className={`${styles.button} ${styles.buttonSmall}`}
          onClick={() => onRemoveItem(currentItem)}
        >
          Dismiss
        </button>
      </span>
    </div>
  );
};

export default List;
