"use client";

import { useState, useEffect, useRef } from "react";
import { searchSchools } from "../data/schools";

export default function SchoolAutocomplete({
  value,
  onChange,
  placeholder = "Search for your school...",
  required = false,
  disabled = false,
}) {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search schools when query changes
  useEffect(() => {
    const performSearch = () => {
      if (query.length >= 2) {
        const searchResults = searchSchools(query);
        setResults(searchResults);
        setIsOpen(searchResults.length > 0);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    };
    performSearch();
  }, [query]);

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onChange(newQuery);
    setSelectedIndex(-1);
  };

  const handleSelectSchool = (school) => {
    setQuery(school.name);
    onChange(school.name);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelectSchool(results[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Your School {required && <span className="text-red-500">*</span>}
      </label>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => query.length >= 2 && setIsOpen(results.length > 0)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        autoComplete="off"
      />

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((school, index) => (
            <button
              key={school.domain}
              type="button"
              onClick={() => handleSelectSchool(school)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
                index === selectedIndex ? "bg-gray-700" : ""
              } ${index === 0 ? "rounded-t-lg" : ""} ${
                index === results.length - 1 ? "rounded-b-lg" : ""
              }`}
            >
              <div className="flex flex-col">
                <span className="text-white font-medium">{school.name}</span>
                <span className="text-gray-400 text-sm">@{school.domain}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4">
          <p className="text-gray-400 text-sm">
            No schools found. Try a different search or type your school name
            manually.
          </p>
        </div>
      )}

      {/* Helper Text */}
      <p className="mt-1 text-xs text-gray-500">
        Start typing to search for your school
      </p>
    </div>
  );
}
