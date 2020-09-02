export const sleep = (seconds: number): Promise<void> =>
  new Promise((res) => {
    setTimeout(res, seconds * 1000);
  });
