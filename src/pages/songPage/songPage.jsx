import React, { useEffect, useState } from "react";
import { Box, Button, Stack, Dialog,
	DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import Header from "../header/header";
import { RedTextField } from "../../helpers/textFieldStyles"
import { getAllSongs, createSong, 
	deleteSongs, updateSong, postSongToAlbum } from "../../requests/songsRequest";
import { getAllAlbums } from "../../requests/albumsRequest";
import { useAuth } from "../../auth/useAuth";

import styles from "./styles";

export function SortedDescendingIcon() {
  return <ArrowDownwardIcon sx={{ color: "#ff3c38", fontSize: 18 }} />;
}

export function SortedAscendingIcon() {
  return <ArrowUpwardIcon sx={{ color: "#ff3c38", fontSize: 18 }} />;
}

const SongsPage = () => {
	const { user } = useAuth();
	const token = user.token;

	const [songs, setSongs] = useState([]);
	const [albums, setAlbums] = useState([]);
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [newSongTitle, setNewSongTitle] = useState("");
	const [selectedSongs, setSelectedSongs] = useState([]);

	const columns = [
		{
			field: 'title',
			headerName: 'Название',
			width: 200,
			editable: true,
		},
		{
			field: 'explicit',
			headerName: 'Взрослая',
			type: 'singleSelect',
			editable: true,
			width: 150,
			valueOptions: ["true", "false"]
		},
		{
			field: 'duration',
			headerName: 'Длительность, мин:сек',
			width: 200,
			editable: true,
		},
		{
			field: 'album',
			headerName: 'Альбом',
			editable: true,
			width: 200,
			type: 'singleSelect',
			valueOptions: ({ row }) => {
				const rowAlbums = albums.map(album => album.title);
				return rowAlbums;
			}
		},	
		{
			field: 'order',
			headerName: 'Порядковый номер',
			width: 200,
			editable: true,
			type: 'number'
		},
	];

	useEffect(() => {
		getSongs();
		getAlbums();
	}, []);

	const getSongs = async () => {
		try {
			const newSongs = await getAllSongs(token);
			setSongs(newSongs);
		} catch (error) {
			console.log(error)
		}
	};

	const getAlbums = async () => {
		try {
			const rawAlbums = await getAllAlbums(token);
			setAlbums(rawAlbums);
		} catch (error) {
			console.log(error)
		}
	};

	const handleAddAlbum = async () => {
		try {
			await createSong(newSongTitle, token);
		} catch (error) {
			console.log(error)
		}
		getSongs();
		
		handleCloseAddDialog()
	};

	const handleDeleteAlbums = async () => {
		try {
			await deleteSongs(selectedSongs, token);
		} catch (error) {
			console.log(error)
		}
		getSongs();
		
		handleCloseDeleteDialog()
	};

	const handleCellFocusOut = async (row) => {
		const album = albums.find(album => album.title === row.album);
		const updatedSong = {
			songId: row.song_id,
			title: row.title,
			explicit: row.explicit === 'true',
			duration: row.duration,
		};
		await updateSong(updatedSong, token);

		if (album.album_id != null) {
			await postSongToAlbum(row.song_id, album.album_id, row.order, token);
		}
	};

	const handleNewAlbumTitleChanged = (e) => {
		const newTitle = e.target.value;
		setNewSongTitle(newTitle);
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
			<Header showBackButton={true}>Песни</Header>
			<Box style={styles.table}>
				<DataGrid
					sx={styles.dataGridMain}
					getRowId={(row) => row.song_id}
					rows={songs}
					columns={columns}
					autoHeight
					pageSize={5}
					loading={songs == null ? true : false}
					checkboxSelection
					disableSelectionOnClick
					experimentalFeatures={{ newEditingApi: true }}
					onSelectionModelChange={(ids) => setSelectedSongs(ids)}
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
						disabled={selectedSongs.length === 0}
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
						Добавить песню
					</Button>
				</Stack>
				<Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
					<DialogTitle sx={{fontFamily: '-apple-system'}}>Добавить песню</DialogTitle>
					<DialogContent>
						<DialogContentText sx={{fontFamily: '-apple-system'}}>
							Введите название песни, чтобы добавить её в EHM.
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
							label="Название песни"
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
							Вы действительно хотите удалить выделенные песни?
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

export default SongsPage;
