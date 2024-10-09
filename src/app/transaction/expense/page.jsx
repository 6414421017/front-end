'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { AiOutlinePicture } from 'react-icons/ai';
import Footer from "@/components/footer";
import Loading from "@/components/loading";

  async function getExpense() {
    const response = await fetch('http://127.0.0.1:8000/api/expense',{
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Connot fecth Data.')
    }
    return response.json()
  }
  
export default function TransactionExpensePage() {
    const [loading, setLoading] = useState(true)

    const [expense, setExpenseData] = useState([])
    const initExpense = async () => {
        try {
            const result = await getExpense();
            setExpenseData(result.expense);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching', error);
        }      
    }
    
    useEffect(() => {
        initExpense();
    }, [])
  
    const groupByExpense = expense.reduce((acc, item) => {
        const date = item.transaction_date
        acc[date] =  acc[date] || { total: 0, details: [] }
        acc[date].total += parseFloat(item.amount);
        acc[date].details.push(item);
        return acc;
    }, {});

    const handleDelete = async (id) => {
        await fetch(`http://127.0.0.1:8000/api/expense/${id}`,{
            method:'DELETE',    
        });
        const newExpenseData = expense.filter((item)=>{
            return(
                item.id !== id
            )
        })
        setExpenseData(newExpenseData);
    }
    const formatPaymentMethod = (paymentMethod) => {
        switch (paymentMethod) {
          case 'cash':
            return 'Cash';
          case 'credit_card':
            return 'Credit Card';
          case 'bank_transfer':
            return 'Bank Transfer';
          default:
            return paymentMethod;
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center my-3">
                <div className="flex items-center gap-4">
                    <h1 className='font-bold text-3xl'>Transaction</h1>
                    <p className="bg-rose-800 text-white font-bold py-1 px-4 rounded">Expense</p>
                </div>
                <Link href='/transaction/income' className="border bg-teal-500 hover:bg-teal-800  text-white font-bold py-1 px-4 rounded">Income</Link>
            </div>
            { loading ? (
                 <div className="bg-stone-900 text-white text-center h-96 flex justify-center items-center rounded-md shadow-md mb-5">
                    <Loading />
                </div>
            ) : (
                <>
                    {   expense.length > 0 ? (
                        <div className="flex flex-col gap-3 mb-5">
                            {Object.keys(groupByExpense).map((item, index) => (
                            <div key={index} className="bg-stone-900 text-white p-6 rounded-md shadow-md">
                                <div className="flex justify-between w-[80%] mx-auto pb-4">
                                    <p className="text-lg font-bold">
                                    {new Intl.DateTimeFormat('en', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'numeric',
                                        year: 'numeric',
                                        }).format(new Date(item))}
                                    </p>
                                    <p className="text-lg font-bold">
                                        {new Intl.NumberFormat('th', {
                                            style: 'currency',
                                            currency: 'THB',
                                        }).format(groupByExpense[item].total)}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 mx-auto">
                                    {groupByExpense[item].details.map((detail, index) => (
                                    <div key={index} className="border-4 border-rose-800 flex flex-row gap-3 items-center p-2 bg-stone-700  rounded-md">
                                        <div>
                                            {detail.image ? (
                                                <img src={`http://localhost:8000/image/expense/${detail.image}`} alt={`${item}_${detail?.name}`} className="w-20 h-20 object-cover rounded-md" />
                                            ) : (
                                                <div className="w-20 h-20 flex justify-center items-center rounded-md bg-gray-200">
                                                    <AiOutlinePicture size={40} color="#ccc" />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-lg font-bold">{detail.name}</p>
                                                <p className="bg-stone-600 rounded-md px-1 text-gray-300">{formatPaymentMethod(detail.payment_method)}</p>
                                            </div>
                                            <div className="text-gray-400 truncate">{detail.description}</div>
                                        </div>

                                        <p className="ml-auto text-lg font-bold">
                                            {new Intl.NumberFormat('th', {
                                                style: 'currency',
                                                currency: 'THB',
                                            }).format(detail.amount)}
                                        </p>
                                        <div className="flex gap-2">
                                            <Link href={`/expense/view/${detail.id}`} className="bg-teal-700 hover:bg-teal-900 text-white font-bold py-1 px-2 rounded">View</Link>
                                            <Link href={`/expense/edit/${detail.id}`} className="bg-indigo-700 hover:bg-indigo-900 text-white font-bold py-1 px-2 rounded">Edit</Link>
                                            <button 
                                            className="bg-red-700 hover:bg-red-950 text-white font-bold py-1 px-2 rounded"
                                            onClick={()=>handleDelete(detail.id)}>
                                            Delete
                                            </button>
                                        </div>

                                    </div>
                                ))}
                                </div>
                            </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-stone-900 text-white text-center mb-5 h-96 flex justify-center items-center rounded-md shadow-md ">
                            <p className="text-xl font-semibold">No trasaction yet.</p>
                        </div>
                    )
                    }
                </>
            )

            }
            
            <Footer />
        </div>
    )
}