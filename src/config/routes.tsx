// NOD-client/src/routes.ts
import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { type RouteObject } from 'react-router-dom';
import PlatformGroup from '../pages/PlatformGroup/PlatformGroup';

// 定义菜单项
export const menuItems = [
    {
        key: 'sub1',
        icon: React.createElement(UserOutlined),
        label: '平台类型管理',
        children: [
            { key: '1', label: '列表', path: '/PlatFormType/list', element: <PlatformGroup /> },
            { key: '2', label: '新增', path: '/PlatFormType/list', element: <PlatformGroup /> },
            // 可以根据需要添加更多子菜单和对应的页面组件
        ],
    },
    {
        key: 'sub2',
        icon: React.createElement(UserOutlined),
        label: '平台组',
        children: [
            { key: '1', label: '平台组列表', path: '/option1', element: <PlatformGroup /> },
            // 可以根据需要添加更多子菜单和对应的页面组件
        ],
    },
    // 可以添加更多主菜单
];

// 定义路由对象
export const routes: RouteObject[] = menuItems.flatMap((item) =>
    item.children.map((child) => ({
        path: child.path,
        element: child.element,
    }))
);