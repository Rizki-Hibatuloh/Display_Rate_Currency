import { useEffect, useState } from 'react';

const API_KEY = "a78b827a01b8419c8a4bb4d5cc3219ae";
const API_URL = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${API_KEY}`;


function App() {

  const formatApiData = (apiResult) => {
    const result = {
      curr: {
        title: "Currency",
        values:[],
      },
      purchaseRate: {
        title: "We Buy",
        values:[],
      },
      exchangeRate: {
        title: "Excange Rate",
        values:[],
      },
      sellRate: {
        title: "We Sell",
        values:[],
      },
    };

    for(const key in apiResult.rates) {
      result.curr.values.push(key);
      result.exchangeRate.values.push(apiResult.rates[key]);
      
    }
  }
  const fetchCurrencyData = async () => {
    try{
      const res = await fetch(API_URL);

      if(!res.ok) {
        const response = await res.json()
        throw response;
      }
      const result = await res.json();
      formatApiData(result);
      
    } 
    catch (error) {
      console.error("[fetchCurrencyData] : ", error);
    }
  }
 
useEffect (() => {
  fetchCurrencyData();
}, []);
  return (
    <>
      <main className='flex min-h-screen bg-orange-500 justify-center items-center'>
        <section className='flex w-2/4 justify-around text-center items-center'>
        
          <div className="w-1/2">
            <h1 className="mb-2.5 text-white">{"Currency"}</h1>
            <div>
              <p className="mb-1.5 text-white">1000</p>
            </div>
          </div>
        
        </section>
      </main>

    </>
  )
}

export default App
