import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

export const RedTextField = styled(TextField)({
	"& label.Mui-focused": {
		color: "#FF3C38",
	},
	"& .MuiOutlinedInput-root": {
		"& fieldset": {
			borderColor: "#FF3C38",
		},
	},
});
