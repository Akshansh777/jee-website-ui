export function computeScores(responses) {
  const values = Object.values(responses); 
  const total = values.reduce((a, b) => a + b, 0);

  const maxScore = values.length * 5;
  const normalized = (total / maxScore) * 100;

  const iitPercent = normalized * 0.9;
  const nitPercent = normalized * 0.75;
  const overallScore = normalized;

  return {
    overall: Number(overallScore.toFixed(2)),
    iit: Number(iitPercent.toFixed(2)),
    nit: Number(nitPercent.toFixed(2))
  };
}
