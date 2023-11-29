'use client';

import { useContext, useEffect, useState } from 'react';
import Search from 'antd/es/input/Search';
import { Card, Divider, List, Pagination, Spin } from 'antd';
import { formatListing, isEmpty } from '../util';
import { searchProfiles } from '../util/lens';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { APP_NAME } from '../constants';

const gridStyle = {
    width: '25%',
    textAlign: 'center',
};

export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const filteredItems = data?.slice(pageSize * (page - 1), pageSize * page); // isEmpty(searchValue) ? data : filteredData;

    async function search() {
        if (isEmpty(searchValue)) {
            return;
        }
        setLoading(true);
        try {
            const res = await searchProfiles(searchValue);
            console.log('results', res, res.items);
            setData(res.items);
        } catch (e) {
            // error
            console.error('searching profiles', e);
            alert(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        search();
    }, [searchValue]);

    const noResults = isEmpty(filteredItems);

    return (
        <div className="container">
            <div className="centered">
                <Image
                    src="logo.png"
                    alt="VerifiedEntity Logo"
                    width={220}
                    height={40}
                />
                <br />
                <br />
                <h1>Search profiles</h1>
                <br />
                <Search
                    className="search-input"
                    style={{ width: 600 }}
                    placeholder="Search by listing name or description"
                    onSearch={(value) => setSearchValue(value)}
                    enterButton
                />
            </div>
            <br />

            <div className="centered">
                {searchValue && (
                    <p className="bold">Search results for: {searchValue}</p>
                )}
                {loading && (
                    <div>
                        <br />
                        <Spin size="large" />
                    </div>
                )}
            </div>

            <br />
            {!loading && !noResults && (
                <div className="listing-section">
                    <Card title={'Select profile'}>
                        {filteredItems.map((item, i) => {
                            const imageUrl = item?.picture?.original?.url;
                            return (
                                <Card.Grid
                                    className="pointer"
                                    key={i}
                                    style={gridStyle}
                                    onClick={() => {
                                        router.push(`/profile/${item.handle}`);
                                    }}
                                >
                                    {imageUrl && (
                                        <Image
                                            src={imageUrl}
                                            alt="Profile image"
                                            width={32}
                                            height={32}
                                        />
                                    )}
                                    <br />
                                    {item.name && (
                                        <span>
                                            {item.name}
                                            <br />
                                        </span>
                                    )}
                                    <b>{item.handle}</b>
                                </Card.Grid>
                            );
                        })}
                    </Card>
                </div>
            )}
            <Divider />
            <div className="centered">
                {!loading && noResults && searchValue && (
                    <div>No listings found</div>
                )}
                {filteredItems.length > 0 && (
                    <div>
                        <p className="bold">Found listings: {data.length}</p>
                    </div>
                )}
                <br />
                <Pagination
                    current={page}
                    total={data.length}
                    pageSize={pageSize}
                    onChange={(page) => setPage(page)}
                />
                <br />
            </div>
        </div>
    );
}
