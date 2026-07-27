export const calculateLevel = (totalXp: number) => {
  const n = Math.floor((-75 + Math.sqrt(5625 + 100 * totalXp)) / 50);

  const level = n + 1;

  const baseTotalXp = 25 * (n * n) + 75 * n;

  const currentLevelXp = totalXp - baseTotalXp;

  const xpRequired = 100 + (n * 50);

  return {
    level,
    totalXp,
    currentLevelXp,
    xpRequired,
  };
};