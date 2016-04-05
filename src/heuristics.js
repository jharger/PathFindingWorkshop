const manhattan = (x0, y0, x1, y1) => {
  const dx = (x1 - x0);
  const dy = (y1 - y0);
  return Math.abs(dx) + Math.abs(dy);
};

const euclidean = (x0, y0, x1, y1) => {
  const dx = (x1 - x0);
  const dy = (y1 - y0);
  return Math.sqrt(dx * dx + dy * dy);
};

const chebyshev = (x0, y0, x1, y1) => {
  const dx = (x1 - x0);
  const dy = (y1 - y0);
  return Math.max(Math.abs(dx), Math.abs(dy));
};

export {
  manhattan,
  euclidean,
  chebyshev
};