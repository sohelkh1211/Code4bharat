import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { user } from "../actions";

import 'primeicons/primeicons.css';
import { Dialog } from 'primereact/dialog';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import toast from "react-hot-toast";
import { FileUpload } from 'primereact/fileupload';

import { v4 as uuidv4 } from 'uuid';

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ref as dbRef, update, get } from "firebase/database";
import { userDB, userStorage } from "../firebase";

const User_page = () => {
  const dispatch = useDispatch();
  const user_details = useSelector((state) => state.user);

  const [visible, setVisible] = useState(false);
  const [edit, setEdit] = useState(false);
  const [new_visible, setNew_visible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);

  const [selectedDocument, setSelectedDocument] = useState({
    id: '',
    name: '',
    url: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedDocument({
      ...selectedDocument,
      [name]: value
    });
  }

  const [links, setLinks] = useState(user_details.links);

  const handleFileSelect = async (event) => {
    // Check if file is selected
    if (!event.files || event.files.length === 0) {
      return toast.error("Please upload a document.");
    }

    const file = event.files[0];
    const reader = new FileReader();

    setSelectedDocument((prevDocument) => ({
      ...prevDocument,
      url: file,
    }));


    reader.onloadend = function () {
      const base64data = reader.result;
      toast.success("Document uploaded successfully!");
    };

    let blob = await fetch(file.objectURL).then((r) => r.blob());
    reader.readAsDataURL(blob);
  };

  const handleFileUpload = (file) => {
    if (!file) {
      return; // No file selected
    }

    // Create a storage reference for the file
    const storageRef = ref(userStorage, `documents/${user_details.id}/${selectedDocument.name}`);

    // Upload the file
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        // Progress handler (optional)
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error("File upload error: ", error);
      },
      async () => {
        // Handle successful upload
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log('File available at', downloadURL);

        // Call the function to update Realtime Database with the file link
        updateUserDocumentLinks(user_details.id, downloadURL, selectedDocument.name);
      }
    );
  };

  const updateUserDocumentLinks = (userId, fileUrl, fileName) => {
    const userRef = dbRef(userDB, `UserData/${userId}/links`);

    const newFileData = {
      name: fileName,
      url: fileUrl,
    };

    const uniqueId = uuidv4();
    // Append the new document link to the user's links
    update(userRef, {
      [uniqueId]: newFileData // Store with a timestamp as the key
    }).then(() => {
      console.log("Document link successfully added to database");
    }).catch((error) => {
      console.error("Error updating document links:", error);
    });
  };



  const handleDelete = () => {
    setLinks(links.map(link => {
      if (selectedDocument.id === link.id) {
        return {
          ...list,
          links: list.links.filter(link => link !== selectedDocument.url)
        };
      }
      return list;
    }));
  };

  const handleSubmit = async () => {
    if (!selectedDocument.name) {
      toast.error("Please Enter name");
      setSelectedDocument({
        id: '',
        name: '',
        url: ''
      });
      return;
    }
    if (!selectedDocument.url) {
      toast.error("Please Enter URL");
      setSelectedDocument({
        id: '',
        name: '',
        url: ''
      });
      return;
    }

    handleFileUpload(selectedDocument.url);
    toast.success("Document Uploaded");

    const userRef = dbRef(userDB, `UserData/${user_details.id}`);
    const snapshot = await get(userRef);
    let res = await snapshot.val();

    dispatch(user({ ...user_details, email: res.email, name: res.name, links: res.links }));

    localStorage.setItem('user', JSON.stringify({ id: data.localId, name: res.name, email: data.email, links: res?.links ? res.links : {} }));

    setSelectedDocument({
      id: '',
      name: '',
      url: ''
    });
  }

  const handleEditSubmit = () => {
    if(!selectedDocument.name) {
      toast.error("Please Enter name");
    }

    toast.success("Document updated");
    return;
  }

  console.log(selectedDocument);
  

  return (
    <div className='flex flex-col w-fit mx-auto mt-10'>
      <h1 className='text-[28px]'>Welcome {user_details.name}</h1>

      <button className="border px-4 py-2 text-[20px] bg-emerald-400 text-slate-600 font-bold w-fit mx-auto mt-8 rounded-md" onClick={() => setNew_visible(!new_visible)}>Upload New Documnet</button>
      <h1 className='text-start text-[22px] mt-6 underline'>List of documents</h1>
      {Object.keys(user_details.links).length ?
        <table className="table-auto border-collapse">
          <thead>
            <tr>
              <th className="border border-black px-2">Sr. No</th>
              <th className="border border-black px-2">Name</th>
              <th className="border border-black px-2">URL</th>
              <th className="border border-black px-2">Update</th>
              <th className="border border-black px-2">Delete</th>
            </tr>
          </thead>

          <tbody className="text-center">
            {Object.keys(user_details.links).map((key, index) => (

              <tr key={`admin_${index}`}>
                <td className="border border-black px-2">{index + 1}</td>
                <td className="border border-black px-2">{user_details.links[key].name}</td>
                <td className="whitespace-nowrap border border-black px-2"><a rel="noopener" target="_blank" href={user_details.links[key].url} className="cursor-pointer underline"><i className="pi pi-download"></i></a></td>
                <td className="whitespace-nowrap border border-black px-2"><i className="pi pi-file-edit text-emerald-600 cursor-pointer" onClick={() => { setUpdateVisible(!updateVisible); setSelectedDocument({ id: key,name: user_details.links[key].name, url: user_details.links[key].url }) }}></i></td>
                <td className="whitespace-nowrap border border-black px-2"><i className="pi pi-trash text-red-600 cursor-pointer" onClick={() => { setVisible(!visible); setSelectedDocument({ id: key, name: user_details.links[key].name, url: user_details.links[key].url }) }}></i></td>

              </tr>
            ))}
          </tbody>

        </table> :
        <div className="flex w-fit mx-auto mt-6">
          <h1 className="text-[28px] text-red-600 font-bold">No documents uploaded yet</h1>
        </div>}

      <Dialog header="" visible={visible} onHide={() => { setVisible(false); setSelectedDocument({ id: '', name: '', url: '' }) }} >
        <div className='flex flex-col'>
          <h1 className='font-bold'>Are you sure you want to remove this document ?</h1>
          <div className='flex flex-row gap-x-4 mt-4 mb-2 mx-auto'>
            <button className='px-2 py-0.5 font-bold text-gray-800 rounded-md bg-emerald-300' onClick={() => { handleDelete(); toast.success("Yes Clicked"); setVisible(!visible); }}>Yes</button>
            <button className='px-2 py-0.5 font-bold text-gray-800 rounded-md bg-red-400' onClick={() => { toast.success("No Clicked"); setVisible(!visible); setSelectedDocument({ id: '', name: '', url: '' }) }}>No</button>
          </div>
        </div>
      </Dialog>

      <Dialog header={() => (<p className='font-bold'>Upload Document</p>)} visible={updateVisible} onHide={() => { setUpdateVisible(!updateVisible); setSelectedDocument({ id: '', name: '', url: '' }); setEdit(!edit); }} >
        <div className="flex flex-col">
          <p className="w-fit mt-2 font-bold text-black">Document name</p>
          <input disabled={!edit} type="text" placeholder="Document Name *" name="name" value={selectedDocument.name || ""} onChange={handleInputChange} className="outline-none px-3 py-2 w-80 caret-slate-400 border-[1.5px] border-slate-400 focus:border-emerald-400 rounded-md" />

          <div className="flex flex-row mx-auto">
            {edit ? <button className="px-4 py-1 mt-6 w-fit mx-auto bg-emerald-400 text-slate-700 border rounded-md cursor-pointer" onClick={() => { setEdit(!edit); handleEditSubmit(); setUpdateVisible(!updateVisible); }} >Submit</button> : <button className="px-4 py-1 mt-6 w-fit mx-auto bg-emerald-400 text-slate-700 border rounded-md cursor-pointer" onClick={() => { setEdit(!edit); }} >Edit</button>}
          </div>

        </div>
      </Dialog>

      <Dialog header={() => (<p className='font-bold'>Upload Document</p>)} visible={new_visible} onHide={() => { setNew_visible(!new_visible); }} >
        <div className="flex flex-col">
          <p className="w-fit mt-2 font-bold text-black">Document name</p>
          <input type="text" placeholder="Document Name *" name="name" value={selectedDocument.name || ""} onChange={handleInputChange} className="outline-none px-3 py-2 w-80 caret-slate-400 border-[1.5px] border-slate-400 focus:border-emerald-400 rounded-md" />

          <p className="w-fit mt-2 font-bold text-black">Supported files pdf and images</p>
          <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" customUpload onSelect={handleFileSelect} />

          <button className="px-4 py-1 mt-6 w-fit mx-auto bg-emerald-400 text-slate-700 border rounded-md cursor-pointer" onClick={() => { handleSubmit(); setNew_visible(!new_visible); }} >Submit</button>

        </div>
      </Dialog>

    </div>
  )
}

export default User_page