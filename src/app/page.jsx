'use client'

import Image from "next/image";
import { useState, useEffect } from "react";
import axios from 'axios' //npm install axios https://www.npmjs.com/package/axios
import React from "react";
import Link from "next/link";
import { TotalByType } from "@/components/totalbytype";
import Pulsing from "@/components/pulsing";
import Loading from "@/components/loading";
import Footer from "@/components/footer";
import Chart from "@/components/chart";

async function getIncomes() {
  const response = await fetch('http://127.0.0.1:8000/api/income',{
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Connot fecth Data.')
  }
  return response.json()
}

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

export default function Home() {
  const [loading, setLoading] = useState(true)

  const [income, setIncomeData] = useState([])
  const initIncome = async () => {
    try {
      const result = await getIncomes();
      setIncomeData(result.income)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching', error);
    }      
  }

  const [expense, setExpenseData] = useState([])
  const initExpense = async () => {
    try {
      const result = await getExpense();
      setExpenseData(result.expense)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching', error);
    }      
  }

  useEffect(() => {
    initIncome();
    initExpense();
  }, [])

  
  const  totalIncome = income.reduce((acc, item) => {
    return acc + parseFloat(item.amount);
  }, 0);

  const totalExpense = expense.reduce((acc, item) => {
    return acc + parseFloat(item.amount);
  }, 0);

  const balance = totalIncome - totalExpense;

  const incomeByCategory = income.reduce((acc, item) => {
    if (!acc[item.name]) {
      acc[item.name] = 0;
    }
    acc[item.name] += parseFloat(item.amount);
    return acc;
  }, {});
  
  const expenseByCategory = expense.reduce((acc, item) => {
    if (!acc[item.name]) {
      acc[item.name] = 0;
    }
    acc[item.name] += parseFloat(item.amount);
    return acc;
  }, {});

  const incomeByDate = income.reduce((acc, item) => {
    if (!acc[item.transaction_date]) {
      acc[item.transaction_date] = 0;
    }
    acc[item.transaction_date] += parseFloat(item.amount);
    return acc;
  }, {});

  const expenseByDate = expense.reduce((acc, item) => {
      if (!acc[item.transaction_date]) {
        acc[item.transaction_date] = 0;
      }
      acc[item.transaction_date] += parseFloat(item.amount);
      return acc;
    }, {});
  
  const combinedByDate = { ...incomeByDate, ...expenseByDate };

  const normalizeCombinedByDate = (combinedByDate, incomeByDate, expenseByDate) => {
    const allDates = Object.keys(combinedByDate).sort((a, b) => new Date(a) - new Date(b));
    const normalizedIncome = {};
    const normalizedExpense = {};
      allDates.forEach(date => {
        normalizedIncome[date] = incomeByDate[date] || 0;
        normalizedExpense[date] = expenseByDate[date] || 0;
    });
  
    return { allDates, normalizedIncome, normalizedExpense };
  };
  const { allDates, normalizedIncome, normalizedExpense } = normalizeCombinedByDate(combinedByDate, incomeByDate, expenseByDate);
  
  const labels = allDates;
  const incomeData = Object.values(normalizedIncome);
  const expenseData = Object.values(normalizedExpense);

  return (
    <div>

      <div className="flex justify-between items-center">
          <h1 className='font-bold text-3xl'>Home ✨</h1>

          <div className="flex flex-row gap-4">
            <Link href='/income/create' className="border-2 rounded-md bg-teal-500 hover:bg-teal-800 text-white px-2">+ Income</Link>
            <Link href='/expense/create' className="border-2 rounded-md bg-rose-500 hover:bg-rose-800 text-white px-2">+ Expense</Link>
          </div>
      </div>

      <div className="mt-2 ">
        <div className="flex justify-start items-center my-3">
          <h1 className="text-lg font-semibold">Overview</h1>
        </div>
        
        <div className="grid grid-row gap-3">
          <div className="grid grid-cols-3 gap-3">

            <div className="p-2 bg-teal-600 rounded-md min-h-16">
              <TotalByType 
                loading={loading}
                total={totalIncome}
              />
            </div>
            
            <div className="p-2 bg-rose-600 rounded-md min-h-16">
            <TotalByType 
                loading={loading}
                total={totalExpense}
              />
            </div>

            <div className="p-2 bg-zinc-600 rounded-md min-h-16">
              <TotalByType 
                loading={loading}
                total={balance}
              />
            </div>
          </div>

          {loading ? (
              <div className="grid grid-cols-2 gap-3 ">
                <Pulsing />
                <Pulsing />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 ">
                <div className="bg-stone-900 min-h-52 p-2 rounded-md">
                  <p className="">Income by category</p>
                  <div className="p-2">
                    {Object.keys(incomeByCategory).map((item, index) => (
                      <div  key={index} className="flex justify-between border-b border-stone-600">

                        <div className="flex gap-2 w-[70] items-center">
                          <p>{item}</p>
                          <p className="text-xs text-teal-400">( {Math.abs((incomeByCategory[item]/ balance)*100).toFixed(2)} % )</p>
                        </div>

                        <p className="w-[30] text-right text-teal-400">
                          {new Intl.NumberFormat('th', {
                            style: 'currency',
                            currency: 'THB',
                          }).format(Math.abs(incomeByCategory[item]))}
                        </p>

                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-stone-900 min-h-52 p-2 rounded-md">
                  <p className="">Expense by category</p>
                  <div className="p-2">
                    {Object.keys(expenseByCategory).map((item, index) => (
                      <div  key={index} className="flex justify-between border-b border-stone-600">

                        <div className="flex gap-2 w-[70] items-center">
                          <p>{item}</p>
                          <p className="text-xs text-rose-400">( {Math.abs((expenseByCategory[item]/ balance)*100).toFixed(2)} % )</p>
                        </div>

                        <p className="w-[30] text-right text-rose-400">
                          {new Intl.NumberFormat('th', {
                            style: 'currency',
                            currency: 'THB',
                          }).format(Math.abs(expenseByCategory[item]))}
                        </p>

                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
  
        </div>
      </div>

      <div className="w-full my-5">
        <h1 className="text-lg font-semibold my-3">Chart</h1>
        <div className="bg-stone-900 rounded-md p-2 h-96 flex justify-center items-center">
          {loading ? (
            <Loading />
          ) : (
              <Chart 
                labels={labels}
                label1="income" data1={incomeData}
                label2="Expense" data2={expenseData}
              />
            )} 
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
