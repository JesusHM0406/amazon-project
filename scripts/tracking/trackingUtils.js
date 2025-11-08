import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

export function calculateDeliveryProgress( orderTime, deliveryDate, dayjsFunc = dayjs ){
    const deliveryTime = dayjsFunc(deliveryDate);
    const orderTimeObj = dayjsFunc(orderTime);

    const currentTime = dayjsFunc();

    const totalDuration = deliveryTime.diff(orderTimeObj, 'minutes');

    const timeElapsed = currentTime.diff(orderTimeObj, 'minutes');

    if (totalDuration <= 0) return 100;
    if (timeElapsed <= 0) return 0;

    const progress = (timeElapsed / totalDuration) * 100;

    return Math.max(0, Math.min(100, Math.round(progress)));
};