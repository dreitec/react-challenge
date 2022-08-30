import clsx from "clsx"
import React from "react"
import "./App.css"

// Questions:
// 1. Load data from local file (path: “https://ac.aws.citizennet.com/assets/qspreviews/qs_interview_data.json”)
// 2. Use the screenshot as an example, implement a generic function for reading any JSON file in that format, then display the top 12 brands based on audience_size. We always want to have 4 items in one row.
// 3. Add a hover state with a dark, semi-transparent overlay and display the ID of the hovered brand.

const DB_URL = "http://localhost:3000/data/db.json"

function App() {
  const [data, setData] = React.useState([])
  const [hoveredItem, setHoveredItem] = React.useState()

  // Fetch data using DB_URL
  const fetchData = React.useCallback(async () => {
    try {
      const res = await fetch(DB_URL, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      const jsonObj = await res.json()
      const data = preProcessData(jsonObj?.data)
      setData(data)
    } catch (error) {
      console.error(error)
    }
  }, [])

  //Sort the data
  const preProcessData = (data) => {
    return data.sort((a, b) => {
      return b?.source_items?.audience_size - a?.source_items?.audience_size
    })
  }

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className='App max-w-7xl m-auto'>
      <div className='p-2 mt-2 text-left'>
        <h2 className='text-3xl font-bold'>
          Choose a Conde Nast brand's audience:
        </h2>
      </div>
      <div className='flex flex-row p-2 flex-wrap items-center '>
        {data.slice(0,12).map((item) => {
          return (
            <div
              className='w-1/2 md:w-1/4 h-[200px] p-2'
              key={item.source_items.id}>
              <div
                className='w-full h-full flex items-center justify-center relative shadow-md rounded'
                onMouseOver={() => setHoveredItem(item.source_items.id)}
                onMouseLeave={() => setHoveredItem("")}>
                <div
                  className={clsx(
                    "w-full h-full items-center justify-center absolute hidden inset-0 bg-[#cccccc86] z-[9999]",
                    { show: item.source_items.id === hoveredItem }
                  )}>
                  <h3 className='text-2xl text-black font-bold'>
                    {item.source_items.id}
                  </h3>
                </div>
                <img
                  src={item?.social_media_pages?.picture}
                  alt={item.name}
                  className={clsx({
                    grayscale: item.source_items.id === hoveredItem,
                  })}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
