'use client';

import { Suspense, useEffect, useState } from 'react'
import React from "react";
import Link from 'next/link';
import { useParams } from 'next/navigation';

async function getCategories(id) {
    const response = await fetch(`http://127.0.0.1:8000/api/category/${id}`,{
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Connot fecth Data.')
    }
    return response.json()
}

export default  function Page() {
    const { id } = useParams();
    const [categoryField, setCategoryField] = useState({
        name: '',
    })

    const initCategory = async () => {
        try {
            const result = await getCategories(id)
            setCategoryField(result.category)
        } catch (error) {
            console.error('Error fetching:', error);
        }      
    }
    console.log(categoryField)
    
    useEffect(() => {
        initCategory();
    }, [id])

    const changeCategoryFieldHandler = (e) => {
        setCategoryField({
            ...categoryField,
            [e.target.name]: e.target.value
        });
    }

    const  onSubmitChange = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/category/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryField)
            });

            if (!response.ok) {
                throw new Error('Failed to submit data');
            }

            await response.json();
            window.location.href = '/category';
        } catch (error) {
            console.error('Error submitting form:', error);
        }
      }

    return (
        <div className='mx-auto w-[50%]'>
            <Link href='/category' className='border font-semibold bg-stone-900 hover:bg-white hover:text-black flex justify-center rounded-md px-2 py-1 my-2'>Back</Link>
            <div className="px-8 py-4 bg-stone-900 rounded-md">
                <h1 className='text-center font-bold text-3xl'>Edit Category</h1>
                
                <form onSubmit={onSubmitChange} className="">
                    <div className="flex flex-col">
                        <label className='my-2'>Name</label>
                        <input type="text"
                            name='name'
                            value={categoryField.name}
                            className="text-black px-2 py-1 rounded-md"
                            onChange={e => changeCategoryFieldHandler(e)}
                            required/>
                    </div>
                    <button type="submit" className="flex border font-semibold rounded-md px-2 mt-4 hover:bg-white hover:text-black mx-auto">Update</button> 
                </form>
            </div>
            
        </div>
    )
}