import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

export const RedTextField = styled(TextField)({
	"& label.Mui-focused": {
		color: "#FF3C38",
	},
	"& .MuiOutlinedInput-root": {
		"& fieldset": {
			borderColor: "#fff",
			borderRadius: 10,
		},
		'&:hover fieldset': {
      borderColor: '#fff',
    },
		'&.Mui-focused fieldset': {
      borderColor: '#FF3C38',
    },
	},
	"& label": {
		color: "#BBB5BD",
		fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(',')
	},
	"& .MuiInputBase-input": {
		color: "#fff",
		fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(',')
	}
});
