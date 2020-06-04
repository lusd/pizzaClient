import _get from 'lodash/get';

const getTotalOrderCost = (orderItems, currency, exchangeRate, delivery = false) => {

  if (orderItems.length === 0) {
    return 0;
  }
  const initialValue = 0;

  let totalPrice = orderItems.reduce((acc, item) => {
    const quantity = _get(item, ['quantity'], null);
    const price = _get(item, ['product', 'priceE'], null);
    if (quantity === null || price === null) {
      return 0;
    };
    return acc + quantity * price;
  }, initialValue);

  if (delivery) totalPrice = totalPrice + 5;

  if (currency === 'USD') {
    return totalPrice.toFixed(2) + "$";
  }

  else if (currency === 'EUR') {
    return (totalPrice * exchangeRate).toFixed(2) + '€';
  }
};

export { getTotalOrderCost };