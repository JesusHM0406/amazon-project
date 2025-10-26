export function formatCurency(price = 0){
  return (Math.round(price)/100).toFixed(2);
};