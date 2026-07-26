// 单位换算定义：7 个乘法型换算 + 温度（特殊换算）。UnitConverterShell 统一渲染。

export interface Unit {
  key: string;
  label: string;
  factor: number; // 相对基准单位的倍数
}

export interface ConverterDef {
  units: Unit[];
  special?: 'temperature';
}

export const converterDefs: Record<string, ConverterDef> = {
  'length-converter': {
    units: [
      { key: 'm', label: 'Meters (m)', factor: 1 },
      { key: 'km', label: 'Kilometers (km)', factor: 1000 },
      { key: 'cm', label: 'Centimeters (cm)', factor: 0.01 },
      { key: 'mm', label: 'Millimeters (mm)', factor: 0.001 },
      { key: 'mi', label: 'Miles (mi)', factor: 1609.344 },
      { key: 'yd', label: 'Yards (yd)', factor: 0.9144 },
      { key: 'ft', label: 'Feet (ft)', factor: 0.3048 },
      { key: 'in', label: 'Inches (in)', factor: 0.0254 },
    ],
  },
  'weight-converter': {
    units: [
      { key: 'kg', label: 'Kilograms (kg)', factor: 1 },
      { key: 'g', label: 'Grams (g)', factor: 0.001 },
      { key: 'mg', label: 'Milligrams (mg)', factor: 0.000001 },
      { key: 't', label: 'Metric tons (t)', factor: 1000 },
      { key: 'lb', label: 'Pounds (lb)', factor: 0.45359237 },
      { key: 'oz', label: 'Ounces (oz)', factor: 0.0283495231 },
      { key: 'st', label: 'Stones (st)', factor: 6.35029318 },
    ],
  },
  'area-converter': {
    units: [
      { key: 'm2', label: 'Square meters (m²)', factor: 1 },
      { key: 'km2', label: 'Square kilometers (km²)', factor: 1000000 },
      { key: 'cm2', label: 'Square centimeters (cm²)', factor: 0.0001 },
      { key: 'ha', label: 'Hectares (ha)', factor: 10000 },
      { key: 'acre', label: 'Acres (ac)', factor: 4046.8564224 },
      { key: 'ft2', label: 'Square feet (ft²)', factor: 0.09290304 },
      { key: 'yd2', label: 'Square yards (yd²)', factor: 0.83612736 },
      { key: 'mi2', label: 'Square miles (mi²)', factor: 2589988.110336 },
    ],
  },
  'volume-converter': {
    units: [
      { key: 'l', label: 'Liters (L)', factor: 1 },
      { key: 'ml', label: 'Milliliters (mL)', factor: 0.001 },
      { key: 'm3', label: 'Cubic meters (m³)', factor: 1000 },
      { key: 'gal', label: 'Gallons (US gal)', factor: 3.785411784 },
      { key: 'qt', label: 'Quarts (US qt)', factor: 0.946352946 },
      { key: 'pt', label: 'Pints (US pt)', factor: 0.473176473 },
      { key: 'cup', label: 'Cups (US cup)', factor: 0.2365882365 },
      { key: 'floz', label: 'Fluid ounces (US fl oz)', factor: 0.0295735296 },
      { key: 'ft3', label: 'Cubic feet (ft³)', factor: 28.316846592 },
    ],
  },
  'speed-converter': {
    units: [
      { key: 'mps', label: 'Meters / second (m/s)', factor: 1 },
      { key: 'kmh', label: 'Kilometers / hour (km/h)', factor: 0.2777777778 },
      { key: 'mph', label: 'Miles / hour (mph)', factor: 0.44704 },
      { key: 'fps', label: 'Feet / second (ft/s)', factor: 0.3048 },
      { key: 'knot', label: 'Knots (kn)', factor: 0.5144444444 },
    ],
  },
  'data-converter': {
    units: [
      { key: 'bit', label: 'Bits (bit)', factor: 0.125 },
      { key: 'b', label: 'Bytes (B)', factor: 1 },
      { key: 'kb', label: 'Kilobytes (KB)', factor: 1024 },
      { key: 'mb', label: 'Megabytes (MB)', factor: 1048576 },
      { key: 'gb', label: 'Gigabytes (GB)', factor: 1073741824 },
      { key: 'tb', label: 'Terabytes (TB)', factor: 1099511627776 },
      { key: 'pb', label: 'Petabytes (PB)', factor: 1125899906842624 },
    ],
  },
  'temperature-converter': {
    special: 'temperature',
    units: [
      { key: 'c', label: 'Celsius (°C)', factor: 1 },
      { key: 'f', label: 'Fahrenheit (°F)', factor: 1 },
      { key: 'k', label: 'Kelvin (K)', factor: 1 },
    ],
  },
};
