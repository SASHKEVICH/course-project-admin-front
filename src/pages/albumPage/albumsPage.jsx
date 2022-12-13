import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import Header from "../header/header";
import { getAllAlbums } from "../../requests/albumsRequest";
import { useAuth } from "../../auth/useAuth";

import styles from "./styles";

const columns = [
  { field: 'album_id', headerName: 'ID', width: 90 },
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
    type: 'number',
    width: 170,
    editable: true,
  },
  {
    field: 'explicit',
    headerName: 'Откровенный контент',
		type: 'bool',
    editable: true,
    width: 220,
  },
  {
    field: 'type',
    headerName: 'Тип альбома',
    editable: true,
    width: 160,
  },
];

export function SortedDescendingIcon() {
  return <ArrowDownwardIcon sx={{ color: "#ff3c38", fontSize: 18 }} />;
}

export function SortedAscendingIcon() {
  return <ArrowUpwardIcon sx={{ color: "#ff3c38", fontSize: 18 }} />;
}

const AlbumsPage = () => {
	const { user } = useAuth();

	const [albums, setAlbums] = useState([]);
	const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxOSwiZW1haWwiOiIxMjNAMTIzLnJ1IiwiaWF0IjoxNjcwOTA2NjAyLCJleHAiOjE2NzA5MTM4MDJ9.BdX6-DSaVADRxMLTdclBih5DC9aDrt91J0Db6E1DF8I"

	useEffect(() => {
		getAlbums()
	}, []);

	const getAlbums = async () => {
		try {
			const newAlbums = await getAllAlbums(token);
			setAlbums(newAlbums);
		} catch (error) {
			console.log(error)
		}
	};

	return (
		<div style={styles.container}>
			<Header>Альбомы</Header>
			<Box style={styles.table}>
				<DataGrid
					sx={styles.dataGridMain}
					getRowId={(row) => row.album_id}
					rows={albums}
					columns={columns}
					autoHeight
					loading={albums == null ? true : false}
					hideFooter
					checkboxSelection
					disableSelectionOnClick
					experimentalFeatures={{ newEditingApi: true }}
					components={{
						ColumnSortedDescendingIcon: SortedDescendingIcon,
						ColumnSortedAscendingIcon: SortedAscendingIcon,
        	}}
      	/>
			</Box>
		</div>
	);
};

export default AlbumsPage;