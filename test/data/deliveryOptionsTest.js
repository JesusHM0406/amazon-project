import { deliveryOptions, isWeekend, calculateDeliveryDate } from "../../data/deliverOptions.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

describe('isWeekend',()=>{
  it('returns true if it is sunday',()=>{
    // This day is sunday
    let randomDate = new Date('October 20, 2002');
    randomDate = dayjs(randomDate);

    expect(isWeekend(randomDate)).toEqual(true);
  });

  it('returns true if it is saturday',()=>{
    // This day is saturday
    let randomDate = new Date('October 19, 2002');
    randomDate = dayjs(randomDate);

    expect(isWeekend(randomDate)).toEqual(true);
  });

  it('returns false if it is weekday',()=>{
    // This day is monday
    let randomDate = new Date('October 21, 2002');
    randomDate = dayjs(randomDate);

    expect(isWeekend(randomDate)).toEqual(false);
  });

  it('handles other dates',()=>{
    // This day is sunday
    let randomDate = new Date('March 2, 2025');
    randomDate = dayjs(randomDate);

    expect(isWeekend(randomDate)).toEqual(true);
  });

  it('handles other dates',()=>{
    // This day is wednesday
    let randomDate = new Date('December 25, 2019');
    randomDate = dayjs(randomDate);

    expect(isWeekend(randomDate)).toEqual(false);
  });
});