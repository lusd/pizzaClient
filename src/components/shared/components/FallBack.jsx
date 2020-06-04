import React from 'react';
import { Link } from 'react-router-dom';
import { Empty } from 'antd';

const FallBack = () => (
    <div>
        <Empty/>
        <Link to="/">Return to home page</Link>
    </div>
)

export { FallBack };