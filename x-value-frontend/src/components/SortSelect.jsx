import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/Select';

const sortOptions = [
  { value: 'price-asc', label: 'Price: Low to High', sortBy: 'price', sortOrder: 'asc' },
  { value: 'price-desc', label: 'Price: High to Low', sortBy: 'price', sortOrder: 'desc' },
  { value: 'year-desc', label: 'Year: Newest First', sortBy: 'year', sortOrder: 'desc' },
  { value: 'year-asc', label: 'Year: Oldest First', sortBy: 'year', sortOrder: 'asc' },
  { value: 'mileage-asc', label: 'Mileage: Low to High', sortBy: 'mileage', sortOrder: 'asc' },
  { value: 'mileage-desc', label: 'Mileage: High to Low', sortBy: 'mileage', sortOrder: 'desc' },
  { value: 'createdAt-desc', label: 'Newest Listings', sortBy: 'createdAt', sortOrder: 'desc' },
  { value: 'createdAt-asc', label: 'Oldest Listings', sortBy: 'createdAt', sortOrder: 'asc' },
];

const SortSelect = ({ value, onChange }) => {
  const handleValueChange = (selectedValue) => {
    const option = sortOptions.find((opt) => opt.value === selectedValue);
    if (option) {
      onChange({ sortBy: option.sortBy, sortOrder: option.sortOrder });
    }
  };

  return (
    <Select
      value={value ? `${value.sortBy}-${value.sortOrder}` : undefined}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-[200px] bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900">
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SortSelect;