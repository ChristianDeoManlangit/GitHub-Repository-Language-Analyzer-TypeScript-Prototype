import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { toast } from "@/hooks/use-toast";
import { ChartType } from "@shared/schema";
import { Languages } from "@shared/schema";
import { prepareChartData, calculatePercentages } from "@/lib/utils";
import { getLanguageColor } from "@/lib/constants";
import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Download, Link as LinkIcon } from "lucide-react";
import { toPng } from "html-to-image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface LanguageChartProps {
  languages: Languages;
  chartType: ChartType;
  repository?: string;
}

export function LanguageChart({ languages, chartType, repository = "repository" }: LanguageChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const embedInputRef = useRef<HTMLInputElement>(null);
  const { isDarkMode } = useTheme();
  const [embedUrl, setEmbedUrl] = useState<string>("");
  const [isEmbedDialogOpen, setIsEmbedDialogOpen] = useState(false);

  // Create or update chart
  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Prepare data
    const chartData = prepareChartData(languages, isDarkMode);

    // Configure chart based on type
    const type = chartType === 'stacked' ? 'bar' : chartType;

    // Common options for all charts
    const options: any = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: ['pie', 'doughnut', 'radar'].includes(chartType),
          position: 'bottom',
          labels: {
            color: isDarkMode ? '#c9d1d9' : '#24292e',
            font: {
              family: "'Inter', sans-serif",
              size: 12
            },
            padding: 20
          }
        }
      }
    };

    // Configure specific chart types
    if (chartType === 'bar' || chartType === 'stacked') {
      options.scales = {
        x: {
          grid: {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            color: isDarkMode ? '#c9d1d9' : '#24292e'
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            color: isDarkMode ? '#c9d1d9' : '#24292e'
          }
        }
      };

      if (chartType === 'stacked') {
        options.scales.x.stacked = true;
        options.scales.y.stacked = true;
      }
    }

    if (chartType === 'radar') {
      options.scales = {
        r: {
          angleLines: {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
          },
          grid: {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
          },
          pointLabels: {
            color: isDarkMode ? '#c9d1d9' : '#24292e',
            font: {
              family: "'Inter', sans-serif",
              size: 12
            }
          },
          ticks: {
            color: isDarkMode ? '#c9d1d9' : '#24292e',
            backdropColor: isDarkMode ? 'rgba(13, 17, 23, 0.8)' : 'rgba(255, 255, 255, 0.8)'
          }
        }
      };
    }

    // Create chart
    chartInstance.current = new Chart(ctx, {
      type: type as any,
      data: chartData,
      options
    });

    // Clean up
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [languages, chartType, isDarkMode]);

  // Calculate percentages for legend
  const percentages = calculatePercentages(languages);

  // Function to download chart as PNG
  const handleDownloadChart = async () => {
    // Wait for chart to be fully rendered
    await new Promise(resolve => setTimeout(resolve, 100));

    const downloadContainer = document.createElement('div');
    downloadContainer.style.backgroundColor = '#ffffff';
    downloadContainer.style.padding = '24px';
    downloadContainer.style.borderRadius = '8px';
    downloadContainer.style.width = '800px';  // Fixed width for consistent output

    // Create title
    const title = document.createElement('h3');
    title.textContent = `Languages Breakdown (${CHART_TYPES.find(c => c.value === chartType)?.label})`;
    title.style.fontSize = '18px';
    title.style.fontWeight = '500';
    title.style.marginBottom = '24px';
    title.style.color = '#24292e';
    downloadContainer.appendChild(title);

    // Create a new canvas and copy the chart
    if (chartRef.current) {
      const newCanvas = document.createElement('canvas');
      const width = 800;
      const height = 800; // Make it square

      newCanvas.width = width;
      newCanvas.height = height;
      newCanvas.style.width = '100%';
      newCanvas.style.height = 'auto';

      const ctx = newCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(chartRef.current, 0, 0);
      }

      const chartContainer = document.createElement('div');
      chartContainer.style.width = '100%';
      chartContainer.style.height = 'auto';
      chartContainer.style.aspectRatio = '1'; // Square aspect ratio
      chartContainer.style.position = 'relative';
      chartContainer.appendChild(newCanvas);
      downloadContainer.appendChild(chartContainer);
    }

    // Add legend
    const legendContainer = document.createElement('div');
    legendContainer.style.display = 'grid';
    legendContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
    legendContainer.style.gap = '8px';
    legendContainer.style.marginTop = '24px';

    Object.entries(percentages).forEach(([language, percentage]) => {
      const item = document.createElement('div');
      item.style.display = 'flex';
      item.style.alignItems = 'center';

      const colorDot = document.createElement('span');
      colorDot.style.width = '12px';
      colorDot.style.height = '12px';
      colorDot.style.borderRadius = '50%';
      colorDot.style.backgroundColor = getLanguageColor(language);
      colorDot.style.marginRight = '8px';

      const text = document.createElement('span');
      text.style.fontSize = '14px';
      text.style.color = '#24292e';
      text.textContent = `${language}: ${percentage}%`;

      item.appendChild(colorDot);
      item.appendChild(text);
      legendContainer.appendChild(item);
    });

    downloadContainer.appendChild(legendContainer);
    document.body.appendChild(downloadContainer);

    toast({
      description: "Starting download...",
      duration: 3000,
    });

    try {
      const dataUrl = await toPng(downloadContainer, {
        quality: 1.0
      });

      const link = document.createElement('a');
      link.download = `${repository}-languages-${chartType}.png`;
      link.href = dataUrl;
      link.click();

      // Clean up
      document.body.removeChild(downloadContainer);
    } catch (error) {
      console.error('Error downloading chart:', error);
      document.body.removeChild(downloadContainer);
    }
  };

  // Function to generate markdown embed code for the chart
  const generateEmbedCode = async () => {
    if (!chartContainerRef.current) return;

    try {
      const dataUrl = await toPng(chartContainerRef.current, {
        backgroundColor: isDarkMode ? '#0d1117' : '#ffffff',
        quality: 1.0
      });

      // Create markdown embed code
      const markdownCode = `![${repository} Languages](${dataUrl})`;
      setEmbedUrl(markdownCode);
      setIsEmbedDialogOpen(true);
    } catch (error) {
      console.error('Error generating embed code:', error);
    }
  };

  // Function to copy embed code to clipboard
  const copyEmbedCode = () => {
    if (embedInputRef.current) {
      embedInputRef.current.select();
      document.execCommand('copy');
      // Optionally show feedback that it was copied
    }
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-md shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-github-dark dark:text-github-darkmode-text">
          Languages Breakdown ({CHART_TYPES.find(c => c.value === chartType)?.label})
        </h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 bg-white dark:bg-[#2a3749] text-github-dark dark:text-github-darkmode-text border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#364259]"
            onClick={generateEmbedCode}
          >
            <LinkIcon className="h-4 w-4" />
            <span>Embed</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 bg-white dark:bg-[#2a3749] text-github-dark dark:text-github-darkmode-text border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#364259]"
            onClick={handleDownloadChart}
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
        </div>
      </div>

      <div 
        ref={chartContainerRef}
        className="chart-container bg-white dark:bg-[#1e293b] p-4 rounded-md" 
        style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}
      >
        <canvas ref={chartRef} id="languageChart"></canvas>
      </div>

      {/* Language Legend */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-6">
        {Object.entries(percentages).map(([language, percentage]) => (
          <div key={language} className="flex items-center">
            <span
              className="inline-block w-3 h-3 mr-2 rounded-full"
              style={{ backgroundColor: getLanguageColor(language) }}
            ></span>
            <span className="text-sm text-github-dark dark:text-github-darkmode-text">{`${language}: ${percentage}%`}</span>
          </div>
        ))}
      </div>

      {/* Embed Dialog */}
      <Dialog open={isEmbedDialogOpen} onOpenChange={setIsEmbedDialogOpen}>
        <DialogContent className="bg-white dark:bg-[#1e293b] border-gray-200 dark:border-gray-700 text-github-dark dark:text-github-darkmode-text">
          <DialogHeader>
            <DialogTitle className="text-github-dark dark:text-github-darkmode-text">Embed Chart in Markdown</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Copy the code below to embed this chart in your GitHub README or other markdown documents.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <Input
                ref={embedInputRef}
                value={embedUrl}
                readOnly
                className="font-mono text-xs bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
              <Button 
                size="sm" 
                onClick={copyEmbedCode}
                className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white"
              >
                Copy
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Note: The embed code for this site is purely for developmental testing, which results in a data URL that is very long. A better approach will be implemented in the future.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Chart type options for display
const CHART_TYPES = [
  { value: 'pie', label: 'Pie Chart' },
  { value: 'doughnut', label: 'Donut Chart' },
  { value: 'bar', label: 'Bar Chart' },
  { value: 'radar', label: 'Radar Chart' },
  { value: 'stacked', label: 'Stacked Bar Chart' }
];