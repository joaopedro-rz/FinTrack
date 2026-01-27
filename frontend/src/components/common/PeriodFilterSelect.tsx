import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { PERIOD_FILTERS, type PeriodFilter } from '@/types';

interface PeriodFilterSelectProps {
  value: PeriodFilter;
  onChange: (value: PeriodFilter) => void;
  label?: string;
  size?: 'small' | 'medium';
}

export default function PeriodFilterSelect({
  value,
  onChange,
  label = 'Período',
  size = 'small'
}: PeriodFilterSelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as PeriodFilter);
  };

  return (
    <FormControl size={size} sx={{ minWidth: 180 }}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={handleChange}>
        {PERIOD_FILTERS.map((filter) => (
          <MenuItem key={filter.value} value={filter.value}>
            {filter.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
