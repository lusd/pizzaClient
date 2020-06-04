import React from 'react';
import { Mutation } from '@apollo/react-components';
import * as sharedGraphql from '../shared/graphql';
import { Order } from './Order';

const OrderContainer = () => (
    <Mutation mutation={ sharedGraphql.ORDER_UPDATE_MUTATION }>
      {(updateOrder) => (
          <Order updateOrder={updateOrder} />
      )}
    </Mutation>
 )

export { OrderContainer };