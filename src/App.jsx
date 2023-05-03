import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(cat => cat.id === product.categoryId);
  const user = usersFromServer.find(person => person.id === category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

const getPreparedProducts = (
  userId,
  query,
  categories,
) => (
  products
    .filter((product) => {
      if (userId) {
        return product.user.id === userId;
      }

      return true;
    })
    .filter(product => product.name.toLowerCase().includes(query.toLowerCase()))
    .filter((product) => {
      if (categories.length) {
        return categories.includes(product.category.id);
      }

      return true;
    })
);

export const App = () => {
  const [activeUserId, setActiveUserId] = useState(0);
  const [query, setQuery] = useState('');
  const [activeCategoriesIds, setActiveCategoriesIds] = useState([]);

  const preparedProducts = getPreparedProducts(
    activeUserId,
    query,
    activeCategoriesIds,
  );

  const handleResetFilters = () => {
    setActiveUserId(0);
    setQuery('');
    handleAllCatReset();
  };

  const handleActiveCatAdd = (id) => {
    if (activeCategoriesIds.includes(id)) {
      setActiveCategoriesIds(currentCategories => (
        currentCategories.filter(category => category !== id)
      ));

      return;
    }

    setActiveCategoriesIds(currentCategories => (
      [...currentCategories, id]
    ));
  };

  const handleAllCatReset = () => {
    setActiveCategoriesIds([]);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={classNames(
                  { 'is-active': activeUserId === 0 },
                )}
                onClick={() => setActiveUserId(0)}
              >
                All
              </a>

              {usersFromServer.map((user) => {
                const { id, name } = user;

                return (
                  <a
                    data-cy="FilterUser"
                    href="#/"
                    className={classNames(
                      { 'is-active': id === activeUserId },
                    )}
                    onClick={() => setActiveUserId(id)}
                    key={id}
                  >
                    {name}
                  </a>
                );
              })}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={classNames(
                  'button',
                  'is-success',
                  'mr-6',
                  { 'is-outlined': activeCategoriesIds.length },
                )}
                onClick={handleAllCatReset}
              >
                All
              </a>

              {categoriesFromServer.map((category) => {
                const { id, title } = category;

                return (
                  <a
                    data-cy="Category"
                    className={classNames(
                      'button',
                      'mr-2',
                      'my-1',
                      { 'is-info': activeCategoriesIds.includes(id) },
                    )}
                    href="#/"
                    onClick={() => handleActiveCatAdd(id)}
                    key={id}
                  >
                    {title}
                  </a>
                );
              })}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!preparedProducts.length && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          {preparedProducts.length > 0 && (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {preparedProducts.map((product) => {
                  const {
                    id,
                    name,
                    user,
                    category,
                  } = product;

                  return (
                    <tr data-cy="Product" key={id}>
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {id}
                      </td>

                      <td data-cy="ProductName">
                        {name}
                      </td>

                      <td data-cy="ProductCategory">
                        <span role="img" aria-label={category.title}>
                          {`${category.icon} - ${category.title}`}
                        </span>
                      </td>

                      <td
                        data-cy="ProductUser"
                        className={classNames(
                          { 'has-text-link': user.sex === 'm' },
                          { 'has-text-danger': user.sex === 'f' },
                        )}
                      >
                        {user.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
