import React, { useState } from 'react';
import { Modal, InputNumber, Space } from 'antd';
import { Form, Field } from 'react-final-form';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import _get from 'lodash/get';

import styles from './create_order_item.module.css';
import * as sharedGraphql from '../../shared/graphql';
import { getPrice } from '../../shared/components';


const CreateOrderItem = ({
   isModalOpen,
   handleCancel,
   handleOk,
   pizza,
   createOrderItem,
   createOrder,
}) => {

  const client = useApolloClient();

  let { data: { orderInProcessId } } = useQuery(sharedGraphql.ORDER_IN_PROCESS_ID_QUERY);
  const { data: { currentCurrency } } = useQuery(sharedGraphql.CURRENT_CURRENCY_QUERY);
  const { data: { exchangeRate } } = useQuery(sharedGraphql.EXCHANGE_RATE_QUERY);

  const [totalPrice, setTotalPrice] = useState(0);

  const quantityValidate = value => {
    if (!value) return 'Required';
    if (value < 0) return 'Shoud be positive Integer'
  }

  const calcTotalPrice = (value) => {
    if (value > 0) {
      setTotalPrice(getPrice(pizza.priceE, currentCurrency, exchangeRate, value))
    } else if (value < 0) {
      setTotalPrice(0);
    }
  }

  const onSubmit = async (formData) => {

    const fetchOrderId = async () => {
      if (orderInProcessId === null) { // if we don't have order yet, let's create one
        const response = await createOrder({ variables: { input: {} } });
        const orderId = _get(response, ['data', 'createOrder', 'id'], null);
        if (orderId) {
          client.writeData({ data: { orderInProcessId: orderId }}); // saving order to local state.
          orderInProcessId = orderId;
          sessionStorage.setItem('orderId', orderId); // saving order to sessionStorage to avoid get id losted on refreshing page.
        }
      }
    }
    await fetchOrderId();

    const updatedFormData = {
      ...formData,
      order: {
        connect: orderInProcessId, // connecting order to orderItem
      },
      product: {
        connect: pizza.id,
      }
    };
    await createOrderItem({ variables: { input: updatedFormData } }); // saving orderItem to with already created order.
    setTotalPrice(0);
    handleOk();
  }

  return (
    <Modal
      title={`How much of ${pizza.name}?`}
      visible={isModalOpen}
      footer={null}
      onCancel={() => {
        setTotalPrice(0);
        handleCancel();
      }}
    >
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form onSubmit={(event) => {
            const response = handleSubmit(event);
            if (response) {
              response.then(form.reset)} // reseting form after submitting.
          }}>
            <Space className={styles.modalContent}>
              <Field
                name="quantity"
                validate={quantityValidate}
              >
                {({ input, meta }) => (
                  <Space>
                    <label>Quantity: </label>
                    <InputNumber
                      name={input.name}
                      value={input.value}
                      onChange={(e) => {
                        input.onChange(e);
                        calcTotalPrice(e);
                      }}
                    />
                    {meta.error && meta.touched && <span className={styles.error}>{meta.error}</span>}
                  </Space>
                )}
              </Field>
              <p className={styles.cost}>Cost: {totalPrice} </p>
              <button type="submit" disabled={submitting || pristine}>Add to basket</button>
            </Space>
          </form>
        )} />
    </Modal>
  )
}

export { CreateOrderItem };