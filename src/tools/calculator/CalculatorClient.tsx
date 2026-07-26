'use client';

import { useState, type ReactNode } from 'react';
import { useI18n } from '@/i18n';

type Tab = 'bmi' | 'loan' | 'percent' | 'age';

function Field({ label, value, onChange, type = 'number', placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 p-2.5 text-sm text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
      />
    </div>
  );
}

function Result({ children }: { children: ReactNode }) {
  return <div className="rounded-lg bg-brand/[0.06] p-4 text-slate-900">{children}</div>;
}

function BmiCalc() {
  const { t } = useI18n();
  const [h, setH] = useState('170');
  const [w, setW] = useState('65');
  const hm = parseFloat(h) / 100;
  const wk = parseFloat(w);
  const bmi = hm > 0 && wk > 0 ? wk / (hm * hm) : NaN;
  const cat = isNaN(bmi) ? '' :
    bmi < 18.5 ? t('tools.calculator.underweight', 'Underweight') :
    bmi < 25 ? t('tools.calculator.normal', 'Normal') :
    bmi < 30 ? t('tools.calculator.overweight', 'Overweight') :
    t('tools.calculator.obese', 'Obese');
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label={t('tools.calculator.height', 'Height (cm)')} value={h} onChange={setH} />
        <Field label={t('tools.calculator.weight', 'Weight (kg)')} value={w} onChange={setW} />
      </div>
      {!isNaN(bmi) && (
        <Result>
          <div className="text-2xl font-bold">{bmi.toFixed(1)}</div>
          <div className="text-sm text-slate-600">{t('tools.calculator.yourBmi', 'Your BMI')} · {cat}</div>
        </Result>
      )}
    </div>
  );
}

function LoanCalc() {
  const { t } = useI18n();
  const [amount, setAmount] = useState('100000');
  const [rate, setRate] = useState('5');
  const [years, setYears] = useState('30');
  const P = parseFloat(amount), annual = parseFloat(rate), n = parseFloat(years) * 12;
  const r = annual / 100 / 12;
  let monthly = NaN, total = NaN, interest = NaN;
  if (P > 0 && n > 0) {
    monthly = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    total = monthly * n;
    interest = total - P;
  }
  const money = (x: number) => isNaN(x) ? '—' : x.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Field label={t('tools.calculator.loanAmount', 'Loan amount')} value={amount} onChange={setAmount} />
        <Field label={t('tools.calculator.rate', 'Annual rate (%)')} value={rate} onChange={setRate} />
        <Field label={t('tools.calculator.term', 'Term (years)')} value={years} onChange={setYears} />
      </div>
      {!isNaN(monthly) && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Result><div className="text-xl font-bold">{money(monthly)}</div><div className="text-xs text-slate-600">{t('tools.calculator.monthly', 'Monthly payment')}</div></Result>
          <Result><div className="text-xl font-bold">{money(interest)}</div><div className="text-xs text-slate-600">{t('tools.calculator.totalInterest', 'Total interest')}</div></Result>
          <Result><div className="text-xl font-bold">{money(total)}</div><div className="text-xs text-slate-600">{t('tools.calculator.totalPaid', 'Total paid')}</div></Result>
        </div>
      )}
    </div>
  );
}

function PercentCalc() {
  const { t } = useI18n();
  const [x, setX] = useState('20');
  const [y, setY] = useState('150');
  const [a, setA] = useState('40');
  const [b, setB] = useState('50');
  const pctOf = (parseFloat(x) / 100) * parseFloat(y);
  const change = parseFloat(a) !== 0 ? ((parseFloat(b) - parseFloat(a)) / Math.abs(parseFloat(a))) * 100 : NaN;
  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm text-slate-600">{t('tools.calculator.whatIs', 'What is X% of Y?')}</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="X (%)" value={x} onChange={setX} />
          <Field label="Y" value={y} onChange={setY} />
        </div>
        {!isNaN(pctOf) && <Result><span className="text-xl font-bold">{parseFloat(pctOf.toPrecision(6))}</span></Result>}
      </div>
      <div>
        <p className="mb-2 text-sm text-slate-600">{t('tools.calculator.pctChange', 'Percentage change from A to B')}</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="A" value={a} onChange={setA} />
          <Field label="B" value={b} onChange={setB} />
        </div>
        {!isNaN(change) && <Result><span className={`text-xl font-bold ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{change >= 0 ? '+' : ''}{parseFloat(change.toPrecision(5))}%</span></Result>}
      </div>
    </div>
  );
}

function AgeCalc() {
  const { t } = useI18n();
  const [dob, setDob] = useState('2000-01-01');
  let years = NaN, months = NaN, days = NaN, totalDays = NaN;
  const birth = new Date(dob);
  if (!isNaN(birth.getTime())) {
    const now = new Date();
    let y = now.getFullYear() - birth.getFullYear();
    let m = now.getMonth() - birth.getMonth();
    let d = now.getDate() - birth.getDate();
    if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    years = y; months = m; days = d;
    totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000);
  }
  return (
    <div className="space-y-4">
      <Field label={t('tools.calculator.dob', 'Date of birth')} value={dob} onChange={setDob} type="date" />
      {!isNaN(years) && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result><div className="text-xl font-bold">{years}</div><div className="text-xs text-slate-600">{t('tools.calculator.years', 'Years')}</div></Result>
          <Result><div className="text-xl font-bold">{months}</div><div className="text-xs text-slate-600">{t('tools.calculator.months', 'Months')}</div></Result>
          <Result><div className="text-xl font-bold">{days}</div><div className="text-xs text-slate-600">{t('tools.calculator.days', 'Days')}</div></Result>
          <Result><div className="text-xl font-bold">{totalDays.toLocaleString()}</div><div className="text-xs text-slate-600">{t('tools.calculator.totalDays', 'Total days')}</div></Result>
        </div>
      )}
    </div>
  );
}

export default function CalculatorClient() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>('bmi');
  const tabs: { key: Tab; label: string }[] = [
    { key: 'bmi', label: t('tools.calculator.tabBmi', 'BMI') },
    { key: 'loan', label: t('tools.calculator.tabLoan', 'Loan') },
    { key: 'percent', label: t('tools.calculator.tabPercent', 'Percentage') },
    { key: 'age', label: t('tools.calculator.tabAge', 'Age') },
  ];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tb) => (
          <button
            key={tb.key} onClick={() => setTab(tb.key)}
            className={`rounded-lg border px-4 py-1.5 text-sm transition ${
              tab === tb.key ? 'border-brand bg-brand/[0.08] text-brand' : 'border-slate-200 text-slate-600 hover:border-brand/40'
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>
      <div className="rounded-lg border border-slate-200 p-4">
        {tab === 'bmi' && <BmiCalc />}
        {tab === 'loan' && <LoanCalc />}
        {tab === 'percent' && <PercentCalc />}
        {tab === 'age' && <AgeCalc />}
      </div>
    </div>
  );
}
