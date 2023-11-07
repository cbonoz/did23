'use client'

import { useContext, useEffect, useState } from 'react'
import Search from 'antd/es/input/Search'
import { Card, Divider, List, Pagination, Spin } from 'antd'
import { formatListing, isEmpty } from '../util'
import { searchProfiles } from '../util/lens'
import { useRouter } from 'next/navigation'
import { APP_NAME } from '../constants'

const gridStyle = {
  width: '25%',
  textAlign: 'center',
};

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const filteredItems = data; // isEmpty(searchValue) ? data : filteredData;

  async function search() {
    if (isEmpty(searchValue)) {
      return
    }
    setLoading(true)
    try {
      const res = await searchProfiles(searchValue)
      console.log('results', res, res.items)
      setData(res.items)
    } catch (e) {
      // error
      console.error('searching profiles', e)
      alert(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    search()
  }, [searchValue])

  const noResults = isEmpty(filteredItems)

  return (
    <div className='container'>
      <div className='centered'>
        <h1>Search {APP_NAME} profiles</h1>
        <br />
        <Search
          className='search-input'
          style={{ width: 600 }}
          placeholder="Search by listing name or description"
          onSearch={value => setSearchValue(value)} enterButton />
      </div>
      {loading && <div>
        <Spin size='large' />
      </div>}
      {!loading && !noResults && <div className="listing-section">

        <Card title={'Select result'}>
          {filteredItems.map((item, i) => {
            return <Card.Grid className='pointer' key={i} style={gridStyle} onClick={
              () => {
                router.push(`/profile/${item.handle}`)
              }
            }>
              {item.name && <span>{item.name}<br /></span>}
              <b>{item.handle}
              </b>
            </Card.Grid>
          })}

        </Card>
      </div>}
      <Divider />
      <div className='centered'>
        {searchValue && <p className='bold'>Search results for: {searchValue}</p>}
        {!loading && noResults && <div>
          No listings found
        </div>}
        {filteredItems.length > 0 && <div>
          <p className='bold'>Found listings: {filteredItems.length}</p></div>}
        <br />
        <Pagination
          current={page}
          total={filteredItems.length}
          pageSize={pageSize}
          onChange={(page) => setPage(page)}
        />
        <br />
      </div>
    </div>

  )
}
