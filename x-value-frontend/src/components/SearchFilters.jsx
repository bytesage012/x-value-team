import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Filter, X } from 'lucide-react';
import SortSelect from './SortSelect';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => currentYear - i); // Show last 50 years by default

const fuelTypes = ['petrol', 'diesel', 'electric', 'hybrid'];
const transmissionTypes = ['manual', 'automatic'];

function SearchFilters({ onFiltersChange }) {
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    minMileage: '',
    maxMileage: '',
    fuelType: [],
    transmission: [],
    location: '',
    make: '',
    model: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [isOpen, setIsOpen] = useState(false);

  

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      onFiltersChange(newFilters);
      return newFilters;
    });
  };

  const clearFilters = () => {
    const clearedFilters = {
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      minMileage: '',
      maxMileage: '',
      fuelType: [],
      transmission: [],
      location: '',
      make: '',
      model: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  // Read filters from URL on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const urlFilters = {};
    
    for (const [key, value] of searchParams.entries()) {
      if (key === 'fuelType' || key === 'transmission') {
        urlFilters[key] = value.split(',');
      } else {
        urlFilters[key] = value;
      }
    }
    
    if (Object.keys(urlFilters).length > 0) {
      setFilters({ ...filters, ...urlFilters });
      onFiltersChange(urlFilters);
    }
    else {
      // No URL filters — make sure parent receives the default filters so the
      // listings API receives the default sort/order on first render.
      onFiltersChange(filters);
    }
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && (Array.isArray(value) ? value.length > 0 : true)) {
        searchParams.set(key, Array.isArray(value) ? value.join(',') : value);
      }
    });
    
    const newUrl = `${window.location.pathname}${
      searchParams.toString() ? '?' + searchParams.toString() : ''
    }`;
    window.history.pushState({}, '', newUrl);
  }, [filters]);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-4">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900"
        >
          <Filter className="mr-2 h-4 w-4" />
          {isOpen ? 'Hide Filters' : 'Show Filters'}
        </Button>

        <div className="flex items-center gap-3">
          <SortSelect
            value={{ sortBy: filters.sortBy, sortOrder: filters.sortOrder }}
            onChange={({ sortBy, sortOrder }) => {
              handleFilterChange('sortBy', sortBy);
              handleFilterChange('sortOrder', sortOrder);
            }}
          />
        </div>
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Price Range</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Year Range</label>
            <div className="flex gap-2">
              <Select
                value={filters.minYear}
                onValueChange={(value) => {
                  // If maxYear is set, ensure minYear isn't greater than maxYear
                  if (filters.maxYear && Number(value) > Number(filters.maxYear)) {
                    handleFilterChange('maxYear', value); // Update maxYear to match
                  }
                  handleFilterChange('minYear', value);
                }}
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="From" />
                </SelectTrigger>
                <SelectContent>
                  <div className="overflow-y-auto max-h-[200px]">
                    {years.map((year) => (
                      <SelectItem 
                        key={year} 
                        value={year.toString()}
                        disabled={filters.maxYear && year > Number(filters.maxYear)}
                      >
                        {year}
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
              <Select
                value={filters.maxYear}
                onValueChange={(value) => {
                  // If minYear is set, ensure maxYear isn't less than minYear
                  if (filters.minYear && Number(value) < Number(filters.minYear)) {
                    handleFilterChange('minYear', value); // Update minYear to match
                  }
                  handleFilterChange('maxYear', value);
                }}
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="To" />
                </SelectTrigger>
                <SelectContent>
                  <div className="overflow-y-auto max-h-[200px]">
                    {years.map((year) => (
                      <SelectItem 
                        key={year} 
                        value={year.toString()}
                        disabled={filters.minYear && year < Number(filters.minYear)}
                      >
                        {year}
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Mileage Range</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minMileage}
                onChange={(e) => handleFilterChange('minMileage', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxMileage}
                onChange={(e) => handleFilterChange('maxMileage', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Fuel Type</label>
            <Select
              value={Array.isArray(filters.fuelType) ? filters.fuelType[0] || "" : filters.fuelType || ""}
              onValueChange={(value) => handleFilterChange('fuelType', [value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Fuel Type" />
              </SelectTrigger>
              <SelectContent>
                {fuelTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Transmission</label>
            <Select
              value={Array.isArray(filters.transmission) ? filters.transmission[0] || "" : filters.transmission || ""}
              onValueChange={(value) => handleFilterChange('transmission', [value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Transmission" />
              </SelectTrigger>
              <SelectContent>
                {transmissionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Location</label>
            <Input
              type="text"
              placeholder="Enter location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Make</label>
            <Input
              type="text"
              placeholder="Enter make"
              value={filters.make}
              onChange={(e) => handleFilterChange('make', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Model</label>
            <Input
              type="text"
              placeholder="Enter model"
              value={filters.model}
              onChange={(e) => handleFilterChange('model', e.target.value)}
            />
          </div>

          <div className="col-span-full flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchFilters;