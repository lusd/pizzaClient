import React, { useState } from 'react';
import { Query } from '@apollo/react-components';
import { useHistory } from 'react-router';
import { useQuery } from '@apollo/react-hooks';
import { Space, Spin, Button } from 'antd';
import { ShoppingCartOutlined, CloseOutlined } from '@ant-design/icons';

import * as sharedGraphql from '../shared/graphql';
import { getTotalOrderCost, ProductsList } from '../shared/components';
import styles from './basket.module.css';


const Basket = () => {

  const [isShowProducts, setShowProducts] = useState(false);

  const { data: { orderInProcessId } } = useQuery(sharedGraphql.ORDER_IN_PROCESS_ID_QUERY);
  const { data: { currentCurrency } } = useQuery(sharedGraphql.CURRENT_CURRENCY_QUERY);
  const { data: { exchangeRate } } = useQuery(sharedGraphql.EXCHANGE_RATE_QUERY);

  const history = useHistory();

  const toggleProducts = () => {
    setShowProducts(!isShowProducts);
  };

  if (orderInProcessId === null) {
    return (
      <div>
        <ShoppingCartOutlined className={ styles.shoppingCard }/>
        <span className={ styles.orderCount }> 0</span>
      </div>
    )
  }

  return <Query query={ sharedGraphql.ORDER_BY_ID_QUERY } variables={{id: orderInProcessId}}>
    {({ data, loading , error}) => {
      if (loading) return <Spin/>

      if (error) return <p>Error :(</p>

      return (
        <div>

          <Space onClick={() => toggleProducts()}>
            <ShoppingCartOutlined className={ styles.shoppingCard }/>
            <span className={ styles.orderCount }>{ data.order.orderItems.length }</span>
          </Space>

          {isShowProducts ?

            <div className={ styles.productsList }>

              <CloseOutlined onClick={() => toggleProducts()} className={ styles.closeButton } />
              {<ProductsList productItems={data.order.orderItems} orderInProcessId={orderInProcessId}/>}

              <Space style={{ alignSelf: 'flex-end' }}>

                Totat cost: {getTotalOrderCost(data.order.orderItems, currentCurrency, exchangeRate)}

                <Button type="primary" onClick={() => {
                  history.push('/order');
                  toggleProducts();
                }}>
                  Make order
                </Button>

              </Space>
            </div> : <></>}
        </div>
      )
    }}

  </Query>
}

export { Basket };