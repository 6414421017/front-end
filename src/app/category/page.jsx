'use client'

import { Suspense, useEffect, useState } from "react";
import React from "react";
import Link from "next/link";
import Loading from "../../components/loading";
import Footer from "@/components/footer";

async function getCategories() {
    const response = await fetch('http://127.0.0.1:8000/api/category',{
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Connot fecth Data.')
    }
    return response.json()
  }

export default function CategoryPage() {
    const [category, setCategoryData] = useState([])
    const [loading, setLoading] = useState(true)
    
    const initCategory = async () => {
        try {
            const result = await getCategories();
            setCategoryData(result.category);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching', error);
        }      
    }
    
    useEffect(() => {
        initCategory()
    }, [])
    
    const handleDelete = async (id) => {
        await fetch("http://127.0.0.1:8000/api/category/"+id ,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const newCategoryData = category.filter((item)=>{
            return(
                item.id !== id
            )
        })
        setCategoryData(newCategoryData);
    }

    return (
        <div>
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-3xl">Category</h1>
                <div className="flex flex-row gap-4 my-2">
                    <Link href='/category/create' className="border-2 rounded-md text-white hover:text-black hover:bg-white px-2 py-1">Create Category</Link>
                </div>
            </div>
            
            <div className="rounded-md bg-stone-900 mb-5 min-h-96 py-5 flex justify-center items-center">
            {   
                loading ? (
                    <div className="bg-stone-900 text-white text-center flex justify-center items-center rounded-md shadow-md mb-5">
                        <Loading />
                    </div>
                ) : (
                <table className="mx-auto p-2 w-[80%]">
                    <thead>
                    <tr className="font-bold border-b uppercase">
                        <th className="border-r">no</th>
                        <th className="text-left pl-3">category</th>
                        <th>action</th>
                    </tr>
                    </thead>
                        <tbody>
                            {category.map((item,  index) => (
                            <tr key={index} className="font-sans text-xs space-y-2">
                                <th className="border-r">{index + 1}</th>
                                <th className="text-left pl-3">{item.name}</th>
                                <td className="flex gap-2 justify-center">
                                    <Link href={`/category/edit/${item.id}`}
                                        className="bg-indigo-700 hover:bg-indigo-900 text-white font-bold px-2 rounded"
                                        >Edit</Link>
                                    <button 
                                        className="bg-red-700 hover:bg-red-950 text-white font-bold px-2 rounded"
                                        onClick={()=>handleDelete(item.id)}>
                                        Delete</button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                </table> 
                )
            }
            </div>
            <Footer />
        </div>
    )
}