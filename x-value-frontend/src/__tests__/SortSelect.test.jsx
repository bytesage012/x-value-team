import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SortSelect from '../components/SortSelect';

// Mock the Select component since we're only testing the logic
vi.mock('../components/ui/Select', () => ({
  Select: ({ value, onValueChange, children }) => (
    <select 
      value={value || ''}
      onChange={(e) => onValueChange(e.target.value)}
      data-testid="sort-select"
    >
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

describe('SortSelect', () => {
  it('should call onChange with correct sort parameters', () => {
    const onChange = vi.fn();
    render(<SortSelect onChange={onChange} />);

    // Simulate selecting "Price: Low to High"
    screen.getByRole('combobox').value = 'price-asc';
    screen.getByRole('combobox').dispatchEvent(new Event('change'));

    expect(onChange).toHaveBeenCalledWith({
      sortBy: 'price',
      sortOrder: 'asc'
    });
  });

  it('should display correct sort value when provided', () => {
    render(
      <SortSelect
        value={{ sortBy: 'price', sortOrder: 'asc' }}
        onChange={() => {}}
      />
    );

    expect(screen.getByRole('combobox').value).toBe('price-asc');
  });
});