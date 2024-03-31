// function handleUrlQuery(obj) {
//   let res = '';
//   Object.keys(obj).forEach((item) => {
//     res += `${item}=${obj[item]}&`;
//   });
//   if (res.length > 0) {
//     return '?' + res.slice(0, -1);
//   } else {
//     return res;
//   }
// }

// console.log(handleUrlQuery({ a: '1', b: '32' }));

let map = new Map();
map.set(1, '22');
map.set('1', '3444');
console.log(map);
console.log(map.get('1'));
console.log(map.get(1));
