import React, { useEffect, useState } from "react";
import { Box, Button, Stack, Dialog,
	DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import Header from "../header/header";
import { RedTextField } from "../../helpers/textFieldStyles"
import { getAllGenres, createGenre, deleteGenres, updateGenre } from "../../requests/genresRequest";
import { useAuth } from "../../auth/useAuth";

import styles from "./styles";

export function SortedDescendingIcon() {
  return <ArrowDownwardIcon sx={{ color: "#ff3c38", fontSize: 18 }} />;
}

export function SortedAscendingIcon() {
  return <ArrowUpwardIcon sx={{ color: "#ff3c38", fontSize: 18 }} />;
}

const GenresPage = () => {
	const { user } = useAuth();
	const token = user.token;

	const [genres, setGenres] = useState([]);
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [newGenreName, setNewGenreName] = useState("");
	const [selectedGenres, setSelectedGenres] = useState([]);

	const columns = [
		{
			field: 'name',
			headerName: 'Название',
			width: 200,
			editable: true,
		},
	];

	useEffect(() => {
		getGenres();
	}, []);

	const getGenres = async () => {
		try {
			const newGenres = await getAllGenres(token);
			setGenres(newGenres);
		} catch (error) {
			console.log(error)
		}
	};

	const handleAddAlbum = async () => {
		try {
			await createGenre(newGenreName, token);
		} catch (error) {
			console.log(error)
		}
		getGenres();
		
		handleCloseAddDialog()
	};

	const handleDeleteAlbums = async () => {
		try {
			await deleteGenres(selectedGenres, token);
		} catch (error) {
			console.log(error)
		}
		getGenres();
		
		handleCloseDeleteDialog()
	};

	const handleCellFocusOut = async (row) => {
		const updatedGenre = {
			genreId: row.genre_id,
			name: row.name
		};
		await updateGenre(updatedGenre, token);
	};

	const handleNewAlbumTitleChanged = (e) => {
		const newTitle = e.target.value;
		setNewGenreName(newTitle);
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

	return (
		<div style={styles.container}>
			<Header showBackButton={true}>Жанры</Header>
			<Box style={styles.table}>
				<DataGrid
					sx={styles.dataGridMain}
					getRowId={(row) => row.genre_id}
					rows={genres}
					columns={columns}
					autoHeight
					pageSize={5}
					loading={genres == null ? true : false}
					checkboxSelection
					disableSelectionOnClick
					experimentalFeatures={{ newEditingApi: true }}
					onSelectionModelChange={(ids) => setSelectedGenres(ids)}
					processRowUpdate={(newRow) => {
						handleCellFocusOut(newRow);
						return newRow
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
						disabled={selectedGenres.length === 0}
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
						Добавить жанр
					</Button>
				</Stack>
				<Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
					<DialogTitle sx={{fontFamily: '-apple-system'}}>Добавить жанр</DialogTitle>
					<DialogContent>
						<DialogContentText sx={{fontFamily: '-apple-system'}}>
							Введите название жанра, чтобы добавить его в EHM.
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
							label="Название жанра"
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
					<DialogTitle sx={{fontFamily: '-apple-system'}}>Удаление песен</DialogTitle>
					<DialogContent>
						<DialogContentText sx={{fontFamily: '-apple-system'}}>
							Вы действительно хотите удалить выделенные жанры?
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
			</Box>
		</div>
	);
};

export default GenresPage;
