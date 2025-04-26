import { Repository } from "@shared/schema";
import { formatBytes, formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface RepositoryInfoProps {
  repository: Repository;
}

export function RepositoryInfo({ repository }: RepositoryInfoProps) {
  return (
    <Card className="bg-white dark:bg-[#1e293b] rounded-md shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700">
      <CardContent className="p-0">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-github-dark dark:text-github-darkmode-text">{repository.full_name}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center mb-2">
              <i className="fas fa-code-branch text-gray-500 dark:text-gray-400 mr-2"></i>
              <span className="text-sm text-github-dark dark:text-github-darkmode-text">{repository.forks_count.toLocaleString()} Forks</span>
            </div>
            <div className="flex items-center mb-2">
              <i className="fas fa-star text-gray-500 dark:text-gray-400 mr-2"></i>
              <span className="text-sm text-github-dark dark:text-github-darkmode-text">{repository.stargazers_count.toLocaleString()} Stars</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-eye text-gray-500 dark:text-gray-400 mr-2"></i>
              <span className="text-sm text-github-dark dark:text-github-darkmode-text">{repository.watchers_count.toLocaleString()} Watchers</span>
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <i className="fas fa-code text-gray-500 dark:text-gray-400 mr-2"></i>
              <span className="text-sm text-github-dark dark:text-github-darkmode-text">Size: {formatBytes(repository.size * 1024)}</span>
            </div>
            <div className="flex items-center mb-2">
              <i className="fas fa-calendar-alt text-gray-500 dark:text-gray-400 mr-2"></i>
              <span className="text-sm text-github-dark dark:text-github-darkmode-text">Created on: {formatDate(repository.created_at)}</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-clock text-gray-500 dark:text-gray-400 mr-2"></i>
              <span className="text-sm text-github-dark dark:text-github-darkmode-text">Last updated: {formatDate(repository.updated_at)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
