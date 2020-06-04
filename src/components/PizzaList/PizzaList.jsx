import React, { useState } from 'react';
import { Query } from '@apollo/react-components';
import { Card, Spin, notification } from 'antd';
import { useQuery } from '@apollo/react-hooks';
import { SmileOutlined } from '@ant-design/icons';

import * as sharedGraphQL from '../shared/graphql';
import { getPrice } from '../shared/components';
import styles from './pizza.module.css';
import { CreateOrderItemContainer } from './CreateOrderItem/CreateOrderItemContainer';

const { Meta } = Card;

const PizzaList = () => {
  const [isModalOpen, toggleModal] = useState(false);
  const [pizzaToAdd, changePizzaToAdd] = useState({});

  const { data: { exchangeRate }} = useQuery(sharedGraphQL.EXCHANGE_RATE_QUERY);
  const { data: { currentCurrency }} = useQuery(sharedGraphQL.CURRENT_CURRENCY_QUERY);

  const openNotification = (pizza) => {
    notification.open({
      message: `${pizza.name} is added to basket`,
      icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    });
  };

  const openModal = (product) => {
    changePizzaToAdd(product)
    toggleModal(true);
  };
  const handleOk = () => {
    openNotification(pizzaToAdd);
    changePizzaToAdd({});
    toggleModal(false);
  };
  const handleCancel = () => {
    changePizzaToAdd({});
    toggleModal(false);
  };

  return (
    <Query query={sharedGraphQL.PRODUCTS_LIST_QUERY}>
      {({data, error, loading}) => {
        if (loading) return <Spin tip="Loading..."/>
        if (error) return <p>Error :(</p>
        const productData = (description = '', price = '') => (
          <div>
            <p>
              {description}
            </p>
            <p>
            {getPrice(price, currentCurrency, exchangeRate)}
            </p>
          </div>
        )
        return (
          <div className={styles.container}>
            {data.products.map(product => (
              <Card
                key={product.id}
                style={{ width: 300 }}
                cover={
                  <img
                    width={300}
                    height={300}
                    alt={product.name}
                    src={product.imageUrl}
                  />
                }
              >
                <Meta
                  title={product.name}
                  description={productData(product.description, product.priceE)}
                />
                <button type="primary" onClick={() => openModal(product)}>Add to Order</button>
              </Card>
            ))}
            <CreateOrderItemContainer 
              handleOk={handleOk} 
              handleCancel={handleCancel} 
              isModalOpen={isModalOpen} 
              pizza={pizzaToAdd}
            />
          </div>
        )
      }}
    </Query>
  )
}

export { PizzaList };