/* eslint-disable react/prop-types */
const List = ({ list, onRemoveItem }) => list.map(({ ...item }) => ( <Item key={item.objectID} {...item} onRemoveItem={onRemoveItem} /> ));

const Item = ({ title, url, author, num_comments, points, onRemoveItem, objectID }) => {
  const currentItem = { title, url, author, num_comments, points, objectID };
  return (
    <div>
      <span>
        <a href={url}>{title}</a>
      </span>
      <span>{author}</span>
      <span>{num_comments}</span>
      <span>{points}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(currentItem)}>
          Dismiss
        </button>
      </span>
    </div>
  );
};

export default List;
