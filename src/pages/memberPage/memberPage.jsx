import React, { useEffect, useState } from "react";
import dateFormat from "dateformat";
import { Box, Button, Stack, Dialog,
	DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import Header from "../header/header";
import { RedTextField } from "../../helpers/textFieldStyles"
import { getAllMembers, createMember, 
	deleteMember, updateMember, postMemberToBand } from "../../requests/membersRequest";
import { getAllBands } from "../../requests/bandsRequest";
import { useAuth } from "../../auth/useAuth";

import styles from "./styles";

export function SortedDescendingIcon() {
  return <ArrowDownwardIcon sx={{ color: "#ff3c38", fontSize: 18 }} />;
}

export function SortedAscendingIcon() {
  return <ArrowUpwardIcon sx={{ color: "#ff3c38", fontSize: 18 }} />;
}

const MembersPage = () => {
	const { user } = useAuth();
	const token = user.token;

	const [members, setMembers] = useState([]);
	const [membersBands, setMembersBands] = useState([]);
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
	const [newMemberName, setNewMemberName] = useState("");
	const [memberHistory, setMemberHistory] = useState("");
	const [editingRow, setEditingRow] = useState();
	const [selectedMembers, setSelectedMembers] = useState([]);

	const columns = [
		{
			field: 'name',
			headerName: 'Имя',
			width: 200,
			editable: true,
		},
		{
			field: 'photo_path',
			headerName: 'Путь до фото',
			width: 200,
			editable: true,
		},
		{
			field: 'birth_date',
			headerName: 'Дата рождения',
			type: 'date',
			width: 140,
			editable: true,
			valueGetter: ({ value }) => value && new Date(value),
		},
		{
			field: 'die_date',
			headerName: 'Дата смерти',
			type: 'date',
			width: 140,
			editable: true,
			valueGetter: ({ value }) => value && new Date(value),
		},
		{
			field: 'band',
			headerName: 'Группа',
			editable: true,
			width: 120,
			type: 'singleSelect',
			valueOptions: ({ row }) => {
				const bands = membersBands.map(band => band.title);
				return bands;
			}
		},
		{
			field: 'biography',
			headerName: 'Биография',
			width: 120,
			renderCell: (params) => {
				return <HistoryButton />
			},
		},
	];

	const HistoryButton = () => {
		return (
			<Button
				variant="contained"
				size="small"
				sx={{
					backgroundColor: "#fff",
					borderRadius: 2,
					height: "40px",
					width: "100px",
					color: "#000",
					"&:hover": {
						backgroundColor: "#ff3c38",
					}
				}}
				onClick={handleOpenHistoryDialog}
			>
				Открыть
			</Button>
		)
	};

	useEffect(() => {
		getMembers();
		getBands();
	}, []);

	const getMembers = async () => {
		try {
			const newMembers = await getAllMembers(token);
			setMembers(newMembers);
		} catch (error) {
			console.log(error)
		}
	};

	const getBands = async () => {
		try {
			const rawBands = await getAllBands(token);
			setMembersBands(rawBands);
		} catch (error) {
			console.log(error)
		}
	};

	const handleAddAlbum = async () => {
		try {
			await createMember(newMemberName, token);
		} catch (error) {
			console.log(error)
		}
		getMembers();
		
		handleCloseAddDialog()
	};

	const handleSaveAlbumHistory = () => {
		const updatedRow = {
			...editingRow,
			history: memberHistory
		};
		handleCellFocusOut(updatedRow);
		handleCloseHistoryDialog();
	};

	const handleDeleteAlbums = async () => {
		try {
			await deleteMember(selectedMembers, token);
		} catch (error) {
			console.log(error)
		}
		getMembers();
		
		handleCloseDeleteDialog()
	};

	const handleCellFocusOut = async (row) => {
		const band = membersBands.find(band => band.title === row.band);
		const formattedBirthDate = row.founded != null ? dateFormat(row.founded, "yyyy-mm-dd'T'HH:MM:ss'Z'") : null;
		const formattedDieDate = row.ended != null ? dateFormat(row.ended, "yyyy-mm-dd'T'HH:MM:ss'Z'") : null;
		const updatedMember = {
			memberId: row.member_id,
			name: row.name,
			biography: row.biography,
			birthDate: formattedBirthDate,
			dieDate: formattedDieDate,
			originCity: row.origin,
			photoPath: row.photo_path,
		};
		await updateMember(updatedMember, token);

		if (band.band_id != null) {
			await postMemberToBand(row.member_id, band.band_id, token);
		}
	};

	const handleNewAlbumTitleChanged = (e) => {
		const newTitle = e.target.value;
		setNewMemberName(newTitle);
	};

	const handleHistoryChanged = (e) => {
		const newHistory = e.target.value;
		setMemberHistory(newHistory);
	};

	const handleOpenAddDialog = () => {
		setOpenAddDialog(true);
	};

	const handleCloseAddDialog = () => {
		setOpenAddDialog(false);
	};

	const handleOpenDeleteDialog = () => {
		setOpenDeleteDialog(true);
		
	};

	const handleCloseDeleteDialog = () => {
		setOpenDeleteDialog(false);
	};

	const handleOpenHistoryDialog = () => {
		setOpenHistoryDialog(true);
	};

	const handleCloseHistoryDialog = () => {
		setOpenHistoryDialog(false);
	};

	return (
		<div style={styles.container}>
			<Header showBackButton={true}>Участники</Header>
			<Box style={styles.table}>
				<DataGrid
					sx={styles.dataGridMain}
					getRowId={(row) => row.member_id}
					rows={members}
					columns={columns}
					autoHeight
					pageSize={10}
					loading={members == null ? true : false}
					checkboxSelection
					disableSelectionOnClick
					experimentalFeatures={{ newEditingApi: true }}
					onSelectionModelChange={(ids) => setSelectedMembers(ids)}
					processRowUpdate={(newRow) => {
						handleCellFocusOut(newRow);
						return newRow
					}}
					onCellClick={params => {
						if (params.field === "history") {
							setMemberHistory(params.value);
							setEditingRow(params.row);
						}
					}}
					onProcessRowUpdateError={error => console.log(error)}
					components={{
						ColumnSortedDescendingIcon: SortedDescendingIcon,
						ColumnSortedAscendingIcon: SortedAscendingIcon,
        	}}
      	/>
				<Stack style={styles.tableButtons}>
					<Button
						sx={{
							backgroundColor: "#fff",
							borderRadius: 2,
							height: "40px",
							width: "100px",
							color: "#000",
							"&:hover": {
								backgroundColor: "#ff3c38",
							},
						}}
						onClick={handleOpenDeleteDialog}
						disabled={selectedMembers.length === 0}
					>
						Удалить
					</Button>
					<Button
						sx={{
							backgroundColor: "#fff",
							borderRadius: 2,
							height: "40px",
							width: "200px",
							color: "#000",
							"&:hover": {
								backgroundColor: "#ff3c38",
							},
						}}
						onClick={handleOpenAddDialog}
					>
						Добавить участника
					</Button>
				</Stack>
				<Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
					<DialogTitle sx={{fontFamily: '-apple-system'}}>Добавить участника</DialogTitle>
					<DialogContent>
						<DialogContentText sx={{fontFamily: '-apple-system'}}>
							Введите имя участника, чтобы добавить его в EHM.
						</DialogContentText>
						<RedTextField
							sx={{
								"& .MuiInputBase-input": {
									color: "#000",
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
							}}
							autoFocus
							margin="dense"
							id="album"
							label="Имя участника"
							type="text"
							fullWidth
							onChange={(e) => handleNewAlbumTitleChanged(e)}
						/>
					</DialogContent>
					<DialogActions>
						<Button 
							sx={{
								backgroundColor: "#000",
								borderRadius: 2,
								height: "40px",
								color: "#fff",
								"&:hover": {
									backgroundColor: "#ff3c38",
								}
							}}
							onClick={handleCloseAddDialog}
						>
							Отмена
						</Button>
						<Button 
							sx={{
								backgroundColor: "#000",
								borderRadius: 2,
								height: "40px",
								color: "#fff",
								"&:hover": {
									backgroundColor: "#ff3c38",
								}
							}}
							onClick={handleAddAlbum}
						>
							Добавить
						</Button>
					</DialogActions>
      	</Dialog>
				<Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
					<DialogTitle sx={{fontFamily: '-apple-system'}}>Удаление групп</DialogTitle>
					<DialogContent>
						<DialogContentText sx={{fontFamily: '-apple-system'}}>
							Вы действительно хотите удалить выделенных участников?
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button 
							sx={{
								backgroundColor: "#000",
								borderRadius: 2,
								height: "40px",
								color: "#fff",
								"&:hover": {
									backgroundColor: "#ff3c38",
								}
							}}
							onClick={handleCloseDeleteDialog}
						>
							Отмена
						</Button>
						<Button 
							sx={{
								backgroundColor: "#000",
								borderRadius: 2,
								height: "40px",
								color: "#fff",
								"&:hover": {
									backgroundColor: "#ff3c38",
								}
							}}
							onClick={handleDeleteAlbums}
						>
							Да
						</Button>
					</DialogActions>
      	</Dialog>
				<Dialog open={openHistoryDialog} onClose={handleCloseHistoryDialog}>
					<DialogTitle sx={{fontFamily: '-apple-system'}}>Изменить историю</DialogTitle>
					<DialogContent>
						<DialogContentText sx={{fontFamily: '-apple-system'}}>
							В поле введите биографию участника.
						</DialogContentText>
						<RedTextField
							sx={{
								"& .MuiInputBase-input": {
									color: "#000",
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
								width: "500px"
							}}
							autoFocus
							multiline
							margin="dense"
							id="albumHistory"
							label="История"
							type="text"
							value={memberHistory ?? ""}
							onChange={(e) => handleHistoryChanged(e)}
						/>
					</DialogContent>
					<DialogActions>
						<Button 
							sx={{
								backgroundColor: "#000",
								borderRadius: 2,
								height: "40px",
								color: "#fff",
								"&:hover": {
									backgroundColor: "#ff3c38",
								}
							}}
							onClick={handleCloseHistoryDialog}
						>
							Отмена
						</Button>
						<Button 
							sx={{
								backgroundColor: "#000",
								borderRadius: 2,
								height: "40px",
								color: "#fff",
								"&:hover": {
									backgroundColor: "#ff3c38",
								}
							}}
							onClick={handleSaveAlbumHistory}
						>
							Добавить
						</Button>
					</DialogActions>
      	</Dialog>
			</Box>
		</div>
	);
};

export default MembersPage;
