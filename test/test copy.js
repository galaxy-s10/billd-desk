// const url = new URLSearchParams('BilldDesk://remote?a=ahdFSXuR&b=2332');
// console.log(url.get('a'));

// url.forEach((v, k) => {
//   console.log(v, k);
// });

const a = 'BilldDesk://remote?a=ahdFSXuR&b=2332';
const str = a.split('?')[1];
console.log(str);

const url = new URLSearchParams(str);
console.log(url.get('a'));
console.log(url.get('b'));
