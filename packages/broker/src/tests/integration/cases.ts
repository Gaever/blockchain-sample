import case1 from './cases/1-xch-ach-common-flow';
import case2 from './cases/2-xch-ach-payback-expired';
import case3 from './cases/3-xch-ach-bc-fee-fixed-fee';
import { TCase } from './helpers';

let casesArr: TCase[] = [case1, case2, case3];
const onlyIndex = casesArr.findIndex(item => item.only);

if (onlyIndex !== -1) {
  casesArr = casesArr.map((item, index) => (index === onlyIndex ? item : { ...item, skip: true }));
}

export default casesArr;
