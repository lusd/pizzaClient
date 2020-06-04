import React from 'react';
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import 'antd/dist/antd.css';

import { typeDefs } from './resolvers';
import { PizzaList } from './components/PizzaList';
import { OrderContainer } from './components/Order';
import { Basket } from './components/Basket';
import { Currency } from './components/Currency';
import styles from './App.module.css';


const client =  new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache({
    dataIdFromObject: object => object.id
  }),
  typeDefs
});
client.cache.writeData({
  data: {
    orderInProcessId: sessionStorage.getItem('orderId'),
    currentCurrency: 'USD',
    exchangeRate: '0.89',
  }
})


class Application extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <ApolloProvider client={client}>
          <Layout>
            <Layout.Header className={styles.header}>
              <Basket />
              <Currency />
            </Layout.Header>
            <Layout.Content className={styles.content}>
              <Route>
                <Switch>
                  <Route exact path="/" component={PizzaList} />
                  <Route exact path="/order" component={OrderContainer} />
                  <Redirect to="/" />
                </Switch>
              </Route>
            </Layout.Content>
          </Layout>
        </ApolloProvider>
      </BrowserRouter>
    )
  }
} 

export default Application;