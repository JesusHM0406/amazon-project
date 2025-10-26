import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

export const deliveryOptions = [
  {id: '1', priceCents: 0, days: 7},
  {id: '2', priceCents: 499, days: 3},
  {id: '3', priceCents: 999, days: 1}
];

function isWeekend(date){
  const date = date.format('dddd');
  return date === 'Sunday' || date === 'Saturday';
}