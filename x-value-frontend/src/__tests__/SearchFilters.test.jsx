import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchFilters from '../components/SearchFilters';

// Mock child components that might cause issues in tests
vi.mock('../components/ui/Select', () => ({
  Select: ({ value, onValueChange, children }) => (
    <select value={value} onChange={(e) => onValueChange(e.target.value)}>
      {children}
    </select>
  ),
  SelectContent: ({ children }) => children,
  SelectItem: ({ value, children }) => (
    <option value={value}>{children}</option>
  ),
  SelectTrigger: ({ children }) => children,
  SelectValue: ({ placeholder }) => placeholder
}));

vi.mock('../components/ui/Input', () => ({
  Input: (props) => <input {...props} />
}));

describe('SearchFilters', () => {
  const mockOnFiltersChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call onFiltersChange when price filters change', () => {
    render(<SearchFilters onFiltersChange={mockOnFiltersChange} />);

    // Show filters first
    fireEvent.click(screen.getByText(/Show Filters/i));

    const minPriceInput = screen.getByPlaceholderText('Min');
    fireEvent.change(minPriceInput, { target: { value: '10000' } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        minPrice: '10000'
      })
    );
  });

  it('should clear all filters when reset button is clicked', () => {
    render(<SearchFilters onFiltersChange={mockOnFiltersChange} />);

    // Show filters first
    fireEvent.click(screen.getByText(/Show Filters/i));

    // Set a filter value
    const minPriceInput = screen.getByPlaceholderText('Min');
    fireEvent.change(minPriceInput, { target: { value: '10000' } });

    // Clear filters
    const clearButton = screen.getByText(/Clear Filters/i);
    fireEvent.click(clearButton);

    // Check if onFiltersChange was called with empty values
    expect(mockOnFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
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
        model: ''
      })
    );
  });
});