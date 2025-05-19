import React from "react";
import Link from "next/link";

const suggestions = [
  "Designer", 
  "Programming", 
  "Digital Marketing", 
  "Video", 
  "Animation"
];

export default function JobSuggestions() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-gray-500">Suggestion:</span>
      {suggestions.map((suggestion, index) => (
        <React.Fragment key={suggestion}>
          <Link
            href={`/jobs/search?q=${suggestion.toLowerCase()}`}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            {suggestion}
          </Link>
          {index < suggestions.length - 1 && (
            <span className="text-gray-400">•</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}