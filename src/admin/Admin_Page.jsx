import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import 'primeicons/primeicons.css';
import { Dialog } from 'primereact/dialog';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import toast from "react-hot-toast";
import { admin, token } from "../actions";

import { ref as dbRef, get, set } from "firebase/database";
import { userDB } from "../firebase";

const Admin_Page = () => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState({
    userId: '',
    linkID: '',
    url: ''
  });

  const admin_details = useSelector((state) => state.admin);
  const [lists, setLists] = useState([{
    id: '1211',
    links: ['https://tinyurl.com/33zhf9de', 'https://tinyurl.com/4ury6ps8']
  }, {
    id: '1011',
    links: ['https://tinyurl.com/w398thcn']
  }]);


  useEffect(() => {
    const fetchAllUsersData = async () => {
      const userRef = dbRef(userDB, `UserData`);
      const snapshot = await get(userRef);
      let res = await snapshot.val();

      if (res) {
        const allUsersLinks = Object.keys(res).map(userId => {
          const userLinks = res[userId].links;

          if (userLinks) {
            return {
              userId: userId,
              links: Object.keys(userLinks).map(linkKey => ({
                name: userLinks[linkKey].name,
                url: userLinks[linkKey].url
              }))
            };
          } else {
            return {
              userId: userId,
              links: []
            };
          }
        });

        dispatch(admin({ ...admin_details, lists: allUsersLinks }));

        localStorage.setItem('admin', JSON.stringify({ ...admin_details, lists: allUsersLinks }));
        // console.log(allUsersLinks);
      } else {
        console.log("No users or links available.");
      }
    }
    fetchAllUsersData();

  }, []);

  const handleDelete = async () => {
    const { userId, linkID } = selectedDocument;

    const userLinksRef = dbRef(userDB, `UserData/${userId}/links`);
    const snapshot = await get(userLinksRef);
    let links = await snapshot.val();

    if (links) {
      const linkKeys = Object.keys(links);
  
      if (linkID >= 0 && linkID < linkKeys.length) {
        const linkKeyToDelete = linkKeys[linkID];

        delete links[linkKeyToDelete];

        await set(userLinksRef, links);

        console.log(linkKeys[linkID]);
        const updatedLists = admin_details.lists.map((user) => {
          if (user.userId === userId) {

            const updatedLinks = user.links.filter((_, index) => index !== linkID);
            
            return {
              ...user,
              links: updatedLinks
            };
          }
          return user;
        });
  
        dispatch(admin({ ...admin_details, lists: updatedLists }));
  
        localStorage.setItem('admin', JSON.stringify({ ...admin_details, lists: updatedLists }));
  
        toast.success("Document deleted successfully");
      } else {
        console.log("Invalid linkID.");
      }
    } else {
      console.log("Link not found or invalid link ID.");
    }

  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);

        dispatch(token(''));
        dispatch(admin({ id: '', name: '', email: '', lists: [] }));

        localStorage.setItem('admin', '');
        navigate('/');

      }
      else {
        toast.error(data.message || 'Failed to log out.');
      }

    } catch (error) {
      toast.error(error.message || 'Something went wrong.');
    }
  }

  console.log("Selected Document", selectedDocument);
  // console.log("Lists", lists);

  return (
    <>
      <div className="flex w-fit mt-4 ml-[88%]">
        <button className="px-5 py-2 border bg-red-500 text-slate-800 rounded-md" onClick={handleLogout}>Logout</button>
      </div>
      <div className='flex flex-col w-fit mx-auto mt-6'>
        <h1 className='text-[32px] font-bold text-center'>Welcome {admin_details.name}</h1>

        <h1 className='text-start text-[22px] mt-6 underline'>List of documents</h1>
        {admin_details.lists.length ?
          <table className="table-auto border-collapse">
            <thead>
              <tr>
                <th className="border border-black px-2">Sr. No</th>
                <th className="border border-black px-2">Name</th>
                <th className="border border-black px-2">URL</th>
                <th className="border border-black px-2">Delete</th>
              </tr>
            </thead>

            <tbody className="text-center">
              {admin_details.lists.map((user, index) => (
                <>
                  {
                    user.links.map((link, link_index) => (
                      <tr key={`admin_${user.userId + link_index}`}>
                        <td className="border border-black px-2">{link_index + 1}</td>
                        <td className="whitespace-nowrap border border-black px-2">{link.name}</td>
                        <td className="whitespace-nowrap border border-black px-2"><a rel="noopener" target="_blank" href={link.url} className="cursor-pointer"><i className="pi pi-download" /></a></td>
                        <td className="whitespace-nowrap border border-black px-2"><i className="pi pi-trash text-red-600 cursor-pointer" onClick={() => { setVisible(!visible); setSelectedDocument({ userId: user.userId, linkID: link_index, url: link.url }) }}></i></td>
                      </tr>
                    ))
                  }
                </>

              ))}
            </tbody>
          </table> :
          <div className="flex w-fit mx-auto">
            <h1 className="text-[28px] text-red-600 font-bold">No documents uploaded yet</h1>
          </div>}

        <Dialog header="" visible={visible} onHide={() => { setVisible(false); setSelectedDocument({ userId: '', linkID: '', url: '' }) }} >
          <div className='flex flex-col'>
            <h1 className='font-bold'>Are you sure you want to remove this document ?</h1>
            <div className='flex flex-row gap-x-4 mt-4 mb-2 mx-auto'>
              <button className='px-2 py-0.5 font-bold text-gray-800 rounded-md bg-emerald-300' onClick={() => { handleDelete(); setVisible(!visible); }}>Yes</button>
              <button className='px-2 py-0.5 font-bold text-gray-800 rounded-md bg-red-400' onClick={() => { toast.success("No Clicked"); setVisible(!visible); setSelectedDocument({ userId: '', linkID: '', url: '' }) }}>No</button>
            </div>
          </div>
        </Dialog>


      </div>
    </>
  )
}

export default Admin_Page