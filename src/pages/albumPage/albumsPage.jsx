import React, { useEffect, useState } from "react";
import dateFormat, { masks } from "dateformat";
import { Box, Button, Stack, Dialog,
	DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import Header from "../header/header";
import { RedTextField } from "../../helpers/textFieldStyles"
import { getAllAlbums, createAlbum, 
	deleteAlbums, getAlbumTypes, updateAlbum, getBandsShort, postAlbumToBand } from "../../requests/albumsRequest";
import { useAuth } from "../../auth/useAuth";

import styles from "./styles";

export function SortedDescendingIcon() {
  return <ArrowDownwardIcon sx={{ color: "#ff3c38", fontSize: 18 }} />;
}

export function SortedAscendingIcon() {
  return <ArrowUpwardIcon sx={{ color: "#ff3c38", fontSize: 18 }} />;
}

const AlbumsPage = () => {
	const { user } = useAuth();
	const token = user.token;

	const [albums, setAlbums] = useState([]);
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
	const [newAlbumTitle, setNewAlbumTitle] = useState("");
	const [albumHistory, setAlbumHistory] = useState("");
	const [editingRow, setEditingRow] = useState();
	const [selectedAlbums, setSelectedAlbums] = useState([]);
	const [albumTypes, setAlbumTypes] = useState([]);
	const [bands, setBands] = useState([]);

	const columns = [
		{
			field: 'title',
			headerName: 'Название',
			width: 200,
			editable: true,
		},
		{
			field: 'album_cover_path',
			headerName: 'Путь до обложки',
			width: 200,
			editable: true,
		},
		{
			field: 'released',
			headerName: 'Дата релиза',
			type: 'date',
			width: 140,
			editable: true,
			valueGetter: ({ value }) => value && new Date(value),
		},
		{
			field: 'explicit',
			headerName: 'Откровенный',
			type: 'singleSelect',
			editable: true,
			width: 150,
			valueOptions: ["true", "false"]
		},
		{
			field: 'type',
			headerName: 'Тип',
			editable: true,
			width: 80,
			type: 'singleSelect',
			valueOptions: ({ row }) => {
				const types = albumTypes.map(type => type.type)
				return types;
			}
		},
		{
			field: 'band',
			headerName: 'Коллектив',
			editable: true,
			width: 150,
			type: 'singleSelect',
			valueOptions: ({ row }) => {
				const band = bands.map(band => band.title)
				return band;
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
		getAlbums();
		getTypes();
		getBands();
	}, []);

	const getAlbums = async () => {
		try {
			const newAlbums = await getAllAlbums(token);
			setAlbums(newAlbums);
		} catch (error) {
			console.log(error)
		}
	};

	const getTypes = async () => {
		try {
			const rawTypes = await getAlbumTypes(token);
			setAlbumTypes(rawTypes);
		} catch (error) {
			console.log(error)
		}
	};

	const getBands = async () => {
		try {
			const bands = await getBandsShort(token);
			setBands(bands);
		} catch (error) {
			console.log(error)
		}
	};

	const handleAddAlbum = async () => {
		try {
			await createAlbum(newAlbumTitle, token);
		} catch (error) {
			console.log(error)
		}
		getAlbums();
		
		handleCloseAddDialog()
	};

	const handleSaveAlbumHistory = () => {
		const updatedRow = {
			...editingRow,
			history: albumHistory
		};
		handleCellFocusOut(updatedRow);
		handleCloseHistoryDialog();
	};

	const handleDeleteAlbums = async () => {
		try {
			await deleteAlbums(selectedAlbums, token);
		} catch (error) {
			console.log(error)
		}
		getAlbums();
		
		handleCloseDeleteDialog()
	};

	const handleCellFocusOut = async (row) => {
		const albumType = albumTypes.find(type => type.type === row.type);
		const band = bands.find(band => band.title === row.band);
		const formattedReleaseDate = dateFormat(row.released, "yyyy-mm-dd'T'HH:MM:ss'Z'");
		const updatedAlbum = {
			album_id: row.album_id,
			band: band === undefined ? undefined : band.band_id,
			title: row.title,
			album_cover_path: row.album_cover_path,
			released: formattedReleaseDate,
			explicit: row.explicit === 'true',
			history: row.history,
			type: albumType === undefined ? undefined : albumType.album_type_id,
		};
		await updateAlbum(updatedAlbum, token);

		await postAlbumToBand(row.album_id, band.band_id, token);
	};

	const handleNewAlbumTitleChanged = (e) => {
		const newTitle = e.target.value;
		setNewAlbumTitle(newTitle);
	};

	const handleHistoryChanged = (e) => {
		const newHistory = e.target.value;
		setAlbumHistory(newHistory);
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
			<Header showBackButton={true}>Альбомы</Header>
			<Box style={styles.table}>
				<DataGrid
					sx={styles.dataGridMain}
					getRowId={(row) => row.album_id}
					rows={albums}
					columns={columns}
					autoHeight
					pageSize={10}
					loading={albums == null ? true : false}
					checkboxSelection
					disableSelectionOnClick
					experimentalFeatures={{ newEditingApi: true }}
					onSelectionModelChange={(ids) => setSelectedAlbums(ids)}
					processRowUpdate={(newRow) => {
						handleCellFocusOut(newRow);
						return newRow
					}}
					onCellClick={params => {
						if (params.field === "history") {
							setAlbumHistory(params.value);
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
						disabled={selectedAlbums.length === 0}
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
						Добавить альбом
					</Button>
				</Stack>
				<Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
					<DialogTitle sx={{fontFamily: '-apple-system'}}>Добавить альбом</DialogTitle>
					<DialogContent>
						<DialogContentText sx={{fontFamily: '-apple-system'}}>
							Введите название альбома, чтобы добавить его в EHM.
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
							label="Название альбома"
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
					<DialogTitle sx={{fontFamily: '-apple-system'}}>Удаление альбомов</DialogTitle>
					<DialogContent>
						<DialogContentText sx={{fontFamily: '-apple-system'}}>
							Вы действительно хотите удалить выделенные альбомы?
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
							В поле введите историю альбома.
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
							value={albumHistory ?? ""}
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

export default AlbumsPage;
