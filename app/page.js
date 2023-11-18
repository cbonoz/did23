'use client'

import React, { useState, } from 'react'
import { Button, Spin, Row, Col, Input, Divider } from 'antd';
import { APP_DESC, APP_NAME } from './constants';
import { CheckCircleTwoTone } from '@ant-design/icons';
import Image from 'next/image';
// import heroImage from './assets/city.gif'
import { useRouter } from 'next/navigation';

// TODO: change
const CHECKLIST_ITEMS = [
  "Claim a searchable business or profile landing page using your lens handle",
  "Request verified reviews stored on decentralized nodes",
  "No vendor accounts or agreements required",
];

// const HERO_IMAGE = 'https://assets-v2.lottiefiles.com/a/b2e71c48-1173-11ee-af24-e38df89b1a8a/esieSHm0ao.gif'


const Home = () => {
  const [loading, setLoading] = useState(false)
  const [handle, setHandle] = useState()
  // next router
  const router = useRouter()
  const [error, setError] = useState()

  return <div className='home-section'>
    <Row gutter={{
      xs: 8,
      sm: 16,
      md: 24,
      lg: 32,
    }}>
      <Col span={12}>
        <div className='prompt-section'>
          {APP_DESC}
        </div>
        {CHECKLIST_ITEMS.map((item, i) => {
          return (
            <p key={i}>
              <CheckCircleTwoTone twoToneColor="#00aa00" />
              &nbsp;
              {item}
            </p>
          );
        })}
        <div>
        </div>
        <div>
          <br />
          <Input
            value={handle}
            size='large'
            className='standard-padding'
            onChange={(e) => setHandle(e.target.value)}
            placeholder="Enter lens handle"
            style={{ width: 200 }}
          /><br />

          <Button disabled={!handle} className='standard-btn' type="primary" onClick={() => router.push('/profile/' + handle)}>
            Go to handle
          </Button>
          <br />
          <br />
          <p>--- or ---</p>

          <Button className='standard-btn' size="large" type="dashed" onClick={() => router.push('/search')}>
            Search profiles
          </Button>
        </div>
      </Col>
      <Col span={12}>
        <br />
        <Image
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
          className='hero-image' src={'/logo_3_2.png'}
          alt={APP_NAME}
        />
      </Col>
    </Row>

  </div>

}

export default Home