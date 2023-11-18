'use client';

import { APP_NAME, EXAMPLE_DATASETS, GITHUB_URL } from "../constants";
import Image from 'next/image'
import Button from 'antd/es/button'
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, Divider } from "antd";


export default function About() {

    const router = useRouter()
    return (
        <div className="about-page">
            <br />
            <br />

            <p>
                <Image src="logo.png" alt="VerifiedEntity Logo" width={200} height={40} /><br /><br />
            </p>

            <Divider/>

            <p>
                {APP_NAME} is an open source project. You can find the code on GitHub here:&nbsp;
                <a href={GITHUB_URL} target="_blank">GitHub</a>&nbsp;
            </p>

            <p>
                
            </p>

            <p>
                <Button type="primary" onClick={() => {
                    router.push('/search')
                }}>
                    Search profiles
                </Button>
            </p>


        </div>
    )
}