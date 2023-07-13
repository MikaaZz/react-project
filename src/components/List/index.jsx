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
  const [sort, setSort] = React.useState({
    sortKey: 'NONE',
    isReverse: false,
  });

  const handleSort = sortKey => {
    const isReverse = sort.sortKey === sortKey && !sort.isReverse;
    setSort({ sortKey, isReverse });
  };

  const sortFunction = SORTS[sort.sortKey];
  const sortedList = sort.isReverse
    ? sortFunction(list).reverse()
    : sortFunction(list);

  return (
    <div>
      <div style={{ display: 'flex', width:'100%', margin:'1rem 0', gap: '1rem', flexWrap:'wrap' }}>
        <span style={{width:'100%', maxWidth:'150px'}}>
          <button style={{width:'100%', maxWidth:'150px', padding: '.5rem 0'}} type="button" onClick={() => handleSort('TITLE')}>
            Title
          </button>
        </span>
        <span style={{width:'100%', maxWidth:'150px'}}>
          <button style={{width:'100%', maxWidth:'150px', padding: '.5rem 0'}} type="button" onClick={() => handleSort('AUTHOR')}>
            Author
          </button>
        </span>
        <span style={{width:'100%', maxWidth:'150px'}}>
          <button style={{width:'100%', maxWidth:'150px', padding: '.5rem 0'}} type="button" onClick={() => handleSort('COMMENT')}>
            Comments
          </button>
        </span>
        <span style={{width:'100%', maxWidth:'150px'}}>
          <button style={{width:'100%', maxWidth:'150px', padding: '.5rem 0'}} type="button" onClick={() => handleSort('POINT')}>
            Points
          </button>
        </span>
        <span style={{width:'100%', maxWidth:'150px'}}>Actions</span>
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
        <a href={url} target='_blank' rel="noreferrer">{title}</a>
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
