'use client';

import { APP_NAME, EXAMPLE_DATASETS, GITHUB_URL } from "../constants";
import Image from 'next/image'
import Button from 'antd/es/button'
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, Divider } from "antd";


export default function About() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState()

    const router = useRouter()
    return (
        <div className="about-page">
            <br />
            <br />

            <p>
                <Image src="logo.png" alt="Blockreach Logo" width={180} height={37} /><br /><br />
            </p>

            {/* github */}
            <p>
                {APP_NAME} is an open source project. You can find the code on GitHub here:&nbsp;
                <a href={GITHUB_URL} target="_blank">GitHub</a>&nbsp;
            </p>

            <p>Note this is a hackathon prototype and would require additional work to be mainnet ready. By uploading data you agree that this service is used as-is and that data may be compromised or shared outside the platform.</p>

            <p>
                {/* Create listing */}
                <Button type="primary" onClick={() => {
                    router.push('/search')
                }}>Search profiles</Button>&nbsp;


            </p>

            <Divider />


        </div>
    )
}