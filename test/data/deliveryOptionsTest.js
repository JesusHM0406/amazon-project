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

describe('calculateDeliveryDate',()=>{
  beforeEach(()=>{
    jasmine.clock().install();
  });

  afterEach(()=>{
    jasmine.clock().uninstall();
  })

  it('returns the next day if the delivery option is 3 (1 day) and is weekday (not friday)',()=>{
    // Tuesday
    const fixedDate = new Date('January 21, 2025');
    jasmine.clock().mockDate(fixedDate);

    expect(calculateDeliveryDate(deliveryOptions[2])).toEqual('Wednesday, January 22');
  });

  it('skips the weekend if its friday',()=>{
    // Friday
    const fixedDate = new Date('January 24, 2025');
    jasmine.clock().mockDate(fixedDate);

    expect(calculateDeliveryDate(deliveryOptions[2])).toEqual('Monday, January 27');
  });

  it('skips the weekend if the option is 1 (7 days) and is monday',()=>{
    // Monday
    const fixedDate = new Date('January 20, 2025');
    jasmine.clock().mockDate(fixedDate);

    // 9 Days after
    expect(calculateDeliveryDate(deliveryOptions[0])).toEqual('Wednesday, January 29');
  });

  it('skips the weekend if the option is 2 (3 days) and is thursday',()=>{
    // Thursday
    const fixedDate = new Date('January 23, 2025');
    jasmine.clock().mockDate(fixedDate);

    // 5 Days after
    expect(calculateDeliveryDate(deliveryOptions[1])).toEqual('Tuesday, January 28');
  });
});