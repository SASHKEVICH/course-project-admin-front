import React, { useEffect, useState } from "react";
import dateFormat from "dateformat";
import { Box, Button, Stack, Dialog,
	DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import Header from "../header/header";
import { RedTextField } from "../../helpers/textFieldStyles"
import { getAllBands, createBand, 
	deleteBand, updateBand, postGenreToBand } from "../../requests/bandsRequest";
import { getAllGenres } from "../../requests/genresRequest";
import { useAuth } from "../../auth/useAuth";

import styles from "./styles";

export function SortedDescendingIcon() {
  return <ArrowDownwardIcon sx={{ color: "#ff3c38", fontSize: 18 }} />;
}

export function SortedAscendingIcon() {
  return <ArrowUpwardIcon sx={{ color: "#ff3c38", fontSize: 18 }} />;
}

const BandsPage = () => {
	const { user } = useAuth();
	const token = user.token;

	const [bands, setBands] = useState([]);
	const [bandsGenres, setBandsGenres] = useState([]);
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
	const [newBandTitle, setNewBandTitle] = useState("");
	const [bandHistory, setBandHistory] = useState("");
	const [editingRow, setEditingRow] = useState();
	const [selectedBands, setSelectedBands] = useState([]);

	const columns = [
		{
			field: 'title',
			headerName: 'Название',
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
			field: 'founded',
			headerName: 'Дата основания',
			type: 'date',
			width: 140,
			editable: true,
			valueGetter: ({ value }) => value && new Date(value),
		},
		{
			field: 'ended',
			headerName: 'Дата распада',
			type: 'date',
			width: 140,
			editable: true,
			valueGetter: ({ value }) => value && new Date(value),
		},
		{
			field: 'genre',
			headerName: 'Жанр',
			editable: true,
			width: 120,
			type: 'singleSelect',
			valueOptions: ({ row }) => {
				const genres = bandsGenres.map(genre => genre.name)
				return genres;
			}
		},
		{
			field: 'history',
			headerName: 'История',
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
		getBands();
		getGenres();
	}, []);

	const getBands = async () => {
		try {
			const newBands = await getAllBands(token);
			console.log(newBands)
			setBands(newBands);
		} catch (error) {
			console.log(error)
		}
	};

	const getGenres = async () => {
		try {
			const rawGenres = await getAllGenres(token);
			setBandsGenres(rawGenres);
		} catch (error) {
			console.log(error)
		}
	};

	const handleAddAlbum = async () => {
		try {
			await createBand(newBandTitle, token);
		} catch (error) {
			console.log(error)
		}
		getBands();
		
		handleCloseAddDialog()
	};

	const handleSaveAlbumHistory = () => {
		const updatedRow = {
			...editingRow,
			history: bandHistory
		};
		handleCellFocusOut(updatedRow);
		handleCloseHistoryDialog();
	};

	const handleDeleteAlbums = async () => {
		try {
			await deleteBand(selectedBands, token);
		} catch (error) {
			console.log(error)
		}
		getBands();
		
		handleCloseDeleteDialog()
	};

	const handleCellFocusOut = async (row) => {
		const genre = bandsGenres.find(genre => genre.name === row.genre);
		const formattedFoundedDate = dateFormat(row.founded ?? undefined, "yyyy-mm-dd'T'HH:MM:ss'Z'");
		const formattedEndedDate = dateFormat(row.ended ?? undefined, "yyyy-mm-dd'T'HH:MM:ss'Z'");
		const updatedBand = {
			band_id: row.band_id,
			title: row.title,
			photo_path: row.photo_path,
			founded: formattedFoundedDate,
			ended: formattedEndedDate,
			history: row.history,
			origin_city: row.origin_city,
			country: row.country
		};
		await updateBand(updatedBand, token);

		await postGenreToBand(row.band_id, genre.genre_id, token);
	};

	const handleNewAlbumTitleChanged = (e) => {
		const newTitle = e.target.value;
		setNewBandTitle(newTitle);
	};

	const handleHistoryChanged = (e) => {
		const newHistory = e.target.value;
		setBandHistory(newHistory);
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
			<Header showBackButton={true}>Группы</Header>
			<Box style={styles.table}>
				<DataGrid
					sx={styles.dataGridMain}
					getRowId={(row) => row.band_id}
					rows={bands}
					columns={columns}
					autoHeight
					pageSize={10}
					loading={bands == null ? true : false}
					checkboxSelection
					disableSelectionOnClick
					experimentalFeatures={{ newEditingApi: true }}
					onSelectionModelChange={(ids) => setSelectedBands(ids)}
					processRowUpdate={(newRow) => {
						handleCellFocusOut(newRow);
						return newRow
					}}
					onCellClick={params => {
						if (params.field === "history") {
							setBandHistory(params.value);
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
						disabled={selectedBands.length === 0}
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
						Добавить группу
					</Button>
				</Stack>
				<Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
					<DialogTitle sx={{fontFamily: '-apple-system'}}>Добавить группу</DialogTitle>
					<DialogContent>
						<DialogContentText sx={{fontFamily: '-apple-system'}}>
							Введите название группы, чтобы добавить его в EHM.
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
							label="Название группы"
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
							Вы действительно хотите удалить выделенные группы?
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
							В поле введите историю группы.
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
							value={bandHistory ?? ""}
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

export default BandsPage;
