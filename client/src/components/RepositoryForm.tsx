import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChartType } from "@shared/schema";
import { isValidGitHubUrl } from "@/lib/utils";
import { CHART_TYPES } from "@/lib/constants";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  repositoryUrl: z.string()
    .min(1, "Repository URL is required")
    .refine(isValidGitHubUrl, {
      message: "Please enter a valid GitHub repository URL",
    }),
  chartType: z.enum(["pie", "doughnut", "bar", "radar"] as const),
});

interface RepositoryFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
}

export function RepositoryForm({ onSubmit, isLoading }: RepositoryFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repositoryUrl: "",
      chartType: "pie" as ChartType,
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Repository URL Input */}
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="repositoryUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-github-dark dark:text-github-darkmode-text">Repository URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/username/repository"
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-github-darkmode-secondary text-github-dark dark:text-github-darkmode-text focus:outline-none focus:ring-1 focus:ring-github-blue"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Chart Type Dropdown */}
          <div>
            <FormField
              control={form.control}
              name="chartType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-github-dark dark:text-github-darkmode-text">Chart Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-github-darkmode-secondary text-github-dark dark:text-github-darkmode-text focus:outline-none focus:ring-1 focus:ring-github-blue">
                        <SelectValue placeholder="Select chart type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CHART_TYPES.map((type) => (
                        type.value !== "stacked" && <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#3178c6] hover:bg-opacity-90 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
        >
          {isLoading ? "ANALYZING..." : "SUBMIT"}
        </Button>
      </form>
    </Form>
  );
}