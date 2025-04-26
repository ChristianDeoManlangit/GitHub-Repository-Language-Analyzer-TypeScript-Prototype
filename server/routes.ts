import type { Express } from "express";
import { createServer, type Server } from "http";
import axios from "axios";
import { repoSchema, languagesSchema } from "@shared/schema";
import { storage } from "./storage";

// Function to extract owner and repo from GitHub URL
function extractRepoInfo(url: string): { owner: string; repo: string } | null {
  try {
    const repoUrlPattern = /github\.com\/([^\/]+)\/([^\/\?#]+)/;
    const match = url.match(repoUrlPattern);
    
    if (match && match.length === 3) {
      return { owner: match[1], repo: match[2] };
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to fetch GitHub repository data
  app.get("/api/repo", async (req, res) => {
    try {
      const { url } = req.query;
      
      if (!url || typeof url !== "string") {
        return res.status(400).json({ message: "Repository URL is required" });
      }
      
      const repoInfo = extractRepoInfo(url);
      
      if (!repoInfo) {
        return res.status(400).json({ 
          message: "Invalid GitHub repository URL",
          detail: "Please enter a valid GitHub repository URL (e.g., https://github.com/username/repository)"
        });
      }
      
      const { owner, repo } = repoInfo;
      
      // Fetch repository details from GitHub API
      const repoResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN && { Authorization: `token ${process.env.GITHUB_TOKEN}` })
        }
      });
      
      // Validate repository data
      const repoData = repoSchema.parse(repoResponse.data);
      
      // Fetch language data from GitHub API
      const languagesResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/languages`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN && { Authorization: `token ${process.env.GITHUB_TOKEN}` })
        }
      });
      
      // Validate language data
      const languagesData = languagesSchema.parse(languagesResponse.data);
      
      return res.status(200).json({
        repository: repoData,
        languages: languagesData
      });
    } catch (error) {
      console.error("Error fetching repository data:", error);
      
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        
        if (status === 404) {
          return res.status(404).json({ 
            message: "Repository not found",
            detail: "The specified repository could not be found. Please check the URL and try again."
          });
        }
        
        if (status === 403) {
          return res.status(403).json({ 
            message: "API rate limit exceeded",
            detail: "GitHub API rate limit has been reached. Please try again later."
          });
        }
        
        return res.status(status).json({ 
          message: "GitHub API error",
          detail: error.response.data?.message || "An error occurred while communicating with the GitHub API"
        });
      }
      
      return res.status(500).json({ 
        message: "Server error",
        detail: "An unexpected error occurred while processing your request"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
