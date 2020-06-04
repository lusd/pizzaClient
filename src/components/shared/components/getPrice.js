const getPrice = (price, currency, exchangeRate, items = 1) => {
    if (currency === 'USD') {
        return `${(price * items).toFixed(2)} $`;
    }
    if (currency === 'EUR') {
        return `${(price * items * exchangeRate).toFixed(2)} €`;
    }
};

export { getPrice };