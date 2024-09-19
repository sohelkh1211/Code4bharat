import { useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import 'primeicons/primeicons.css';
import { Dialog } from 'primereact/dialog';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import toast from "react-hot-toast";

const Admin_Page = () => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState({
    id: '',
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

  const handleDelete = () => {
    setLists(lists.map(list => {
      if (selectedDocument.id === list.id) {
        return {
          ...list,
          links: list.links.filter(link => link !== selectedDocument.url)
        };
      }
      return list;
    }));
  };

  // console.log("Selected Document",selectedDocument);

  // console.log("Lists", lists);

  return (
    <div className='flex flex-col w-fit mx-auto mt-10'>
      <h1 className='text-[32px] font-bold text-center'>Welcome {admin_details.name}</h1>

      <h1 className='text-start text-[22px] mt-6 underline'>List of documents</h1>
      {lists.length ?
        <table className="table-auto border-collapse">
          <thead>
            <tr>
              <th className="border border-black px-2">Sr. No</th>
              <th className="border border-black px-2">URL</th>
              <th className="border border-black px-2">Delete</th>
            </tr>
          </thead>

          <tbody className="text-center">
            {lists.map((doc, index) => (
              <>
                {
                  doc.links.map((link, link_index) => (
                    <tr key={`admin_${doc.id + link_index}`}>
                      <td className="border border-black px-2">{index + 1}</td>
                      <td className="whitespace-nowrap border border-black px-2"><a rel="noopener" target="_blank" href={link} className="cursor-pointer underline">{link}</a></td>
                      <td className="whitespace-nowrap border border-black px-2"><i className="pi pi-trash text-red-600 cursor-pointer" onClick={() => { setVisible(!visible); setSelectedDocument({ id: doc.id, url: link }) }}></i></td>

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

      <Dialog header="" visible={visible} onHide={() => { setVisible(false); setSelectedDocument({ id: '', url: '' }) }} >
        <div className='flex flex-col'>
          <h1 className='font-bold'>Are you sure you want to remove this document ?</h1>
          <div className='flex flex-row gap-x-4 mt-4 mb-2 mx-auto'>
            <button className='px-2 py-0.5 font-bold text-gray-800 rounded-md bg-emerald-300' onClick={() => { handleDelete(); toast.success("Yes Clicked"); setVisible(!visible); }}>Yes</button>
            <button className='px-2 py-0.5 font-bold text-gray-800 rounded-md bg-red-400' onClick={() => { toast.success("No Clicked"); setVisible(!visible); setSelectedDocument({ id: '', url: '' }) }}>No</button>
          </div>
        </div>
      </Dialog>


    </div>
  )
}

export default Admin_Page