// NOD-client/src/routes.ts
import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { type RouteObject } from 'react-router-dom';
import { PlatFormTypeAdd, PlatFormTypeList } from '../pages/PlatFormType/PlatFormType'
import { PlatformGroupList, PlatformGroupAdd } from '../pages/PlatformGroup/PlatformGroup'
import { PlatformList, PlatformAdd } from '../pages/Platfrom/Platfrom'

// 定义菜单项
export const menuItems = [
    {
        key: 'sub1',
        icon: React.createElement(UserOutlined),
        label: '平台类型管理',
        children: [
            { key: '1', label: '列表', path: '/PlatFormType/list', element: <PlatFormTypeList /> },
            { key: '2', label: '新增', path: '/PlatFormType/add', element: <PlatFormTypeAdd /> },
            // 可以根据需要添加更多子菜单和对应的页面组件
        ],
    },
    {
        key: 'sub2',
        icon: React.createElement(UserOutlined),
        label: '平台组',
        children: [
            { key: '3', label: '列表', path: '/PlatFormGroup/list', element: <PlatformGroupList /> },
            { key: '4', label: '新增', path: '/PlatFormGroup/add', element: <PlatformGroupAdd /> },
            // 可以根据需要添加更多子菜单和对应的页面组件
        ],
    },
    {
        key: 'sub3',
        icon: React.createElement(UserOutlined),
        label: '平台账户1',
        children: [
            { key: '5', label: '列表', path: '/Platform/list', element: <PlatformList /> },
            { key: '6', label: '新增', path: '/Platform/add', element: <PlatformAdd /> },
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