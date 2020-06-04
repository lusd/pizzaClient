import { gql } from 'apollo-boost';

export const PRODUCTS_LIST_QUERY = gql`
  query Products {
    products {
      id
      name
      priceE
      description
      imageUrl
    }
  }
`;

export const ORDER_BY_ID_QUERY = gql`
  query Order($id: ID!) {
    order(id: $id) {
      id
      comment
      address
      orderItems {
        id
        quantity
        product {
          id
          name
          description
          imageUrl
          priceE
        }
      }
    }
  }
`

export const ORDER_ITEMS_LIST_QUERY = gql`
  query OrderItems{
    orderItem {
      id
      quantity
      product {
        id
        name
        description
        priceE
        imageUrl
      }
      order {
        id
        address
        comment
      }
    }
  }
`

export const ORDER_ITEM_CREATE_MUTATION = gql`
  mutation CreateOrderItem($input: CreateOrderItemInput!){  
    createOrderItem(input: $input) {
      id
    }
  }
`

export const ORDER_ITEM_DELETE_MUTATION = gql`
  mutation DeleteOrderItem($id: ID!) {
    deleteOrderItem(id: $id) {
      id
    }
  }
`

export const ORDER_UPDATE_MUTATION = gql`
  mutation UpdateOrder($input: UpdateOrderInput!) {
    updateOrder(input: $input) {
      id
      address
      comment
      phone
      name
      delivery
      orderItems {
        quantity
        product {
          id
          name
          description
          priceE
          imageUrl
        }
      }
    }
  } 
`;

export const ORDER_CREATE_MUTATION = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
    }
  }
`

export const ORDER_IN_PROCESS_ID_QUERY = gql`
  query OrderInProcess {
    orderInProcessId @client
  }
`

export const CURRENT_CURRENCY_QUERY = gql`
  query CurrentCurrency {
    currentCurrency @client
  }
`

export const EXCHANGE_RATE_QUERY = gql`
  query ExchangeRate {
    exchangeRate @client
  }
`
