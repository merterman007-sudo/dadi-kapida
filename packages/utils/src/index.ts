export const nowIso = (): string => new Date().toISOString();

export const toPageMeta = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  pageCount: Math.max(1, Math.ceil(total / limit))
});

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const buildCandidateCode = (id: string): string => {
  const compact = id.replaceAll("-", "").slice(0, 12).toUpperCase();
  return `ADY-${compact}`;
};
