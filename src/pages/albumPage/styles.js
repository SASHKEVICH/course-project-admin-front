const styles = {
	container: {
		display: "flex",
		flexDirection: "column",
		backgroundColor: "#121113",
		alignItems: "flex-start",
		height: "100vh",
	},
	table: {
		width: "77vw",
		margin: "2% auto 0 auto",
	},
	dataGridMain: {
		"& .MuiDataGrid-main": {
			color: "white",
		},
		"& .MuiDataGrid-cell:hover": {
			color: "#ff3c38",
		},
		"& .MuiCheckbox-root svg path": {
			display: "none",
		},
		"& .MuiDataGrid-cell": {
			outline: "none !important",
		},
		"& .MuiCheckbox-root svg": {
			width: 16,
			height: 16,
			backgroundColor: "transparent",
			border: "1px solid #ff3c38",
		},
		"& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg": {
			backgroundColor: "#ff3c38",
			borderColor: "#ff3c38",
		},
		"& .MuiCheckbox-root.Mui-checked .MuiIconButton-label:after": {
			position: "absolute",
			display: "table",
			border: "2px solid #ff3c38",
			borderTop: 0,
			borderLeft: 0,
			transform: "rotate(45deg) translate(-50%,-50%)",
			opacity: 1,
			transition: "all .2s cubic-bezier(.12,.4,.29,1.46) .1s",
			content: '""',
			top: "50%",
			left: "39%",
			width: 5.71428571,
			height: 9.14285714,
		},
		"& .MuiCheckbox-root.MuiCheckbox-indeterminate .MuiIconButton-label:after":
			{
				width: 8,
				height: 8,
				backgroundColor: "#ff3c38",
				transform: "none",
				top: "39%",
				border: 0,
			},
	},
};

export default styles;
