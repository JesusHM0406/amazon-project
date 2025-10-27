import { formatCurency } from "../../../scripts/utils/money.js";

describe('formatCurrency',()=>{
  it('convert cents into dollars',()=>{
    expect(formatCurency(2095)).toEqual('20.95');
  });
})