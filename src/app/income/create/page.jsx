'use client';

import { Suspense, useEffect, useState } from 'react'
import React from "react";
import Link from 'next/link';

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

export default  function Page() {
    const [category, setCategoryData] = useState([])

    useEffect(() => {
        const initCategory = async () => {
            try {
                const result = await getCategories();
                setCategoryData(result.category)
            } catch (error) {
                console.error('Error fetching', error);
            }      
        }
        initCategory();
      }, [])

    const [incomeField, setIncomeField] = useState({
        amount: '',
        transaction_date: '',
        description: '',
        payment_method: '',
        category_id: '',
        image: '',
    })
    console.log(incomeField)

    useEffect(() => {
        if (category.length > 0) {
            setIncomeField({
                ...incomeField,
                category_id: category[0].id,
                payment_method: 'cash'
            })
        } 
      }, [category])

    const changeFieldHandler = (e) => {
        setIncomeField({
            ...incomeField,
            [e.target.name]: e.target.value,
        });
    }

    const changeImageFieldHandler = (e) => {
        setIncomeField(item => ({
            ...item,
            image: e.target.files[0],
        }));
    }
    const handleDeleteImage = () => {
        setIncomeField({
          ...incomeField,
          image: null
        });
    };
    
    const  onSubmitChange = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('amount', incomeField.amount);
        formData.append('transaction_date', incomeField.transaction_date);
        formData.append('description', incomeField.description);
        formData.append('payment_method', incomeField.payment_method);
        formData.append('category_id', incomeField.category_id);
        formData.append('image', incomeField.image);
        
        try {
            const response = await fetch('http://127.0.0.1:8000/api/income', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to submit data');
            }

            await response.json();
            window.location.href = '/';
        } catch (error) {
            console.error('Error submitting form:', error);
        }
      }

    return (
        <div className='mx-auto w-[50%] mb-8'>
            <Link href='/' className='border font-semibold bg-stone-900 hover:bg-white hover:text-black flex justify-center rounded-md px-2 py-1 my-1'>Back</Link>
            <div className='px-8 py-4 bg-stone-900 rounded-md'>
                <h1 className='text-center font-bold text-3xl'>Create Income</h1>
                <form onSubmit={onSubmitChange} className="">
                    <div className="flex flex-col">
                        <label className='text-lg font-bold my-2'>Category</label>
                        <select id="category_id"
                            name="category_id"
                            value={incomeField.category_id}
                            className='text-black px-2 py-1 rounded-md'
                            onChange={e => changeFieldHandler(e)}
                            required>
                            {category.map((item, index) => (
                                <option key={index} value={item.id}>{item.name}</option>                 
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className='text-lg font-bold my-2'>Money</label>
                        <input type="number"
                            name='amount'
                            className="text-black px-2 py-1 rounded-md"
                            onChange={e => changeFieldHandler(e)}
                            required/>
                    </div>

                    <div className="flex flex-col">
                        <label className='text-lg font-bold my-2'>Description (Optional)</label>
                        <input type="text"
                            name='description'
                            className="text-black px-2 py-1 rounded-md"
                            onChange={e => changeFieldHandler(e)}/>
                    </div>

                    <div className="flex flex-col">
                        <label className='text-lg font-bold my-2'>Date</label>
                        <input type="date"
                            name='transaction_date'
                            className="text-black px-2 py-1 rounded-md"
                            onChange={e => changeFieldHandler(e)}
                            required/>
                    </div>

                    <div className="flex flex-col">
                        <label className='text-lg font-bold my-2'>Pay method</label>
                        <select id="payment_method"
                            name="payment_method"
                            value={incomeField.payment_method}
                            className='text-black px-2 py-1 rounded-md'
                            onChange={e => changeFieldHandler(e)}
                            required>
                                <option value="cash">cash</option>
                                <option value="credit_card">credit card</option>
                                <option value="bank_transfer">bank transfer</option>
                        </select>
                    </div>
                    
                    <div className="flex flex-col">
                        <label className='text-lg font-bold my-2'>Image (Optional)</label>
                        <div className='h-[10%] text-center relative'>
                            {incomeField.image ? (
                            <div className='relative'>
                                <img className='w-full rounded-md h-52 object-cover'
                                    src={URL.createObjectURL(incomeField.image)} alt={incomeField.image}></img>
                                <button className='border-2 p-2 border-black text-black hover:bg-stone-900 hover:text-white font-bold rounded-md absolute top-4 right-4'
                                    onClick={() => handleDeleteImage()}>
                                    X</button>
                            </div>
                            ) : (
                            <label className='text-white hover:text-black flex flex-col justify-center bg-transparent rounded-md border font-semibold cursor-pointer h-52 w-full hover:bg-gray-100 transition duration-300 ease-in-out'>
                                <svg class="mx-auto h-12 w-12 text-gray-500 " viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clip-rule="evenodd" />
                                </svg>

                                <input type="file"
                                id="image"
                                name='image'
                                className="sr-only"
                                accept='image/*'
                                onChange={e => changeImageFieldHandler(e)} />
                                <p>Upload a file.</p>
                            </label>
                            )}
                        </div>
                        </div>

                    <button type="submit" className="flex border font-semibold rounded-md px-2 mt-4 hover:bg-white hover:text-black mx-auto">Create</button> 
                </form>
            </div>
            
        </div>
    )
}