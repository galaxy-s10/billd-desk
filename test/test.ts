function handleUrlQuery(obj: Record<string, string>) {
  let res = '';
  Object.keys(obj).forEach((item) => {
    res += `${item}=${obj[item]}&`;
  });
  if (res.length > 0) {
    return res.slice(0, -1);
  } else {
    return res;
  }
}

console.log(handleUrlQuery({ a: '1', b: '32' }));
