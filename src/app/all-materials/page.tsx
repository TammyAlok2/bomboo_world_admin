'use client';

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllMaterials,deleteMaterial } from '../GlobalRedux/slice/ProductSlice';
import DashboardLayout from '../dashboard/page';
import toast from 'react-hot-toast';
const AllMaterials = () => {

    const dispatch = useDispatch();
    const {materials} = useSelector((state) => state?.product);
    console.log(materials)


    useEffect(() => {
        const res = dispatch(getAllMaterials());
        console.log(res)
        // setCategories(response);
    }, [dispatch]);

    
    const handleDelete = (id: number) => {
      dispatch(deleteMaterial(id))
        .then((result) => {
          if (result.meta.requestStatus === "fulfilled") {
            dispatch(getAllMaterials()); // Refresh the product list
            toast.success("Material deleted successfully");
          }
        })
        .catch(() => toast.error("Failed to delete product"));
    };
  


  return (
    <DashboardLayout>

    <div className="p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-green-700">All Product Materials</h2>
        <table className="min-w-full bg-white border border-gray-200 mb-4">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Images</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(materials) && materials?.map((category, index: number) => (
              <tr key={category._id || index}>
                <td className="py-2 px-4 border-b ">{index + 1}</td>
                <td className="py-2 px-4 border-b flex gap-2">
                    
                      <img
                        src={category?.image}
                        alt={category?.image?.name}
                        className="w-8 h-8 object-cover"
                      />
                  </td>
                <td className="py-2 px-4 border-b">{category?.name}</td>
                <td className="py-2 px-4 border-b">{category?.price}</td>
          
                <td className="py-2 px-4 border-b">
                  <button className="hover:text-teal-700 mr-2">Update</button>
                  <button className="text-red-500 hover:text-red-700" onClick={()=>handleDelete(category?._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}
export default AllMaterials;
