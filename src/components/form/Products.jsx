import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { addProduct, updateProduct } from '../../firebase/firebase-collections';
import CloudUploadSharpIcon from '@mui/icons-material/CloudUploadSharp';
import LoadingScreen from '../pages/LoadingScreen';
import { useFirestoreUser } from '../../User_crud/users_crud';
import { useProductsByAdmin } from '../context/productsByAdmin';

export default function Products({ productToEdit, setProductToEdit, setIsOpen }) {
  const [formData, setFormData] = useState({ name: '', description: '', price: '' });
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { firebaseUser } = useFirestoreUser();
  const { count, setCount } = useProductsByAdmin(0);
  const adminID = firebaseUser?.uid;

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        description: productToEdit.description || '',
        price: productToEdit.price || ''
      });
      setExistingImageUrl(productToEdit.img);
      setFileContent(productToEdit.img);
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setFileContent(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = existingImageUrl;
      if (imageFile) {
        const data = new FormData();
        data.append('file', imageFile);
        data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
        const response = await fetch(url, { method: 'POST', body: data });
        const result = await response.json();
        if (!response.ok || !result.secure_url) throw new Error('Upload failed');
        imageUrl = result.secure_url;
      }

      if (productToEdit) {
        await updateProduct(productToEdit.id, { ...formData, img: imageUrl });
      } else {
        await addProduct(formData, imageUrl, adminID);
      }

      setCount(count + 1);
      setLoading(false);
      setIsOpen(false);
      if (productToEdit) setProductToEdit(null);
    } catch (err) {
      console.error(err);
      alert('Error saving product');
      setLoading(false);
    }

    // reset form
    setFormData({ name: '', description: '', price: '' });
    setExistingImageUrl('');
    setFileContent('');
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  return (
    <>
      {loading && <LoadingScreen />}
      <div className="w-[80%] mx-auto mt-10 p-6 bg-white shadow-md rounded-lg border border-orange-300">
        <h2 className="text-2xl font-bold text-orange-500 text-center mb-6">
          {productToEdit ? 'Update Product' : 'Create Product'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <input
              required
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
          <textarea
            required
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-orange-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-200 min-h-[100px]"
          />
          <div className='flex flex-row gap-4 lg:flex-row lg:gap-0 lg:items-center justify-between w-[90%] mx-auto'>
            <div className="flex items-center gap-4">
              <motion.label
                htmlFor="pic_upload"
                className="bg-orange-500 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CloudUploadSharpIcon fontSize="small" />
                {imageFile || existingImageUrl ? 'Change Image' : 'Upload Image'}
              </motion.label>
              <input
                id="pic_upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
              {fileContent && <img src={fileContent} alt="Preview" className="w-[120px] h-auto rounded" />}
            </div>
            <motion.button
              type="submit"
              className="bg-orange-500 text-white px-7 py-2 rounded"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {productToEdit ? 'Update' : 'Submit'}
            </motion.button>
          </div>
        </form>
      </div>
    </>
  );
}