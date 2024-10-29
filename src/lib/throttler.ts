export async function handleRequestLimit<T>(
  promises: Promise<T>[],
  requestPerSec: number,
) {
  const requestChunks: Promise<T>[][] = [];

  for (let i = 0; i < promises.length; i += requestPerSec) {
    const chunk = promises.slice(i, i + requestPerSec);
    requestChunks.push(chunk);
  }

  let data: T[] = [];

  for (const item of requestChunks) {
    data = data.concat(await Promise.all(item));
  }

  return data;
}
