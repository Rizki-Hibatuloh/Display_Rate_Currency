import { useEffect, useState } from 'react';

const API_KEY = "39afb466e702420cb79ea36d54084189";
const API_URL = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${API_KEY}`;


function App() {
  const [ currencies, setCurrencies ] = useState([])

  const getPercentageValue = (numStr, percentage) => {
    const num = parseFloat(numStr);

    return (num * percentage) / 100;
  };
  
  const getPurchaseRate = (exchangeRate, percentage) => {
    return parseFloat(exchangeRate) + percentage;
  };

  const getSellRate = (exchangeRate, percentage) => {
    return parseFloat(exchangeRate) - percentage;
  };

    //Data fetching
  const formatApiData = (apiResult) => {
    const allowedCurrencies = ["CAD", "EUR", "IDR", "JPY", "CHF", "GBP"]; // filter untuk memilih mata uang yang ditampilkan
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
      if(allowedCurrencies.includes(key)) {
        result.curr.values.push(key);
      result.exchangeRate.values.push(apiResult.rates[key]);

      const percentage = getPercentageValue(apiResult.rates[key],5);
      const purchaseRate = getPurchaseRate(apiResult.rates[key],percentage);
      const sellRate = getSellRate(apiResult.rates[key],percentage);

      result.purchaseRate.values.push(purchaseRate);
      result.sellRate.values.push(sellRate);
      }
    }
    setCurrencies(result);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchCurrencyData = async () => {     //fetching API
    
    // caching data 
    const cachedData = localStorage.getItem("currencyData");
    const lastFetched = localStorage.getItem("lastFetched");
    const currentTime = new Date().getTime();

    if (cachedData && lastFetched && currentTime - lastFetched < 86400000) {
      setCurrencies(JSON.parse(cachedData));
      return;
    }
    
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
  
}, [fetchCurrencyData]);
  return (
    <>
      <main className='flex min-h-screen bg-orange-500 justify-center items-center'>
        <section className='flex w-2/4 justify-around text-center items-center'>
        {
          Object.keys(currencies).map((section, sectionIndex) => {    //looping data dari object APi untuk di tampilkan
            return(
              <div className="w-1/2" key={sectionIndex}>
                <h1 className="mb-2.5 text-white">
                  {currencies[section].title}
                </h1>
                {currencies[section].values.map((currValue, currValueindex) => {
                  return(
                    <div key={`${currValue}-${currValueindex}`}>
                        <p className='mb-1.5 text-white'>{currValue}</p>
                    </div>
                  )
                })}

              </div>
            )
          })
        }
        </section>
        <p className="text-gray-300 absolute bottom-2 text-center">
          Rates are based on 1 USD.<br />
          This application uses API from https://currencyfreaks.com.
        </p>
      </main>

    </>
  )
}

export default App
