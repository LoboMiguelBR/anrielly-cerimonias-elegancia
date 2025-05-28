
import { Checkbox } from '@/components/ui/checkbox';

interface CheckboxGroupProps {
  values: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

const CheckboxGroup = ({ values, selected, onChange }: CheckboxGroupProps) => {
  const handleToggle = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {values.map((value) => (
        <div key={value} className="flex items-center space-x-2">
          <Checkbox
            id={value}
            checked={selected.includes(value)}
            onCheckedChange={() => handleToggle(value)}
          />
          <label
            htmlFor={value}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {value}
          </label>
        </div>
      ))}
    </div>
  );
};

export default CheckboxGroup;
