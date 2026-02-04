import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#fffdf8',
    '& fieldset': {
      borderColor: '#d7cbb8'
    },
    '&:hover fieldset': {
      borderColor: '#d7cbb8'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#c9a227'
    }
  },
  '& .MuiOutlinedInput-input': {
    padding: '10px 12px',
    fontSize: '14px'
  }
};

export default function AutocompleteField({
  label,
  placeholder,
  options,
  value,
  inputValue,
  onChange,
  onInputChange,
  loading = false,
  disabled = false,
  isOptionEqualToValue,
  getOptionLabel = (option) => option?.label ?? '',
  hideLabel = false,
  containerClassName = 'form-field'
}) {
  return (
    <div className={containerClassName}>
      {hideLabel ? null : <span className="form-label">{label}</span>}
      <Autocomplete
        options={options}
        value={value}
        inputValue={inputValue}
        onChange={onChange}
        onInputChange={onInputChange}
        loading={loading}
        disabled={disabled}
        isOptionEqualToValue={isOptionEqualToValue}
        getOptionLabel={getOptionLabel}
        filterOptions={(items) => items}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            size="small"
            sx={textFieldSx}
            inputProps={{
              ...params.inputProps,
              'aria-label': label
            }}
          />
        )}
      />
    </div>
  );
}
