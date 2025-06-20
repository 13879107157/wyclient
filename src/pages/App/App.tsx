// NOD-client/src/pages/App/App.tsx
import React, { useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Button, Breadcrumb, Layout, Menu, theme } from 'antd';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { menuItems } from '../../config/routes';
import './App.css';

const { Header, Content, Sider } = Layout;

const App = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkToken = async () => {
            try {
                // const user: any = localStorage.getItem('user');
                // console.log(JSON.parse(user).id)
                await axiosInstance.get('/api/platform-types/1');
            } catch (error) {
                localStorage.removeItem('token');
                navigate('/auth');
            }
        };

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/auth');
        } else {
            checkToken();
        }
    }, [navigate]);

    const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
        key,
        label: `nav ${key}`,
    }));

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleMenuClick = (e: { key: string }) => {
        const targetMenuItem = menuItems.flatMap((item) => item.children).find((child) => child.key === e.key);
        if (targetMenuItem) {
            navigate(targetMenuItem.path);
        }
    };

    // 递归查找菜单项及其父级菜单项
    const findMenuItemAndParents = (path: string, menuList: MenuProps['items']): MenuProps['items'] => {// @ts-ignore
        for (const menu of menuList) {// @ts-ignore
            if (menu.path === path) {
                return [menu];
            } // @ts-ignore
            if (menu.children) { // @ts-ignore
                const result = findMenuItemAndParents(path, menu.children);// @ts-ignore
                if (result.length > 0) { // @ts-ignore
                    return [menu, ...result];
                }
            }
        }
        return [];
    };

    // 生成面包屑项
    const generateBreadcrumbItems = () => {
        const breadcrumbItems = [];

        // 首页面包屑
        breadcrumbItems.push({
            title: 'Home',
            onClick: () => navigate('/')
        });

        const pathSegments = location.pathname.split('/').filter(segment => segment);
        let currentPath = '';
        for (const segment of pathSegments) {
            currentPath += `/${segment}`;
            const menuItemPath = findMenuItemAndParents(currentPath, menuItems);
            // @ts-ignore
            for (const item of menuItemPath) {
                // @ts-ignore
                if (!breadcrumbItems.some((breadcrumb) => breadcrumb.title === item.label)) {
                    breadcrumbItems.push({ // @ts-ignore
                        title: item.label, // @ts-ignore
                        onClick: () => navigate(item.path)
                    });
                }
            }
        }

        return breadcrumbItems;
    };

    const breadcrumbItems = generateBreadcrumbItems();

    return (
        <Layout className='layout-mian'>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="demo-logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    items={items1}
                    style={{ flex: 1, minWidth: 0 }}
                />
            </Header>
            <Layout>
                <Sider width={200} style={{ background: colorBgContainer }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%', borderRight: 0 }}
                        items={menuItems}
                        onClick={handleMenuClick}
                    />
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Breadcrumb
                        items={breadcrumbItems}
                        style={{ margin: '16px 0' }}
                    />
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default App;