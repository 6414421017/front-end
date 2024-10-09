'use client';

import { Suspense, useEffect, useState } from 'react'
import React from "react";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CgClose } from "react-icons/cg";

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

async function getExpenses(id) {
    const response = await fetch(`http://127.0.0.1:8000/api/expense/${id}`,{
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

    const { id } = useParams();
    const [expenseField, setExpenseField] = useState({
        amount: '',
        transaction_date: '',
        description: '',
        payment_method: '',
        category_id: '',
        image: '',
    })

    const initexpense = async () => {
        try {
        const result = await getExpenses(id);
        setExpenseField(result.expense)
        } catch (error) {
        console.error('Error fetching', error);
        }      
    }
    console.log("expenseField",expenseField)

    useEffect(() => {
        initexpense();
    }, [id])
    
    const changeFieldHandler = (e) => {
        setExpenseField({
            ...expenseField,
            [e.target.name]: e.target.value,
        });
    }

    const changeImageFieldHandler = (e) => {
        setExpenseField(item => ({
            ...item,
            image: e.target.files[0],
        }));
    }
    const handleDeleteImage = () => {
        setExpenseField({
          ...expenseField,
          image: null ,
        });
    };

    const  onSubmitChange = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('_method', 'PUT')

        formData.append('amount', expenseField.amount);
        formData.append('transaction_date', expenseField.transaction_date);
        formData.append('description', expenseField.description);
        formData.append('payment_method', expenseField.payment_method);
        formData.append('category_id', expenseField.category_id);
        formData.append('image', expenseField.image); 
        
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/expense/${id}`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Failed to submit data');
            }
            await response.json();
            window.location.href = '/transaction/expense';
        } catch (error) {
            console.error('Error submitting form:', error);
        }
      }

    return (
        <div className='mx-auto w-[50%] mb-8'>
            <Link href='/transaction/expense' className='border font-semibold bg-stone-900 hover:bg-white hover:text-black flex justify-center rounded-md px-2 py-1 my-2'>Back</Link>
            <div className='px-8 py-4 bg-stone-900 rounded-md'>
                <h1 className='text-center font-bold text-3xl'>Edit Expense</h1>
                <form onSubmit={onSubmitChange} className="">
                    <div className="flex flex-col">
                        <label className='my-2 '>Category</label>
                        
                        <select id="category_id"
                            name="category_id"
                            className='text-black px-2 py-1 rounded-md'
                            onChange={e => changeFieldHandler(e)}
                            required>
                            {expenseField.category_id && (
                                <option value={expenseField.category_id} selected>{expenseField.name}</option>
                            )}
                            {category.filter(item => item.id !== expenseField.category_id).map((item, index) => (
                                <option key={index} value={item.id}>{item.name}</option>                 
                            ))}
                            
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className='my-2'>Money</label>
                        <input type="number"
                            name='amount'
                            value={expenseField.amount}
                            className="text-black px-2 py-1 rounded-md"
                            onChange={e => changeFieldHandler(e)}
                            required/>
                    </div>

                    <div className="flex flex-col">
                        <label className='my-2'>Description (Optional)</label>
                        <input type="text"
                            name='description'
                            value={expenseField.description}
                            className="text-black px-2 py-1 rounded-md"
                            onChange={e => changeFieldHandler(e)}/>
                    </div>

                    <div className="flex flex-col">
                        <label className='my-2'>Date</label>
                        <input type="date"
                            name='transaction_date'
                            value={expenseField.transaction_date}
                            className="text-black px-2 py-1 rounded-md"
                            onChange={e => changeFieldHandler(e)}
                            required/>
                    </div>

                    <div className="flex flex-col">
                        <label className='my-2'>Pay method</label>
                        <select id="payment_method"
                            name="payment_method"
                            className='text-black px-2 py-1 rounded-md'
                            onChange={e => changeFieldHandler(e)}
                            required>
                                {expenseField.payment_method && (
                                    <option value={expenseField.payment_method} selected>{expenseField.payment_method}</option>
                                )}
                                {['cash', 'credit_card', 'bank_transfer'].filter(method => method !== expenseField.payment_method).map((method, index) => (
                                    <option key={index} value={method}>{method}</option>
                                ))}
                        </select>
                    </div>
                    
                    <div className="flex flex-col">
                        <label className='my-2'>Image (Optional)</label>
                        <div className='h-[10%] text-center flex flex-col justify-center '>
                            {expenseField.image ? (
                                <div className='relative'>
                                    {typeof expenseField.image === 'string' ? (
                                        <img className='w-full h-52 rounded-md object-cover'
                                            src={`http://localhost:8000/image/expense/${expenseField.image}`}
                                            alt={expenseField.image}
                                        />
                                        ) : (
                                        <img className='w-full h-52 rounded-md object-cover'
                                            src={URL.createObjectURL(expenseField.image)}
                                            alt={expenseField.image.name}
                                        />
                                    )}
                                    <button className='border-2 p-2 border-black text-black hover:bg-stone-900 hover:text-white font-bold rounded-md absolute top-4 right-4'
                                        onClick={() => handleDeleteImage()}>
                                        <CgClose />
                                    </button>
                                </div>
                                ) : (
                                <label className='text-white hover:text-black flex flex-col justify-center bg-transparent rounded-md border font-semibold cursor-pointer  w-full h-52 hover:bg-gray-100 transition duration-300 ease-in-out'>
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

                    <button type="submit" className="flex border font-semibold rounded-md px-2 mt-4 hover:bg-white hover:text-black mx-auto">Update</button> 
                </form>
            </div>
        </div>
    )
}