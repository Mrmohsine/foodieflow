import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { addProduct } from '../../firebase/firebase-collections'; // Our utility functions

export default function Products() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { delay: 0.2, duration: 0.5 }
    }
  };

  // Handle text input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Form submit handler that calls the addProduct function with image file
  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const productId = await addProduct(formData, result.url);
      alert(`Product added with ID: ${productId}`);
      // Optionally, reset form fields
      setFormData({ name: '', description: '', price: '' });
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (error) {
      console.error('Error adding product', error);
      alert("There was an error adding the product.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg border border-orange-300 w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl font-bold text-orange-500 text-center mb-6">
          Create Product
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input 
           required
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-orange-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
          <input 
           required
            type="text"
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-orange-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
          <input 
            required
            type="number"
            name="price"
            placeholder="Product Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border border-orange-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
          <input 
            required
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="w-full border border-orange-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
          <motion.button 
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
          >
            Submit
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}