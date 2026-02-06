export function usd(n) {
  const num = Number(n || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(num);
}
