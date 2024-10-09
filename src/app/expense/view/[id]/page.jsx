'use client';

import { Suspense, useEffect, useState } from 'react'
import React from "react";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CgClose } from "react-icons/cg";
import { AiOutlinePicture } from 'react-icons/ai';

async function getIncomes(id) {
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
    const { id } = useParams();
    const [expense, setExpenseData] = useState({})

    const initExpense = async () => {
        try {
        const result = await getIncomes(id);
        setExpenseData(result.expense)
        } catch (error) {
        console.error('Error fetching', error);
        }      
    }

    useEffect(() => {
        initExpense();
    }, [id])
    
    const dataIncome = [
        {title: "Category", value:expense.name},
        {title: "Description", value:expense.description},
        {title: "Money", value:expense.amount},
        {title: "Transaction Date", value:expense.transaction_date},
        {title: "Payment Method", value:expense.payment_method},
    ]
    return (
        <div className='mx-auto w-[50%] mb-28'>
            <Link href='/transaction/expense' className='border font-semibold bg-stone-900 hover:bg-white hover:text-black flex justify-center rounded-md px-2 py-1 my-2'>Back</Link>
            <div className='px-8 pt-4 pb-10 flex flex-col bg-stone-900 rounded-md'>
                { dataIncome.map((item, index) => (
                    <div key={index} className="flex flex-col">
                        <p className="text-lg font-bold my-2">{item.title}</p>
                        <div className="w-full bg-stone-700 px-2 py-1 min-h-8 rounded-md">
                            <p className="">{item.value}</p>
                        </div>
                    </div>
                ))
                }
                <div className="flex flex-col gap-3">
                    <p className="text-lg font-bold my-2">Image</p>
                    <div className="w-full rounded-md h-52 object-cover">
                        {expense.image ? (
                            <img src={`http://localhost:8000/image/expense/${expense.image}`} alt={`${expense}_${expense?.name}`}
                            className="w-full h-52 object-cover rounded-md" />
                        ) : (
                            <div className="w-full h-52 flex flex-col justify-center items-center rounded-md bg-gray-200">
                                <AiOutlinePicture size={40} color="#ccc" />
                                <p className="text-black font-semibold">No image.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
            
        </div>
    )
}