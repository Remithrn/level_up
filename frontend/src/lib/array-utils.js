export const range = (lo, hi) => {
    const result = Array(hi - lo);
    for (let i = lo; i < hi; i++) {
      result[i - lo] = i;
    }
    return result;
  };
  
  export const sum = (numbers) => {
    let total = 0;
    for (const number of numbers) {
      total += number;
    }
    return total;
  };
  