import React from 'react';
import renderer from 'react-test-renderer';

import App from './App';
import SearchForm from './components/SearchForm';
import List, { Item } from './components/List';
import InputWithLabel from './components/InputWithLabel';

describe('Item', () => {
  const item = {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  };

  it('renders all properties', () => {
    const component = renderer.create(<Item {...item} />);

    expect(component.root.findByType('a').props.href).toEqual(
      'https://reactjs.org/'
    );
    expect(
      component.root.findAllByProps({ children: 'Jordan Walke' })
        .length
    ).toEqual(1);
  });
});
