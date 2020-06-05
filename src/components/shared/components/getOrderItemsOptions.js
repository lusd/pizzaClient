export const getOrderItemsOptions = (items) => {
  if (!items || items.length < 1) return [];
  return items.map(item => ({ value: item.id, label: item.name }));
}