import React from 'react';
import { useHistory } from 'react-router';
import { Form, Field } from 'react-final-form';
import { Spin, Space, notification } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { Query } from '@apollo/react-components';
import _get from 'lodash/get';

import styles from './order.module.css';
import * as sharedGraphql from '../shared/graphql';
import { ProductsList, getTotalOrderCost, FallBack } from '../shared/components';


const Order = ({ updateOrder }) => {

  const client = useApolloClient();
  const { data: { orderInProcessId } } = useQuery(sharedGraphql.ORDER_IN_PROCESS_ID_QUERY);
  const { data: { currentCurrency } } = useQuery(sharedGraphql.CURRENT_CURRENCY_QUERY);
  const { data: { exchangeRate } } = useQuery(sharedGraphql.EXCHANGE_RATE_QUERY);
  const history = useHistory();

  const openNotification = () => {
    notification.open({
      message: 'You order succesfully created',
      icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    });
  };

  const onSubmit = async (formData) => {
    const updatedFormData = { ...formData, id: orderInProcessId };
    const response = await updateOrder({ variables: { input: updatedFormData } });
    if (_get(response, ['data', 'updateOrder', 'id'], false)) {
        openNotification();
        sessionStorage.removeItem('orderId');
        client.writeData({ data: { orderInProcessId: null }});
        history.push('/');
    }
  }

  const required = value => (value ? undefined : 'Required');
  const phoneCheck = value => {
      if (value === undefined) return 'Required';
      const patt = new RegExp(/^((\+7|7|8)+([0-9]){10})$/gm);
      if (!patt.test(value)) return 'Phone number should be 11 digits and begin from +7, 7, or 8';
  }

  if (orderInProcessId === null) return <FallBack />;

  return (
    <Query query={ sharedGraphql.ORDER_BY_ID_QUERY } variables={{ id: orderInProcessId }}>
      {
        ({ data, loading, error }) => {

            if (loading) return <Spin />;
            if (error) return <p>Error :(</p>;
            if (_get(data, ['order', 'orderItems'], []).length === 0) return <FallBack />;

            return (
                <Form onSubmit={onSubmit}>
                    {({ handleSubmit, submitting, pristine, values }) => {
                        return (
                        <form onSubmit={handleSubmit}  className={styles.orderContent}>

                            <Field
                                name="name"
                                validate={required}
                            >
                                {({ input, meta }) => (
                                    <Space className={styles.inputGrid}>
                                        <label>name</label>
                                        <input {...input} type="text" placeholder="Enter your name" required/>
                                        {meta.error && meta.touched && <span className={styles.error}>{meta.error}</span>}
                                    </Space>
                                )}
                            </Field>
                            <Field
                                name="address"
                                validate={required}
                            >
                                {({ input, meta }) => (
                                    <Space className={styles.inputGrid}>
                                        <label>Address</label>
                                        <textarea {...input} type="text" placeholder="Address" required/>
                                        {meta.error && meta.touched && <span className={styles.error}>{meta.error}</span>}
                                    </Space>
                                )}
                            </Field>
                            <Field
                                name="phone"
                                validate={phoneCheck}
                            >
                                {({ input, meta }) => (
                                    <Space className={styles.inputGrid}>
                                        <label>Phone</label>
                                        <input {...input} type="phone" placeholder="Enter Your phone" required/>
                                        {meta.error && meta.touched && <span className={styles.error}>{meta.error}</span>}
                                    </Space>
                                )}
                            </Field>
                            <Field
                                name="comment"
                                validate={required}
                            >
                                {({ input, meta }) => (
                                    <Space className={styles.inputGrid}>
                                        <label>Comment</label>
                                        <textarea {...input} type="text" placeholder="Comment to order" required/>
                                        {meta.error && meta.touched && <span className={styles.error}>{meta.error}</span>}
                                    </Space>
                                )}
                            </Field>

                            <Field
                                name="delivery"
                                type="checkbox"
                            >
                                {({ input }) => (
                                    <Space className={styles.inputGrid}>
                                        <label>Delivery </label>
                                        <input {...input} type="checkbox"/>
                                    </Space>
                                )}
                            </Field>

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

export { Order };