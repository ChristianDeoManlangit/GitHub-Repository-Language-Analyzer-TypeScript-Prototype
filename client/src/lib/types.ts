import { Repository, Languages, ChartType } from "@shared/schema";

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

export interface RepositoryFormData {
  repositoryUrl: string;
  chartType: ChartType;
}

export interface ApiResponse {
  repository: Repository;
  languages: Languages;
}

export interface ErrorResponse {
  message: string;
  detail?: string;
}

export interface AppState {
  status: 'idle' | 'loading' | 'success' | 'error';
  repository?: Repository;
  languages?: Languages;
  chartType: ChartType;
  error?: {
    message: string;
    detail?: string;
  };
}
