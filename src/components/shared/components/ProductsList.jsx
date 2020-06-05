import React from 'react';
import { Avatar, Spin } from 'antd';
import { Mutation } from '@apollo/react-components';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';

import styles from '../../Basket/basket.module.css';
import { getPrice } from '../components';
import * as sharedGraphql from '../graphql';


const ProductsList = ({ orderInProcessId, productItems = [] }) => {

  const { data: { currentCurrency } } = useQuery(sharedGraphql.CURRENT_CURRENCY_QUERY);
  const { data: { exchangeRate } } = useQuery(sharedGraphql.EXCHANGE_RATE_QUERY);

    return (
        <>
            {productItems.map(productItem => (
                <div key={ productItem.id } className={ styles.productGrid }>

                    <Avatar shape="square" size={ 50 }  src={ productItem.product?.imageUrl }/>

                    <span>{ productItem.product.name }</span>

                    <span>Items: { productItem.quantity }</span>

                    <span>Price: { getPrice(productItem.product.priceE, currentCurrency, exchangeRate) }</span>

                    <span>Total: { getPrice(productItem.product.priceE, currentCurrency, exchangeRate, productItem.quantity) }</span>

                    <Mutation 
                        mutation={sharedGraphql.ORDER_ITEM_DELETE_MUTATION} 
                        variables={{ id: productItem.id }}
                        refetchQueries={[{ query: sharedGraphql.ORDER_BY_ID_QUERY, variables: { id: orderInProcessId } }]}
                    >
                        {( deleteOrderItem, { loading, error } ) => {

                            if (loading) return <Spin/>

                            if (error) return <p>Error :(</p>

                            return (
                                <span style={{ cursor: 'pointer' }} onClick={() => deleteOrderItem()}> X </span>
                            )}}
                    </Mutation>
                </div>
            ))}
        </>
    )
}

ProductsList.propTypes = {
    orderInProcessId: PropTypes.string,
    productItems: PropTypes.array,
};

export { ProductsList };


