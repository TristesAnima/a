const cache = new Map();

export function setCache(key: string, data: any, cacheTime = 10 * 60 * 1000) {
  const currentCache = cache.get(key);
  if (currentCache?.timer) {
    clearTimeout(currentCache.timer);
  }

  let timer;

  if (cacheTime > -1) {
    // 数据在不活跃 cacheTime 后，删除掉
    timer = setTimeout(() => {
      cache.delete(key);
    }, cacheTime);
  }

  cache.set(key, {
    data,
    timer,
    startTime: new Date().getTime(),
  });
}

export function getCache(key: string): { data: any; startTime: number } {
  const currentCache = cache.get(key);
  return {
    data: currentCache?.data,
    startTime: currentCache?.startTime,
  };
}
