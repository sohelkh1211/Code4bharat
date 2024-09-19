import { useSelector, useDispatch } from "react-redux"


const Admin_Page = () => {
  const admin_details = useSelector((state) => state.admin);

  console.log(admin_details);

  const lists = [{
    id: '',
    links: ['https://tinyurl.com/33zhf9de', 'https://tinyurl.com/4ury6ps8']
  }, {
    id: '',
    links: ['https://tinyurl.com/w398thcn']
  }]
  return (
    <div className='flex flex-col w-fit mx-auto mt-10'>
      <h1 className='text-[28px] text-center'>Welcome Zainab</h1>

      <h1 className='text-start text-[22px] mt-4 underline'>List of documents</h1>
      <table className="table-auto border-collapse">
        <thead>
          <tr>
            <th className="border border-black px-2">Sr. No</th>
            <th className="border border-black px-2">URL</th>
          </tr>
        </thead>

        <tbody className="text-center">
          {lists.map((doc, index) => (
            <tr key={`admin_${doc.id}`}>
              <td className="border border-black px-2">{index + 1}</td>
              <td className="border border-black px-2">

                <table className="table-auto">
                  <tbody>
                    {doc.links.map((link, link_index) => (
                      <tr key={`link_${link_index}`} className="">
                        <td className="whitespace-nowrap">{link}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


    </div>
  )
}

export default Admin_Page
