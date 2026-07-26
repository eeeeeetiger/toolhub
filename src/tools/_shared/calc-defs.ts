// 计算器定义：9 个通用计算器（字段 + 纯函数计算），由 CalculatorShell 统一渲染。
// 科学计算器内含一个安全的表达式求值器（shunting-yard，禁用 eval）。

export interface FieldDef {
  key: string;
  label: string;
  type: 'number' | 'date' | 'text';
  default?: string;
  placeholder?: string;
}

export interface ResultRow {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}

export interface CalcDef {
  fields: FieldDef[];
  compute: (v: Record<string, string>) => ResultRow[];
}

const num = (s?: string): number => (s == null ? NaN : parseFloat(s));

function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

function dateParts(from: Date, to: Date) {
  let y = to.getFullYear() - from.getFullYear();
  let m = to.getMonth() - from.getMonth();
  let d = to.getDate() - from.getDate();
  if (d < 0) {
    m--;
    d += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
  }
  if (m < 0) {
    y--;
    m += 12;
  }
  return { y, m, d };
}

// ---------- 科学计算器：安全表达式求值 ----------
function evalExpr(input: string): number | null {
  if (!input || !input.trim()) return null;
  const s = input.replace(/\s+/g, '');
  const tokens: { t: string; v: number }[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if ((c >= '0' && c <= '9') || c === '.') {
      let j = i + 1;
      while (j < s.length && ((s[j] >= '0' && s[j] <= '9') || s[j] === '.')) j++;
      tokens.push({ t: 'n', v: parseFloat(s.slice(i, j)) });
      i = j;
    } else if ('+-*/^()'.includes(c)) {
      tokens.push({ t: c, v: 0 });
      i++;
    } else {
      return null;
    }
  }
  const out: { t: string; v: number }[] = [];
  const ops: string[] = [];
  const prec: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
  const rightAssoc = (o: string) => o === '^';
  for (let k = 0; k < tokens.length; k++) {
    const tk = tokens[k];
    if (tk.t === 'n') out.push(tk);
    else if (tk.t === '(') ops.push('(');
    else if (tk.t === ')') {
      while (ops.length && ops[ops.length - 1] !== '(') out.push({ t: ops.pop()!, v: 0 });
      if (ops[ops.length - 1] === '(') ops.pop();
      else return null;
    } else {
      if (tk.t === '-' && (k === 0 || tokens[k - 1].t === '(' || '+-*/^'.includes(tokens[k - 1].t))) {
        out.push({ t: 'n', v: 0 });
        ops.push('-');
        continue;
      }
      while (ops.length && ops[ops.length - 1] !== '(') {
        const top = ops[ops.length - 1];
        if ((!rightAssoc(tk.t) && prec[top] >= prec[tk.t]) || (rightAssoc(tk.t) && prec[top] > prec[tk.t])) {
          out.push({ t: ops.pop()!, v: 0 });
        } else break;
      }
      ops.push(tk.t);
    }
  }
  while (ops.length) {
    const o = ops.pop()!;
    if (o === '(') return null;
    out.push({ t: o, v: 0 });
  }
  const st: number[] = [];
  for (const tk of out) {
    if (tk.t === 'n') st.push(tk.v);
    else {
      const b = st.pop();
      const a = st.pop();
      if (a === undefined || b === undefined) return null;
      let r = 0;
      switch (tk.t) {
        case '+': r = a + b; break;
        case '-': r = a - b; break;
        case '*': r = a * b; break;
        case '/': if (b === 0) return null; r = a / b; break;
        case '^': r = Math.pow(a, b); break;
        default: return null;
      }
      st.push(r);
    }
  }
  if (st.length !== 1 || !isFinite(st[0])) return null;
  return st[0];
}

export const calcDefs: Record<string, CalcDef> = {
  'bmi-calculator': {
    fields: [
      { key: 'h', label: 'Height (cm)', type: 'number', default: '170' },
      { key: 'w', label: 'Weight (kg)', type: 'number', default: '65' },
    ],
    compute: (v) => {
      const hm = num(v.h) / 100;
      const wk = num(v.w);
      if (!(hm > 0) || !(wk > 0)) return [];
      const bmi = wk / (hm * hm);
      return [{ label: 'BMI', value: bmi.toFixed(1), sub: bmiCategory(bmi), accent: true }];
    },
  },
  'age-calculator': {
    fields: [{ key: 'dob', label: 'Date of birth', type: 'date', default: '2000-01-01' }],
    compute: (v) => {
      const birth = new Date(v.dob);
      if (isNaN(birth.getTime())) return [];
      const now = new Date();
      const { y, m, d } = dateParts(birth, now);
      const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000);
      return [
        { label: 'Years', value: String(y), accent: true },
        { label: 'Months', value: String(m) },
        { label: 'Days', value: String(d) },
        { label: 'Total days', value: totalDays.toLocaleString() },
      ];
    },
  },
  'date-difference-calculator': {
    fields: [
      { key: 'from', label: 'Start date', type: 'date', default: '2025-01-01' },
      { key: 'to', label: 'End date', type: 'date', default: '2026-01-01' },
    ],
    compute: (v) => {
      const a = new Date(v.from);
      const b = new Date(v.to);
      if (isNaN(a.getTime()) || isNaN(b.getTime())) return [];
      const ms = b.getTime() - a.getTime();
      const sign = ms < 0 ? -1 : 1;
      const abs = Math.abs(ms);
      const days = Math.floor(abs / 86400000);
      return [
        { label: 'Days', value: (sign * days).toLocaleString(), accent: true },
        { label: 'Weeks', value: (sign * (days / 7)).toFixed(1) },
        { label: 'Months', value: (sign * (days / 30.44)).toFixed(1) },
        { label: 'Years', value: (sign * (days / 365.25)).toFixed(2) },
      ];
    },
  },
  'percentage-calculator': {
    fields: [
      { key: 'x', label: 'X (%)', type: 'number', default: '20' },
      { key: 'y', label: 'Y', type: 'number', default: '150' },
      { key: 'a', label: 'A', type: 'number', default: '40' },
      { key: 'b', label: 'B', type: 'number', default: '50' },
    ],
    compute: (v) => {
      const x = num(v.x), y = num(v.y), a = num(v.a), b = num(v.b);
      if ([x, y, a, b].some((n) => isNaN(n))) return [];
      const of = (x / 100) * y;
      const change = a !== 0 ? ((b - a) / Math.abs(a)) * 100 : NaN;
      const rows: ResultRow[] = [
        { label: `${x}% of ${y}`, value: String(parseFloat(of.toPrecision(6))), accent: true },
      ];
      if (!isNaN(change)) {
        rows.push({ label: `${a} → ${b}`, value: `${change >= 0 ? '+' : ''}${parseFloat(change.toPrecision(5))}%`, sub: change >= 0 ? 'increase' : 'decrease' });
      }
      return rows;
    },
  },
  'loan-calculator': {
    fields: [
      { key: 'amount', label: 'Loan amount', type: 'number', default: '100000' },
      { key: 'rate', label: 'Annual rate (%)', type: 'number', default: '5' },
      { key: 'years', label: 'Term (years)', type: 'number', default: '30' },
    ],
    compute: (v) => {
      const P = num(v.amount), annual = num(v.rate), n = num(v.years) * 12;
      const r = annual / 100 / 12;
      if (!(P > 0) || !(n > 0)) return [];
      const monthly = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const total = monthly * n;
      const interest = total - P;
      const money = (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2 });
      return [
        { label: 'Monthly payment', value: money(monthly), accent: true },
        { label: 'Total interest', value: money(interest) },
        { label: 'Total paid', value: money(total) },
      ];
    },
  },
  'tip-calculator': {
    fields: [
      { key: 'bill', label: 'Bill amount', type: 'number', default: '100' },
      { key: 'tip', label: 'Tip (%)', type: 'number', default: '15' },
      { key: 'people', label: 'Number of people', type: 'number', default: '1' },
    ],
    compute: (v) => {
      const bill = num(v.bill), tip = num(v.tip), ppl = num(v.people);
      if (!(bill >= 0) || !(tip >= 0) || !(ppl > 0)) return [];
      const tipAmt = bill * (tip / 100);
      const total = bill + tipAmt;
      const money = (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2 });
      return [
        { label: 'Tip amount', value: money(tipAmt), accent: true },
        { label: 'Total', value: money(total) },
        { label: 'Per person', value: money(total / ppl) },
      ];
    },
  },
  'discount-calculator': {
    fields: [
      { key: 'price', label: 'Original price', type: 'number', default: '100' },
      { key: 'disc', label: 'Discount (%)', type: 'number', default: '20' },
    ],
    compute: (v) => {
      const price = num(v.price), disc = num(v.disc);
      if (!(price >= 0) || !(disc >= 0)) return [];
      const final = price * (1 - disc / 100);
      const saved = price - final;
      const money = (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2 });
      return [
        { label: 'Final price', value: money(final), accent: true },
        { label: 'You save', value: money(saved) },
        { label: 'Saved', value: `${disc}%` },
      ];
    },
  },
  'compound-interest-calculator': {
    fields: [
      { key: 'principal', label: 'Principal', type: 'number', default: '1000' },
      { key: 'rate', label: 'Annual rate (%)', type: 'number', default: '5' },
      { key: 'years', label: 'Years', type: 'number', default: '10' },
      { key: 'n', label: 'Compounds per year', type: 'number', default: '12' },
    ],
    compute: (v) => {
      const P = num(v.principal), r = num(v.rate) / 100, t = num(v.years), n = num(v.n);
      if (!(P > 0) || !(n > 0) || !(t >= 0)) return [];
      const A = P * Math.pow(1 + r / n, n * t);
      const interest = A - P;
      const money = (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2 });
      return [
        { label: 'Final amount', value: money(A), accent: true },
        { label: 'Interest earned', value: money(interest) },
      ];
    },
  },
  'scientific-calculator': {
    fields: [{ key: 'expr', label: 'Expression (e.g. 2+3*4^2)', type: 'text', default: '2+3*4^2' }],
    compute: (v) => {
      const res = evalExpr(v.expr || '');
      if (res === null) return [{ label: 'Result', value: '—', sub: 'Invalid expression' }];
      const rounded = parseFloat(res.toPrecision(12));
      return [{ label: 'Result', value: String(rounded), accent: true }];
    },
  },
  'mortgage-calculator': {
    fields: [
      { key: 'principal', label: 'Loan amount', type: 'number', default: '300000' },
      { key: 'rate', label: 'Annual interest rate (%)', type: 'number', default: '6.5' },
      { key: 'years', label: 'Loan term (years)', type: 'number', default: '30' },
    ],
    compute: (v) => {
      const P = num(v.principal), annual = num(v.rate), n = num(v.years) * 12;
      const r = annual / 100 / 12;
      if (!(P > 0) || !(n > 0)) return [];
      const monthly = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const total = monthly * n;
      const m = (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2 });
      return [
        { label: 'Monthly payment', value: m(monthly), accent: true },
        { label: 'Total interest', value: m(total - P) },
        { label: 'Total paid', value: m(total) },
      ];
    },
  },
  'sales-tax-calculator': {
    fields: [
      { key: 'amount', label: 'Amount', type: 'number', default: '100' },
      { key: 'rate', label: 'Sales tax (%)', type: 'number', default: '8' },
    ],
    compute: (v) => {
      const amount = num(v.amount), rate = num(v.rate);
      if (!(amount >= 0) || !(rate >= 0)) return [];
      const tax = amount * (rate / 100);
      const m = (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2 });
      return [
        { label: 'Tax', value: m(tax), accent: true },
        { label: 'Total', value: m(amount + tax) },
      ];
    },
  },
  'vat-calculator': {
    fields: [
      { key: 'amount', label: 'Net amount', type: 'number', default: '100' },
      { key: 'rate', label: 'VAT (%)', type: 'number', default: '20' },
    ],
    compute: (v) => {
      const amount = num(v.amount), rate = num(v.rate);
      if (!(amount >= 0) || !(rate >= 0)) return [];
      const vat = amount * (rate / 100);
      const m = (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2 });
      return [
        { label: 'VAT', value: m(vat), accent: true },
        { label: 'Gross', value: m(amount + vat) },
      ];
    },
  },
  'salary-calculator': {
    fields: [
      { key: 'rate', label: 'Hourly rate', type: 'number', default: '25' },
      { key: 'hours', label: 'Hours / week', type: 'number', default: '40' },
      { key: 'weeks', label: 'Weeks / year', type: 'number', default: '52' },
    ],
    compute: (v) => {
      const rate = num(v.rate), hours = num(v.hours), weeks = num(v.weeks);
      if (!(rate >= 0) || !(hours > 0) || !(weeks > 0)) return [];
      const annual = rate * hours * weeks;
      const m = (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2 });
      return [
        { label: 'Annual salary', value: m(annual), accent: true },
        { label: 'Monthly', value: m(annual / 12) },
        { label: 'Weekly', value: m(rate * hours) },
      ];
    },
  },
  'roi-calculator': {
    fields: [
      { key: 'initial', label: 'Initial investment', type: 'number', default: '1000' },
      { key: 'final', label: 'Final value', type: 'number', default: '1500' },
    ],
    compute: (v) => {
      const initial = num(v.initial), final = num(v.final);
      if (!(initial > 0)) return [];
      const profit = final - initial;
      const roi = (profit / initial) * 100;
      const m = (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2 });
      return [
        { label: 'ROI', value: `${roi.toFixed(2)}%`, accent: true },
        { label: 'Profit', value: m(profit) },
      ];
    },
  },
  'break-even-calculator': {
    fields: [
      { key: 'fixed', label: 'Fixed costs', type: 'number', default: '5000' },
      { key: 'price', label: 'Price per unit', type: 'number', default: '50' },
      { key: 'cost', label: 'Cost per unit', type: 'number', default: '30' },
    ],
    compute: (v) => {
      const fixed = num(v.fixed), price = num(v.price), cost = num(v.cost);
      const margin = price - cost;
      if (!(fixed >= 0) || !(margin > 0)) return [];
      const units = fixed / margin;
      const m = (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2 });
      return [
        { label: 'Break-even units', value: m(Math.ceil(units)), accent: true },
        { label: 'Break-even revenue', value: m(units * price) },
      ];
    },
  },
  'savings-goal-calculator': {
    fields: [
      { key: 'goal', label: 'Savings goal', type: 'number', default: '10000' },
      { key: 'current', label: 'Current savings', type: 'number', default: '1000' },
      { key: 'rate', label: 'Annual return (%)', type: 'number', default: '5' },
      { key: 'years', label: 'Years', type: 'number', default: '3' },
    ],
    compute: (v) => {
      const goal = num(v.goal), current = num(v.current), r = num(v.rate) / 100, t = num(v.years);
      if (!(goal > 0) || !(t > 0)) return [];
      const fvCurrent = current * Math.pow(1 + r, t);
      const remaining = Math.max(goal - fvCurrent, 0);
      const monthly = r === 0 ? remaining / (t * 12) : (remaining * (r / 12)) / (Math.pow(1 + r / 12, t * 12) - 1);
      const m = (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2 });
      return [
        { label: 'Monthly to save', value: m(monthly), accent: true },
        { label: 'Future value of current savings', value: m(fvCurrent) },
      ];
    },
  },
  'retirement-calculator': {
    fields: [
      { key: 'age', label: 'Current age', type: 'number', default: '30' },
      { key: 'retire', label: 'Retirement age', type: 'number', default: '65' },
      { key: 'current', label: 'Current savings', type: 'number', default: '10000' },
      { key: 'monthly', label: 'Monthly contribution', type: 'number', default: '500' },
      { key: 'rate', label: 'Annual return (%)', type: 'number', default: '7' },
    ],
    compute: (v) => {
      const age = num(v.age), retire = num(v.retire), current = num(v.current), monthly = num(v.monthly), r = num(v.rate) / 100;
      const years = retire - age;
      if (!(years > 0) || !(r >= 0)) return [];
      const months = years * 12;
      const fvCurrent = current * Math.pow(1 + r, years);
      const fvContrib = r === 0 ? monthly * months : monthly * ((Math.pow(1 + r / 12, months) - 1) / (r / 12));
      const total = fvCurrent + fvContrib;
      const m = (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2 });
      return [
        { label: 'Years to retirement', value: String(Math.round(years)), accent: true },
        { label: 'Projected savings', value: m(total) },
      ];
    },
  },
  'inflation-calculator': {
    fields: [
      { key: 'amount', label: 'Today\'s amount', type: 'number', default: '100' },
      { key: 'rate', label: 'Inflation rate (%)', type: 'number', default: '3' },
      { key: 'years', label: 'Years', type: 'number', default: '10' },
    ],
    compute: (v) => {
      const amount = num(v.amount), r = num(v.rate) / 100, t = num(v.years);
      if (!(amount >= 0) || !(t >= 0)) return [];
      const future = amount * Math.pow(1 + r, t);
      const m = (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2 });
      return [
        { label: 'Future cost', value: m(future), accent: true },
        { label: 'Lost purchasing power', value: m(future - amount) },
      ];
    },
  },
  'tdee-calculator': {
    fields: [
      { key: 'gender', label: 'Gender (1=male,2=female)', type: 'number', default: '1' },
      { key: 'age', label: 'Age', type: 'number', default: '30' },
      { key: 'weight', label: 'Weight (kg)', type: 'number', default: '70' },
      { key: 'height', label: 'Height (cm)', type: 'number', default: '170' },
      { key: 'activity', label: 'Activity (1.2-1.9)', type: 'number', default: '1.55' },
    ],
    compute: (v) => {
      const gender = num(v.gender), age = num(v.age), w = num(v.weight), h = num(v.height), act = num(v.activity);
      if (!(w > 0) || !(h > 0) || !(age > 0) || !(act > 0)) return [];
      const bmr = gender === 2
        ? 447.593 + 9.247 * w + 3.098 * h - 4.33 * age
        : 88.362 + 13.397 * w + 4.799 * h - 5.677 * age;
      const tdee = bmr * act;
      const m = (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 0 });
      return [
        { label: 'BMR (cal/day)', value: m(bmr), accent: true },
        { label: 'TDEE (cal/day)', value: m(tdee) },
        { label: 'To lose 0.5kg/wk', value: m(tdee - 500) },
        { label: 'To gain 0.5kg/wk', value: m(tdee + 500) },
      ];
    },
  },
  'calorie-calculator': {
    fields: [
      { key: 'gender', label: 'Gender (1=male,2=female)', type: 'number', default: '1' },
      { key: 'age', label: 'Age', type: 'number', default: '30' },
      { key: 'weight', label: 'Weight (kg)', type: 'number', default: '70' },
      { key: 'height', label: 'Height (cm)', type: 'number', default: '170' },
      { key: 'activity', label: 'Activity (1.2-1.9)', type: 'number', default: '1.55' },
    ],
    compute: (v) => {
      const gender = num(v.gender), age = num(v.age), w = num(v.weight), h = num(v.height), act = num(v.activity);
      if (!(w > 0) || !(h > 0) || !(age > 0) || !(act > 0)) return [];
      const bmr = gender === 2
        ? 447.593 + 9.247 * w + 3.098 * h - 4.33 * age
        : 88.362 + 13.397 * w + 4.799 * h - 5.677 * age;
      const maint = bmr * act;
      const m = (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 0 });
      return [
        { label: 'Maintain weight', value: m(maint), accent: true },
        { label: 'Mild loss', value: m(maint - 250) },
        { label: 'Weight loss', value: m(maint - 500) },
        { label: 'Weight gain', value: m(maint + 300) },
      ];
    },
  },
  'pregnancy-due-date-calculator': {
    fields: [{ key: 'lmp', label: 'First day of last period', type: 'date', default: '' }],
    compute: (v) => {
      if (!v.lmp) return [];
      const d = new Date(v.lmp);
      if (isNaN(d.getTime())) return [];
      const due = new Date(d.getTime() + 280 * 86400000);
      const fmt = (x: Date) => x.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      return [
        { label: 'Estimated due date', value: fmt(due), accent: true },
        { label: 'Conception (approx)', value: fmt(new Date(d.getTime() + 14 * 86400000)) },
      ];
    },
  },
  'body-fat-calculator': {
    fields: [
      { key: 'gender', label: 'Gender (1=male,2=female)', type: 'number', default: '1' },
      { key: 'height', label: 'Height (cm)', type: 'number', default: '175' },
      { key: 'waist', label: 'Waist (cm)', type: 'number', default: '85' },
      { key: 'neck', label: 'Neck (cm)', type: 'number', default: '38' },
      { key: 'hip', label: 'Hip (cm, female)', type: 'number', default: '95' },
    ],
    compute: (v) => {
      const gender = num(v.gender), h = num(v.height), waist = num(v.waist), neck = num(v.neck), hip = num(v.hip);
      if (!(h > 0) || !(waist > 0) || !(neck > 0)) return [];
      let bf: number;
      if (gender === 2) {
        bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(h)) - 450;
      } else {
        bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(h)) - 450;
      }
      if (!isFinite(bf) || bf < 0 || bf > 100) return [];
      return [{ label: 'Estimated body fat', value: `${bf.toFixed(1)}%`, accent: true }];
    },
  },
};
