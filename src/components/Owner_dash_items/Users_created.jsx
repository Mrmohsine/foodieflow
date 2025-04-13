import React ,{useState} from 'react'
import Users_dash from '../fetch/Users_dash';
import { useNavigate } from 'react-router';
import Form from '../form/Form';


export default function Users_created() {
  const navigate = useNavigate();
  const [isopen, setIsOpen] = useState(false);
  const handleClick = () => {
    // Logic to handle the click event for adding a user
    setIsOpen(!isopen);
  }
  
  return (
    <div className='pt-2 mx-auto w-[85%]'>
      {/* Header section with title and Add User button */}
      <div className="flex flex-row justify-between items-center p-4">
        <h1 className="text-3xl font-bold text-orange-500">
          Users Management
        </h1>
        <button onClick={handleClick} className="text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
          Add User
        </button>
      </div>
     {isopen ? <Form setIsOpen ={setIsOpen}/> : <></>}
      
      {/* Dashboard / Users list section */}
      <Users_dash />
    </div>
  )
}