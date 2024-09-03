export function queryParams(query: any) {
  const q: (string | number)[] = [];
  for (const key in query) {
    // @ts-ignore
    if (query[key]) q.push(`${key}=${encodeURIComponent(query[key])}`);
  }
  let r = q.join("&");
  r = r ? "?" + r : "";
  return r;
}
