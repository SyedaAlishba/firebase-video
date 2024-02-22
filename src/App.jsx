import "./App.css";
import DropFileInput from "./components/drop-file-input/DropFileInput";
import UploadButton from "./components/upload-button/UploadButton";
import { useEffect, useState } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { storage } from "./firebase";
import VideosTable from "./components/data-table/VideosTable";
// import VideosList from './components/videos-list/VideosList';
// import { doc, setDoc } from "firebase/firestore"

function App() {
  const [file, setFile] = useState(null);
  const [filesList, setFilesList] = useState([]);

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

  // const uploadToDatabase = (url) => {
  //     let docData = {
  //         mostRecentUploadURL: url,
  //         username: "jasondubon"
  //     }
  //     const userRef = doc(db, "users", docData.username)
  //     setDoc(userRef, docData, {merge: true}).then(() => {
  //         console.log("successfully updated DB")
  //     }).catch((error) => {
  //         console.log("errrror")
  //     })
  // }

  useEffect(() => {
    handleFetchFiles();
  }, []);

  const handleClick = () => {
    if (file === null) return;
    const fileRef = ref(storage, `videos/${file.name}`);
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
      }
    );
  };

  return (
    <div>
        <h1>Videos Listing</h1>
        <VideosTable data={filesList} />
    </div>
    // <div className="box">
    //   <h2 className="header">Uplaod Files to Firebase</h2>
    //   <DropFileInput onFileChange={(files) => onFileChange(files)} />
    //   <br></br>
    //   <UploadButton onClick={() => handleClick()}> </UploadButton>
    //   {/* <VideosList /> */}

    //   <div className="files-list">
    //     <h3>Files in Firebase Storage:</h3>
    //     <ul>
    //       {filesList.map((file, index) => (
    //         <li key={index}>
    //           <a href={file.url} target="_blank" rel="noopener noreferrer">
    //             {file.name}
    //           </a>
    //         </li>
    //       ))}
    //     </ul>
    //   </div>
    // </div>
  );
}

export default App;
