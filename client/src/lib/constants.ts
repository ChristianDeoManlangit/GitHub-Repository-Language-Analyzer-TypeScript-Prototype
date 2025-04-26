// GitHub language colors
export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
  Java: '#b07219',
  Ruby: '#701516',
  Go: '#00ADD8',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  PHP: '#4F5D95',
  Shell: '#89e051',
  Scala: '#c22d40',
  Perl: '#0298c3',
  Haskell: '#5e5086',
  Jupyter: '#DA5B0B',
  Markdown: '#083fa1',
  Vue: '#41b883',
  // Fallback for other languages
  Other: '#8f8f8f'
};

export const getLanguageColor = (language: string): string => {
  return LANGUAGE_COLORS[language] || LANGUAGE_COLORS.Other;
};

// Chart Types
export const CHART_TYPES = [
  { value: 'pie', label: 'Pie Chart' },
  { value: 'doughnut', label: 'Donut Chart' },
  { value: 'bar', label: 'Bar Chart' },
  { value: 'stacked', label: 'Stacked Bar Chart' },
  { value: 'radar', label: 'Radar Chart' }
];
