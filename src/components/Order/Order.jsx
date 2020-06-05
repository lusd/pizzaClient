import React from 'react';
import { useHistory } from 'react-router';
import { Form, Field } from 'react-final-form';
import { Spin, Space, notification } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { Query } from '@apollo/react-components';
import _get from 'lodash/get';
import PropTypes from 'prop-types';
import createDecorator from 'final-form-calculate';

import { getFields } from './fields';
import styles from './order.module.css';
import * as sharedGraphql from '../shared/graphql';
import { ProductsList, getTotalOrderCost, FallBack } from '../shared/components';


const Order = ({ updateOrder }) => {

  const client = useApolloClient();
  const { data: { orderInProcessId } } = useQuery(sharedGraphql.ORDER_IN_PROCESS_ID_QUERY);
  const { data: { currentCurrency } } = useQuery(sharedGraphql.CURRENT_CURRENCY_QUERY);
  const { data: { exchangeRate } } = useQuery(sharedGraphql.EXCHANGE_RATE_QUERY);
  const history = useHistory();

  const openNotification = (order) => {
    notification.open({
        duration: 0,
        message: `Dear ${order.name}, you order with id=${order.id} succesfully created!`,
        description: `
            ${order.delivery ? ('address: ' + order.address + ';') : ''}
            cost: ${getTotalOrderCost(order.orderItems, currentCurrency, exchangeRate, order.delivery)};
            comment: ${order.comment};
        `,
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    });
  };

  const onSubmit = async (formData) => {
    const updatedFormData = { ...formData, id: orderInProcessId };
    const response = await updateOrder({ variables: { input: updatedFormData } });
    if (_get(response, ['data', 'updateOrder', 'id'], false)) {
        openNotification(response.data.updateOrder);
        sessionStorage.removeItem('orderId');
        client.writeData({ data: { orderInProcessId: null }});
        history.push('/');
    }
  }

  const decorator = createDecorator(
      {
          field: 'delivery',
          updates: {
              address: (deliveryValue) => {
                  if (deliveryValue === false) return undefined;
              }
          }
      }
  )

  if (orderInProcessId === null) return <FallBack />;

  return (
    <Query query={ sharedGraphql.ORDER_BY_ID_QUERY } variables={{ id: orderInProcessId }}>
      {
        ({ data, loading, error }) => {

            if (loading) return <Spin />;
            if (error) return <p>Error :(</p>;
            if (_get(data, ['order', 'orderItems'], []).length === 0) return <FallBack />;

            return (
                <Form onSubmit={onSubmit} decorators={[ decorator ]}>
                    {({ handleSubmit, submitting, pristine, values }) => {
                        return (
                        <form onSubmit={handleSubmit}  className={styles.orderContent}>

                            {getFields(values).map(field => {
                                if (field === false) return '';
                                return (
                                    <Field
                                        name={field.name}
                                        validate={field.validate ? field.validate : false}
                                        type={field.type}
                                    >
                                        {({ input, meta }) => (
                                            <Space className={styles.inputGrid}>
                                                <label>{field.label}</label>
                                                <input {...input} type={field.type} placeholder={field.placeholder ? field.placeholder : ''}/>
                                                {meta.error && meta.touched && <span className={styles.error}>{meta.error}</span>}
                                            </Space>
                                        )}
                                    </Field>
                                )
                            })}
                            
                            <h4>Products</h4>
                            <div className={styles.productList}>
                                <ProductsList orderInProcessId={orderInProcessId} productItems={data.order.orderItems}/>
                            </div>

                            Total cost: { getTotalOrderCost(data.order.orderItems, currentCurrency, exchangeRate, values.delivery) }

                            <button type="submit" disabled={ submitting || pristine } className={styles.submitButton}>
                                Confirm order
                            </button>

                            <Link className={styles.link} to="/">Return to Pizza List</Link>
                        </form>
                    )}}
                </Form>
            )
        }
      }
    </Query>
  )
}

Order.propTypes = {
    updateOrder: PropTypes.func.isRequired,
};

export { Order };