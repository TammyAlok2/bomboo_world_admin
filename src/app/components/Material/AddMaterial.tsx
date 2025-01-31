"use client"

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useDispatch } from "react-redux";
import { createMaterial } from '../../GlobalRedux/slice/ProductSlice';
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { AppDispatch } from "../../GlobalRedux/store";
import DashboardLayout from '../../dashboard/page';

interface FormData {
  name: string;
  price: string;
}

interface Errors {
  name?: string;
  price?: string;
  image?: string;
}

export default function AddMaterial() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: ''
  });

  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImage(file);
      setErrors((prev) => ({ ...prev, image: undefined }));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors: Errors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Product name must be at least 2 characters.';
    }
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number.';
    }
    if (!image) {
      newErrors.image = 'Please upload an image.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price);
      if (image) formDataToSend.append('image', image);

      try {
        const response = await dispatch(createMaterial(formDataToSend));
        if (response.payload && !response.payload.error) {
          toast.success("Product added successfully!");
          setFormData({ name: '', price: '' });
          setImage(null);
          router.push("/all-materials");
        } else {
          toast.error(response.payload?.message || "Failed to add product");
        }
      } catch (error) {
        console.error("Product addition error:", error);
        toast.error("An error occurred while adding the product");
      }
    } else {
      toast.error("Please correct the errors in the form.");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-green-700">Add Product Materials</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="name"
              placeholder="Product Material Name"
              className="p-2 border rounded w-full"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <input
              type="number"
              name="price"
              placeholder="Price"
              className="p-2 border rounded w-full"
              value={formData.price}
              onChange={handleChange}
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">Product Image</h3>
            <input
              type="file"
              onChange={handleFileChange}
              className="p-2 w-full"
              accept="image/*"
            />
            {errors.image && <p className="text-red-500 text-sm mt-2">{errors.image}</p>}
          </div>
          <button
            type="submit"
            className="bg-green-700 text-white p-2 rounded hover:bg-green-600 transition-colors"
          >
            Add Product
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
