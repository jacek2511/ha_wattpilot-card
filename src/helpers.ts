export const msToMin = (ms: any): string => {
  const n = parseInt(ms, 10);
  return isNaN(n) ? "0" : Math.round(n / 60000).toString();
};

export const minToMs = (min: any): number => {
  const n = parseInt(min, 10);
  return isNaN(n) ? 0 : n * 60000;
};

export const wToKw = (w: any): string => {
  const n = parseFloat(w);
  return isNaN(n) ? "0.0" : (n / 1000).toFixed(1);
};

export const kwToW = (kw: any): number => {
  const n = parseFloat(kw);
  return isNaN(n) ? 0 : Math.round(n * 1000);
};

export const centsToEuro = (val: any): string => {
  const n = parseFloat(val);
  return isNaN(n) ? "0.00" : (n / 100).toFixed(2);
};

export const euroToCents = (val: any): number => {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : Math.round(n * 100);
};
