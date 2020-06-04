import React from 'react';
import { Mutation } from '@apollo/react-components';
import { useQuery } from '@apollo/react-hooks';

import * as sharedGraphql from '../../shared/graphql';
import { CreateOrderItem } from './CreateOrderItem';


const CreateOrderItemContainer = ({isModalOpen, handleCancel, handleOk, pizza}) => {

  const { data: { orderInProcessId } } = useQuery(sharedGraphql.ORDER_IN_PROCESS_ID_QUERY);

  return (
    <Mutation mutation={sharedGraphql.ORDER_CREATE_MUTATION}>
      {(createOrder) => (
        <Mutation mutation={sharedGraphql.ORDER_ITEM_CREATE_MUTATION} refetchQueries={[{ query: sharedGraphql.ORDER_BY_ID_QUERY, variables: { id: orderInProcessId } }]}>
          {(createOrderItem) => (
            <CreateOrderItem
              createOrder={createOrder}
              createOrderItem={createOrderItem}
              isModalOpen={isModalOpen}
              handleCancel={handleCancel}
              handleOk={handleOk}
              pizza={pizza}
            />
          )}
        </Mutation>
      )}
    </Mutation>
  )
}

export { CreateOrderItemContainer };