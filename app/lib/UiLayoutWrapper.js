'use client';

import { usePathname } from "next/navigation"
import Link from "next/link";
import { abbreviate, isAdminAddress } from "../util";
import { ACTIVE_CHAIN, APP_NAME, PRIMARY_COLOR } from "../constants";
import StyledComponentsRegistry from "./AntdRegistry";
import { Button, ConfigProvider, Layout, Menu } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Image from "next/image";
import DidButton from "./DidButton";

function UiLayoutWrapper({ children }) {

    const pathname = usePathname()
    const isListingPage = pathname.startsWith('/profile')
    const menuItems = []
    menuItems.push({
        key: '/search',
        label: <Link href="/search">Search</Link>,
        href: '/search',
    })

    menuItems.push({
        key: '/about',
        label: <Link href="/about">About</Link>,
        href: '/about',
    })


    const isAdmin = isAdminAddress()

    if (isAdmin) {
        menuItems.push({
            key: '/admin',
            label: <Link href="/admin">Admin</Link>,
            href: '/admin',
        })
    }

    return (
        <ConfigProvider
            theme={{
                components: {
                    Button: {
                        colorPrimary: PRIMARY_COLOR,
                        algorithm: true, // Enable algorithm
                    },
                    Input: {
                        colorPrimary: PRIMARY_COLOR,
                        algorithm: true, // Enable algorithm
                    }
                },
            }}
        >
            <StyledComponentsRegistry>
                <Layout>
                    <Header style={{ background: '#fff', display: 'flex' }}>
                        <Image src="/logo.png" alt="Blockreach Logo"
                            className='header-logo pointer'
                            height={48}
                            onClick={() => {
                                window.location.href = '/'
                            }}
                            width={160}
                        />

                        <Menu style={{ minWidth: '800px' }}
                            mode="horizontal" defaultSelectedKeys={pathname} items={menuItems} />

                        <span style={{ float: 'right', right: 20, position: 'absolute' }}>
                            <DidButton>Hello</DidButton>
                        </span>


                    </Header>
                    <Content className='container'>
                        {/* Pass children to the content area */}
                        <div className='container'>
                            {children}
                        </div>
                    </Content>

                    <Footer style={{ textAlign: 'center' }}>
                        <hr />
                        <br />
                        {APP_NAME} ©2023.

                    </Footer>
                </Layout>

            </StyledComponentsRegistry>
        </ConfigProvider>
    )
}

export default UiLayoutWrapper