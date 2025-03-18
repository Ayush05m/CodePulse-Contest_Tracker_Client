import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { cn } from "@/lib/utils";
// import { useTheme } from "@/hooks/use-theme";

interface MultiSelectProps {
  options?: string[];
  placeholder?: string;
  onChange?: (selectedValues: string[]) => void;
  value?: string[];
  className?: string;
  searchFallback?: (searchTerm: string) => Promise<string[]>;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options = [],
  placeholder = "Select options",
  onChange,
  value,
  className = "",
  searchFallback,
}) => {
  // const [optionsList, setIsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(value || []);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [filteredOptions, setFilterOptions] = useState(options);

  useEffect(() => {
    setFilterOptions(options);
  }, [options]);

  useEffect(() => {
    const updateOptions = async () => {
      const filtered = options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilterOptions(filtered);

      if (filtered?.length === 0 && searchFallback) {
        const fallbackOptions = await searchFallback(searchTerm);
        setFilterOptions(fallbackOptions);
      }
    };

    updateOptions();
  }, [searchTerm, options, searchFallback]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedOptions(value);
    }
  }, [value]);

  const toggleOption = (value: string) => {
    const newSelectedOptions = selectedOptions.includes(value)
      ? selectedOptions.filter((v) => v !== value)
      : [...selectedOptions, value];

    setSelectedOptions(newSelectedOptions);
    onChange?.(newSelectedOptions);
  };

  const removeOption = (value: string) => {
    const newSelectedOptions = selectedOptions.filter((v) => v !== value);
    setSelectedOptions(newSelectedOptions);
    onChange?.(newSelectedOptions);
  };

  const displayedOptions = selectedOptions.slice(0, 3);
  const remainingCount = selectedOptions.length - displayedOptions.length;

  return (
    <div ref={selectRef} className={cn("relative min-w-[200px]", className)}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "hover:bg-accent/10 hover:border-ring",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "cursor-pointer transition-colors",
          "data-[state=open]:border-ring" // Add this line
        )}
      >
        <div className="flex flex-wrap gap-1.5 max-h-[35px] max-w-[90%] overflow-y-auto scrollbar-hide">
          {selectedOptions.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            <>
              {displayedOptions.map((value) => (
                <div
                  key={value}
                  className={cn(
                    "flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs",
                    "transition-colors hover:bg-accent/80"
                  )}
                >
                  <span className="text-accent-foreground">{value}</span>
                  <X
                    size={14}
                    className="ml-1 cursor-pointer text-accent-foreground/50 hover:text-accent-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeOption(value);
                    }}
                  />
                </div>
              ))}
              {remainingCount > 0 && (
                <span className="text-sm text-gray-600">
                  +{remainingCount} more
                </span>
              )}
            </>
          )}
        </div>
        <ChevronDown
          size={20}
          className={`ml-auto transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full min-w-[300px] rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
          <div className="space-y-1.5 p-2">
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              ref={inputRef}
              className="h-8 focus-visible:ring-0"
            />

            <div className="flex gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2.5 text-xs"
                onClick={() => {
                  setSelectedOptions([...options]);
                  onChange?.([...options]);
                }}
              >
                Select All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2.5 text-xs"
                onClick={() => {
                  setSelectedOptions([]);
                  onChange?.([]);
                }}
              >
                Clear
              </Button>
            </div>
          </div>

          <div className="max-h-[250px] overflow-y-auto p-1 text-sm">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => toggleOption(option)}
                  className={cn(
                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5",
                    "outline-none transition-colors",
                    "hover:bg-accent focus:bg-accent",
                    selectedOptions.includes(option) && "bg-accent/50"
                  )}
                >
                  <span className="flex-1 truncate">{option}</span>
                  {selectedOptions.includes(option) && (
                    <span className="ml-2 text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
