import './App.css'
import { useQuery } from '@tanstack/react-query'
import { getGoldPrice } from './api/goldPriceApi'

function App() {

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['goldPrice'],
    queryFn: getGoldPrice,
  })

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (isError) {
    return <p>Error: {error.message}</p>
  }

  return (

    <div>
      <h1>Gold Price Tracker</h1>

      <p>
        {data?.currencySymbol}
        {data?.price}{data?.currency}
      </p>

      <p>Updated: {data?.updatedAtReadable}</p>
    </div>
  )
}

export default App
