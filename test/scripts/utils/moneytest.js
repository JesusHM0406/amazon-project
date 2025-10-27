import { formatCurency } from "../../../scripts/utils/money.js";

describe('formatCurrency',()=>{
  it('convert cents into dollars',()=>{
    expect(formatCurency(2095)).toEqual('20.95');
  });

  it('works with 0',()=>{
    expect(formatCurency(0)).toEqual('0.00');
  });

  it('works with negative numbers',()=>{
    expect(formatCurency(-1020)).toEqual('-10.20');
  });

  it('works with empty value',()=>{
    expect(formatCurency()).toEqual('0.00');
  });

  it('rounds up to the nearest cent',()=>{
    expect(formatCurency(2000.5)).toEqual('20.01');
  });

  it('rounds down to the nearest cent',()=>{
    expect(formatCurency(2000.4)).toEqual('20.00');
  });
})