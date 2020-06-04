import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Menu, Dropdown } from 'antd';
import { useApolloClient } from '@apollo/react-hooks';

import * as sharedGraphql from '../shared/graphql';
import styles from './currency.module.css';


const Currency = () => {

    const client = useApolloClient();

    const currencyList = ['USD', 'EUR'];

    const { currentCurrency } = client.readQuery({
        query: sharedGraphql.CURRENT_CURRENCY_QUERY,
    })

    const [currency, setCurrency] = useState(currentCurrency);

    const menu = (
        <Menu>
            {currencyList.map((item, index) => (
                <Menu.Item key={index} onClick={() => {toggleCurrency(item)}}>
                    <p>
                        {item}
                    </p>
                </Menu.Item>
            ))}
        </Menu>
    )

    const toggleCurrency = (currency) => {
        setCurrency(currency);
        client.writeQuery({ 
            query: sharedGraphql.CURRENT_CURRENCY_QUERY,
            data: {
               currentCurrency: currency,
            },
         });
    }

    return (
        <div className={styles.container}>
            <Dropdown overlay={menu} trigger={['click']}>
                <div>
                    Current Currency: {currency} 
                    <DownOutlined/>
                </div>
            </Dropdown>
        </div>
    )
}

export { Currency };