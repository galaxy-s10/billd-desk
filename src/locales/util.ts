export const nameSpaceWrap = (
  nameSpace: string,
  obj: Record<string, string>
) => {
  const temp: any = {};
  Object.keys(obj).forEach((val: string) => {
    temp[`${nameSpace}.${val}`] = obj[val];
  });
  return temp;
};
