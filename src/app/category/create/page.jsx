'use client';

import { Suspense, useEffect, useState } from 'react'
import React from "react";
import Link from 'next/link';

export default  function Page() {
    const [categoryField, setCategoryField] = useState({
        name: '',
    })

    const changeCategoryFieldHandler = (e) => {
        setCategoryField({
            ...categoryField,
            [e.target.name]: e.target.value
        });
    }

    const  onSubmitChange = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/api/category', {
                method: 'POST',
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
                <h1 className='text-center font-bold text-3xl'>Create Category</h1>
                <form onSubmit={onSubmitChange} className="">
                    <div className="flex flex-col">
                        <label className='my-2'>Name</label>
                        <input type="text"
                            name='name'
                            className="text-black px-2 py-1 rounded-md"
                            onChange={e => changeCategoryFieldHandler(e)}
                            required/>
                    </div>
                    <button type="submit" className="flex border font-semibold rounded-md px-2 mt-4 hover:bg-white hover:text-black mx-auto">Create</button> 
                </form>
            </div>
           
        </div>
    )
}