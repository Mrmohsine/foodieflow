import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { addProduct } from '../../firebase/firebase-collections'; // Our utility functions
import { small } from 'framer-motion/client';
import CloudUploadSharpIcon from '@mui/icons-material/CloudUploadSharp';
import {useFirestoreUser } from '../../User_crud/users_crud';
import{useProductsByAdmin} from '../context/productsByAdmin'
export default function Products() {
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const {count, setCount} = useProductsByAdmin(0);
  // console.log(count);

  // Handle text input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Declare the file variable from event data
    setImageFile(file);
    setFileName(file.name);
  
    const reader = new FileReader();
    reader.onload = () => {
      setFileContent(reader.result);
      
    };
  
    reader.readAsDataURL(file); // Use the declared file variable here
  };
  const {firebaseUser} = useFirestoreUser();
   var adminID = firebaseUser?.uid;
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(adminID);
    if (!imageFile) {
      alert("Please upload an image file.");
      return;
    }
    try {
      const data = new FormData();
      data.append('file', imageFile);
      data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
      const response = await fetch(url, {
        method: 'POST',
        body: data
      });
      const result = await response.json();
      if (!response.ok || !result.secure_url) {
        throw new Error("Cloudinary upload failed: " + JSON.stringify(result));
      }
      const productId = await addProduct(formData, result.url ,adminID);
      alert(`Product added with ID: ${productId}`);
      // Optionally, reset form fields
      setFormData({ name: '', description: '', price: '' });
      setImageFile(null);
      setCount(count + 1); 
      setCount
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (error) {
      console.error('Error adding product', error);
      alert("There was an error adding the product.");
    }
  };

  return (
    <div className="w-[80%] mx-auto mt-10 p-6 bg-white shadow-md rounded-lg border border-orange-300">
    <h2 className="text-2xl font-bold text-orange-500 text-center mb-6">
          Create Product
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          <input 
           required
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-orange-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
          
          <input 
            required
            type="number"
            name="price"
            placeholder="Product Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border border-orange-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
          </div>
          <textarea id="description"
          required
          type="text"
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border border-orange-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-200 min-h-[100px]">
          </textarea>
          {/* <input 
            required
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="w-full border border-orange-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
          /> */}
          <div className='flex flex-row gap-4 lg:flex-row lg:gap-0 lg:items-center justify-between w-[90%] mx-auto'>
          <div className="flex flex-col gap-1 items-start "> 
            <div className="flex items-center gap-1">
              <motion.label htmlFor="pic_upload" 
              className={`w-full h-9 bg-orange-500 side_btn_style rounded-md text-white flex justify-center items-center gap-2 cursor-pointer px-5  py-2 `} 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <CloudUploadSharpIcon fontSize={'small'}/>
                  Upload
              </motion.label>
              <input required type="file" id="pic_upload" className="hidden" name="pics" accept=".png , .jpeg , .jpg" onChange={handleFileChange} ref={fileInputRef}/>
            </div>
            {fileContent && (
              <img src={fileContent} alt="Preview" className="mt-4 w-[120px] h-auto rounded " />
            )}
          </div>
          <motion.button 
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-[10%] bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors self-start"
          >
            Submit
          </motion.button>
          </div>
          
        </form>
    </div>
  );
}