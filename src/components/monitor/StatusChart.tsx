// Ganti bagian backgroundColor dengan tipe data yang lebih spesifik
backgroundColor: (context: any) => {
  const chart = context.chart;
  const { ctx, chartArea } = chart;

  if (!chartArea) return undefined;

  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  gradient.addColorStop(0, 'rgba(79, 70, 229, 0)');
  gradient.addColorStop(1, 'rgba(79, 70, 229, 0.2)');
  return gradient;
}