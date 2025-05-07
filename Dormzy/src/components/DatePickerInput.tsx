import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerInputProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  showMonthYearPicker?: boolean;
  showYearPicker?: boolean;
  disabled?: boolean;
  className?: string;
  isClearable?: boolean;
  dateFormat?: string;
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({
  selectedDate,
  onChange,
  placeholder = 'Select date',
  minDate,
  maxDate,
  showMonthYearPicker = false,
  showYearPicker = false,
  disabled = false,
  className = '',
  isClearable = true,
  dateFormat = 'MM/dd/yyyy'
}) => {
  const CustomInput = forwardRef<HTMLDivElement, { value?: string; onClick?: () => void }>(
    ({ value, onClick }, ref) => (
      <div
        className={`date-picker-input ${className}`}
        onClick={onClick}
        ref={ref}
        style={{
          position: 'relative',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.7 : 1
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '12px 16px',
            background: disabled ? 'var(--secondary-color)' : 'white'
          }}
        >
          <Calendar size={18} style={{ marginRight: '10px', color: 'var(--text-light)' }} />
          <span style={{ flex: 1, color: value ? 'var(--text-color)' : 'var(--text-light)' }}>
            {value || placeholder}
          </span>
        </div>
      </div>
    )
  );

  return (
    <DatePicker
      selected={selectedDate}
      onChange={onChange}
      customInput={<CustomInput />}
      minDate={minDate}
      maxDate={maxDate}
      showMonthYearPicker={showMonthYearPicker}
      showYearPicker={showYearPicker}
      disabled={disabled}
      isClearable={isClearable}
      dateFormat={dateFormat}
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      popperPlacement="bottom-start"
      popperModifiers={[
        {
          name: 'offset',
          options: {
            offset: [0, 8]
          }
        }
      ]}
      wrapperClassName="date-picker-wrapper"
      calendarClassName="date-picker-calendar"
    />
  );
};

export default DatePickerInput;