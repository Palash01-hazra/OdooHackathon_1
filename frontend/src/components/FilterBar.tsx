import { useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  const filters = [
    { key: "newest", label: "Newest" },
    { key: "unanswered", label: "Unanswered" },
    { key: "active", label: "Active" },
    { key: "votes", label: "Most Votes" }
  ];

  return (
    <div className="flex items-center justify-between bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Sort by:</span>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:flex items-center space-x-2">
        {filters.map((filter) => (
          <Button
            key={filter.key}
            variant={activeFilter === filter.key ? "default" : "ghost"}
            size="sm"
            onClick={() => onFilterChange(filter.key)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Mobile Dropdown */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {filters.find(f => f.key === activeFilter)?.label || "Newest"}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border-border">
            {filters.map((filter) => (
              <DropdownMenuItem
                key={filter.key}
                onClick={() => onFilterChange(filter.key)}
                className={activeFilter === filter.key ? "bg-accent" : ""}
              >
                {filter.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}