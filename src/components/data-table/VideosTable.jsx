import * as React from "react";
import { useEffect, useState } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { storage } from "../../firebase";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
// import TuneIcon from '@mui/icons-material/Tune';
import "./style.css";
import { FormControl, InputLabel, MenuItem, Modal, Select } from "@mui/material";
import Box from "@mui/material/Box";

import DropFileInput from "../drop-file-input/DropFileInput";
import UploadButton from "../upload-button/UploadButton";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));





const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function VideosTable(props) {
  const [file, setFile] = useState(null);
  const [filesList, setFilesList] = useState([]);
  const [refresh, setRefresh] = useState(null)

  const onFileChange = (files) => {
    const currentFile = files[0];
    setFile(currentFile);
    console.log(files);
  };

  const handleFetchFiles = async () => {
    try {
      const storageRef = ref(storage, "videos");
      const files = await listAll(storageRef);

      const filesData = await Promise.all(
        files.items.map(async (file) => {
          const url = await getDownloadURL(file);
          return { name: file.name, url };
        })
      );

      setFilesList(filesData);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    handleFetchFiles();
  }, [refresh]);

  const handleClick = () => {
    if (file === null) return;
    const fileRef = ref(storage, `Videos/${dropdown}/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress);
      },
      (error) => {
        console.log("error :(");
      },
      () => {
        console.log("success!!");
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // uploadToDatabase(downloadURL)
          console.log(downloadURL);
        });
        handleClose()
        setRefresh(!refresh)
      }
    );
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [dropdown, setDropdown] = React.useState('');

  const handleChange = (event) => {
    setDropdown(event.target.value);
  };
  return (
    <div>
      <div className="myStore">
        <p className="store"></p>
        <div className="filterFlex">
          <div onClick={handleOpen} className="newList">
            {/* <img src={Add} className='icon' /> */}
            <p className="addNew">Upload new Videos</p>
          </div>
        </div>
      </div>
      <TableContainer sx={{ width: "50vw" }} component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Id</StyledTableCell>
              <StyledTableCell align="left">Url</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data?.map((file, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  {index+1}
                </StyledTableCell>
                <StyledTableCell align="left">
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.name}
                  </a>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Path</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={dropdown}
          label="Path"
          onChange={handleChange}
        >
          <MenuItem value={"Ludo"}>Ludo</MenuItem>
          <MenuItem value={"Preloaded"}>Preloaded</MenuItem>
          <MenuItem value={"Live"}>Live</MenuItem>
        </Select>
      </FormControl>
    </Box>
          <h2 className="header">Uplaod Files to Firebase</h2>
          <DropFileInput onFileChange={(files) => onFileChange(files)} />
          <br></br>
          <UploadButton onClick={() => handleClick()}> </UploadButton>
          {/* <VideosList /> */}
        </Box>
      </Modal>
    </div>
  );
}
