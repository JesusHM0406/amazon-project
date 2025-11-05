import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

export const deliveryOptions = [
  {id: '1', priceCents: 0, days: 7},
  {id: '2', priceCents: 499, days: 3},
  {id: '3', priceCents: 999, days: 1}
];

export function isWeekend(date){
  const dateFormated = date.format('dddd');
  return dateFormated === 'Sunday' || dateFormated === 'Saturday';
};

export function calculateDeliveryDate(option){
  let deliveryDate = dayjs();
  let remainingWorkDays = option.days;

  while (remainingWorkDays > 0){
    deliveryDate = deliveryDate.add(1,'days');
    if (!isWeekend(deliveryDate)) remainingWorkDays--;
  }

  return deliveryDate.format('YYYY, dddd MMMM D');
};