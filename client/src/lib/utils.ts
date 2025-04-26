import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Languages } from "@shared/schema";
import { getLanguageColor } from "./constants";
import { ChartData } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format bytes to human-readable size
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format date to readable format
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Check if GitHub URL is valid
export function isValidGitHubUrl(url: string): boolean {
  const pattern = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+\/?$/;
  return pattern.test(url);
}

// Prepare data for charts
export function prepareChartData(languages: Languages, isDarkMode: boolean): ChartData {
  const total = Object.values(languages).reduce((sum, value) => sum + value, 0);
  const labels = Object.keys(languages);
  const values = Object.values(languages);
  const colors = labels.map(lang => getLanguageColor(lang));
  
  return {
    labels,
    datasets: [{
      data: values,
      backgroundColor: colors,
      borderColor: isDarkMode 
        ? Array(labels.length).fill('rgba(50, 50, 50, 0.8)') 
        : Array(labels.length).fill('rgba(255, 255, 255, 0.8)'),
      borderWidth: 1
    }]
  };
}

// Calculate language percentages
export function calculatePercentages(languages: Languages): Record<string, number> {
  const total = Object.values(languages).reduce((sum, value) => sum + value, 0);
  
  return Object.fromEntries(
    Object.entries(languages).map(([language, value]) => {
      const percentage = (value / total) * 100;
      return [language, parseFloat(percentage.toFixed(1))];
    })
  );
}
