import { useState } from "react";
import { RepositoryForm } from "@/components/RepositoryForm";
import { LanguageChart } from "@/components/LanguageChart";
import { RepositoryInfo } from "@/components/RepositoryInfo";
import { AppState, RepositoryFormData, ApiResponse, ErrorResponse } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Code } from "lucide-react";

export default function Home() {
  const [state, setState] = useState<AppState>({
    status: 'idle',
    chartType: 'pie'
  });

  const handleSubmit = async (data: RepositoryFormData) => {
    try {
      setState({
        ...state,
        status: 'loading',
        chartType: data.chartType
      });

      // Fetch repository data from API
      const response = await fetch(`/api/repo?url=${encodeURIComponent(data.repositoryUrl)}`);
      
      if (!response.ok) {
        const errorData = await response.json() as ErrorResponse;
        throw new Error(errorData.message || "Failed to fetch repository data");
      }
      
      const responseData = await response.json() as ApiResponse;
      
      setState({
        status: 'success',
        repository: responseData.repository,
        languages: responseData.languages,
        chartType: data.chartType
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setState({
        ...state,
        status: 'error',
        error: {
          message: errorMessage,
          detail: "Please check the repository URL and try again"
        }
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Form Section */}
      <section className="mb-8">
        <RepositoryForm 
          onSubmit={handleSubmit} 
          isLoading={state.status === 'loading'} 
        />
      </section>

      {/* Results Section */}
      <section className="max-w-4xl mx-auto">
        {/* Initial State */}
        {state.status === 'idle' && (
          <div className="text-center py-16">
            <Code className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4 mx-auto" />
            <p className="text-gray-500 dark:text-gray-400">
              Enter a GitHub repository URL and select a chart type to analyze language breakdown
            </p>
          </div>
        )}

        {/* Loading State */}
        {state.status === 'loading' && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-github-blue mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Analyzing repository languages...</p>
          </div>
        )}

        {/* Error State */}
        {state.status === 'error' && (
          <div className="text-center py-16">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4 mx-auto" />
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              {state.error?.message || "Unable to analyze repository languages"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {state.error?.detail || "Please check the repository URL and try again"}
            </p>
          </div>
        )}

        {/* Results Container */}
        {state.status === 'success' && state.repository && state.languages && (
          <div>
            <RepositoryInfo repository={state.repository} />
            <LanguageChart 
              languages={state.languages} 
              chartType={state.chartType}
              repository={state.repository.full_name}
            />
          </div>
        )}
      </section>
    </div>
  );
}
