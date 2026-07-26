// 真实单元测试：直接加载 src/tools/_shared/calc-defs.ts 的真实 compute() 函数，
// 用「独立的标准公式」算出期望值，再和工具输出逐项比对。
// 运行：node --experimental-strip-types scripts/calc-tests.mjs
import { calcDefs } from '../src/tools/_shared/calc-defs.ts';

let pass = 0, fail = 0;
const fails = [];

// 把工具输出里的数字抠出来（去掉千分位逗号、百分号、货币符号）
const num = (s) => parseFloat(String(s).replace(/[^0-9.\-]/g, ''));
// 数值近似比对（相对误差）
function near(a, b, tol = 0.005) {
  if (a === 0) return Math.abs(b) < 1e-9;
  return Math.abs(a - b) / Math.abs(a) <= tol;
}

function check(slug, input, expectations) {
  const rows = calcDefs[slug].compute(input);
  const byLabel = Object.fromEntries(rows.map((r) => [r.label, r]));
  for (const exp of expectations) {
    const row = byLabel[exp.label];
    if (!row) { fail++; fails.push(`[${slug}] 缺少行: ${exp.label}`); continue; }
    let ok = false;
    if (exp.str !== undefined) ok = row.value === exp.str;
    else if (exp.num !== undefined) ok = near(num(row.value), exp.num, exp.tol ?? 0.005);
    if (ok) { pass++; }
    else { fail++; fails.push(`[${slug}] ${exp.label}: 期望 ${exp.str ?? exp.num} 实得 ${row.value}`); }
  }
}

// ---------- 独立标准公式算期望 ----------
// 等额本息月供
const amort = (P, annualPct, years) => {
  const r = annualPct / 100 / 12, n = years * 12;
  return r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};

// 1) BMI
check('bmi-calculator', { h: '170', w: '65' }, [
  { label: 'BMI', num: 65 / (1.7 * 1.7), tol: 0.01 },
]);
// BMI category
{
  const rows = calcDefs['bmi-calculator'].compute({ h: '170', w: '65' });
  const cat = rows[0].sub;
  const exp = (65 / (1.7 * 1.7) < 25 && 65 / (1.7 * 1.7) >= 18.5) ? 'Normal' : '?';
  if (cat === exp) pass++; else { fail++; fails.push(`[bmi] category 期望 ${exp} 实得 ${cat}`); }
}

// 2) age（非确定性，仅做合理性：出生于 2000 年应在 25~27 岁之间）
{
  const rows = calcDefs['age-calculator'].compute({ dob: '2000-01-01' });
  const y = num(rows[0].value);
  if (y >= 25 && y <= 27) pass++; else { fail++; fails.push(`[age] 年份异常: ${y}`); }
}

// 3) date-difference（确定性）
check('date-difference-calculator', { from: '2025-01-01', to: '2026-01-01' }, [
  { label: 'Days', num: 365, tol: 0.001 },
  { label: 'Years', num: 1.0, tol: 0.001 },
]);

// 4) percentage
check('percentage-calculator', { x: '20', y: '150', a: '40', b: '50' }, [
  { label: '20% of 150', num: 30, tol: 0.001 },
  { label: '40 → 50', str: '+25%' },
]);

// 5) loan
{
  const m = amort(100000, 5, 30);
  const total = m * 360;
  check('loan-calculator', { amount: '100000', rate: '5', years: '30' }, [
    { label: 'Monthly payment', num: m, tol: 0.002 },
    { label: 'Total interest', num: total - 100000, tol: 0.002 },
    { label: 'Total paid', num: total, tol: 0.002 },
  ]);
}

// 6) tip
check('tip-calculator', { bill: '100', tip: '15', people: '1' }, [
  { label: 'Tip amount', num: 15, tol: 0.001 },
  { label: 'Total', num: 115, tol: 0.001 },
  { label: 'Per person', num: 115, tol: 0.001 },
]);

// 7) discount
check('discount-calculator', { price: '100', disc: '20' }, [
  { label: 'Final price', num: 80, tol: 0.001 },
  { label: 'You save', num: 20, tol: 0.001 },
]);

// 8) compound interest
{
  const A = 1000 * Math.pow(1 + 0.05 / 12, 12 * 10);
  check('compound-interest-calculator', { principal: '1000', rate: '5', years: '10', n: '12' }, [
    { label: 'Final amount', num: A, tol: 0.002 },
    { label: 'Interest earned', num: A - 1000, tol: 0.002 },
  ]);
}

// 9) scientific（经由公共 compute 接口）
{
  const ok = calcDefs['scientific-calculator'].compute({ expr: '2+3*4^2' })[0];
  if (ok.value === '50') pass++; else { fail++; fails.push(`[scientific] 2+3*4^2 期望 50 实得 ${ok.value}`); }
  const inv = calcDefs['scientific-calculator'].compute({ expr: '2++' })[0];
  if (inv.value === '—' && /Invalid/.test(inv.sub || '')) pass++;
  else { fail++; fails.push(`[scientific] 非法表达式未返回 Invalid`); }
  const zero = calcDefs['scientific-calculator'].compute({ expr: '1/0' })[0];
  if (zero.value === '—' && /Invalid/.test(zero.sub || '')) pass++;
  else { fail++; fails.push(`[scientific] 1/0 未返回 Invalid`); }
}

// 10) mortgage（新增）
{
  const m = amort(300000, 6.5, 30);
  const total = m * 360;
  check('mortgage-calculator', { principal: '300000', rate: '6.5', years: '30' }, [
    { label: 'Monthly payment', num: m, tol: 0.002 },
    { label: 'Total interest', num: total - 300000, tol: 0.002 },
    { label: 'Total paid', num: total, tol: 0.002 },
  ]);
}

// 11) sales-tax（新增）
check('sales-tax-calculator', { amount: '100', rate: '8' }, [
  { label: 'Tax', num: 8, tol: 0.001 },
  { label: 'Total', num: 108, tol: 0.001 },
]);

// 12) vat（新增）
check('vat-calculator', { amount: '100', rate: '20' }, [
  { label: 'VAT', num: 20, tol: 0.001 },
  { label: 'Gross', num: 120, tol: 0.001 },
]);

// 13) salary（新增）
check('salary-calculator', { rate: '25', hours: '40', weeks: '52' }, [
  { label: 'Annual salary', num: 25 * 40 * 52, tol: 0.001 },
  { label: 'Weekly', num: 25 * 40, tol: 0.001 },
]);

// 14) roi（新增）
check('roi-calculator', { initial: '1000', final: '1500' }, [
  { label: 'ROI', str: '50.00%' },
  { label: 'Profit', num: 500, tol: 0.001 },
]);

// 15) break-even（新增）
check('break-even-calculator', { fixed: '5000', price: '50', cost: '30' }, [
  { label: 'Break-even units', num: 250, tol: 0.001 },
  { label: 'Break-even revenue', num: 250 * 50, tol: 0.001 },
]);

// 16) savings-goal（新增）
{
  const r = 0.05, t = 3, goal = 10000, current = 1000;
  const fvCur = current * Math.pow(1 + r, t);
  const rem = Math.max(goal - fvCur, 0);
  const months = t * 12;
  const monthly = r === 0 ? rem / months : (rem * (r / 12)) / (Math.pow(1 + r / 12, months) - 1);
  check('savings-goal-calculator', { goal: '10000', current: '1000', rate: '5', years: '3' }, [
    { label: 'Monthly to save', num: monthly, tol: 0.002 },
    { label: 'Future value of current savings', num: fvCur, tol: 0.002 },
  ]);
}

// 17) retirement（新增）
{
  const age = 30, retire = 65, current = 10000, monthly = 500, r = 0.07;
  const years = retire - age, months = years * 12;
  const fvCur = current * Math.pow(1 + r, years);
  const fvContrib = r === 0 ? monthly * months : monthly * ((Math.pow(1 + r / 12, months) - 1) / (r / 12));
  check('retirement-calculator', { age: '30', retire: '65', current: '10000', monthly: '500', rate: '7' }, [
    { label: 'Years to retirement', str: '35' },
    { label: 'Projected savings', num: fvCur + fvContrib, tol: 0.003 },
  ]);
}

// 18) inflation（新增）
check('inflation-calculator', { amount: '100', rate: '3', years: '10' }, [
  { label: 'Future cost', num: 100 * Math.pow(1.03, 10), tol: 0.002 },
  { label: 'Lost purchasing power', num: 100 * Math.pow(1.03, 10) - 100, tol: 0.002 },
]);

// 19) tdee（新增）
{
  const bmr = 88.362 + 13.397 * 70 + 4.799 * 170 - 5.677 * 30;
  check('tdee-calculator', { gender: '1', age: '30', weight: '70', height: '170', activity: '1.55' }, [
    { label: 'BMR (cal/day)', num: bmr, tol: 0.001 },
    { label: 'TDEE (cal/day)', num: bmr * 1.55, tol: 0.001 },
  ]);
}

// 20) calorie（新增）
{
  const bmr = 88.362 + 13.397 * 70 + 4.799 * 170 - 5.677 * 30;
  check('calorie-calculator', { gender: '1', age: '30', weight: '70', height: '170', activity: '1.55' }, [
    { label: 'Maintain weight', num: bmr * 1.55, tol: 0.001 },
    { label: 'Weight loss', num: bmr * 1.55 - 500, tol: 0.001 },
  ]);
}

// 21) pregnancy（新增，+280 天）
{
  const d = new Date('2026-01-01');
  const due = new Date(d.getTime() + 280 * 86400000);
  const fmt = (x) => x.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  const rows = calcDefs['pregnancy-due-date-calculator'].compute({ lmp: '2026-01-01' });
  if (rows[0].value === fmt(due)) pass++; else { fail++; fails.push(`[pregnancy] due 期望 ${fmt(due)} 实得 ${rows[0].value}`); }
}

// 22) body-fat（新增）
{
  const h = 175, waist = 85, neck = 38;
  const bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(h)) - 450;
  check('body-fat-calculator', { gender: '1', height: '175', waist: '85', neck: '38', hip: '95' }, [
    { label: 'Estimated body fat', num: bf, tol: 0.01 },
  ]);
}

// ---------- 报告 ----------
console.log(`\n计算器单元测试结果: ${pass} 通过 / ${fail} 失败 (共 ${pass + fail} 项断言)`);
if (fails.length) {
  console.log('\n失败明细:');
  for (const f of fails) console.log('  ✗', f);
  process.exit(1);
} else {
  console.log('✓ 全部通过');
}
