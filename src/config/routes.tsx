// NOD-client/src/routes.ts
import React from 'react';
import { TagsOutlined, FolderOutlined , FileTextOutlined, RadarChartOutlined, EditOutlined, PieChartOutlined } from '@ant-design/icons';
import { type RouteObject } from 'react-router-dom';
import { PlatFormTypeAdd, PlatFormTypeList } from '../pages/PlatFormType/PlatFormType'
import { PlatformGroupList, PlatformGroupAdd } from '../pages/PlatformGroup/PlatformGroup'
import { PlatformList, PlatformAdd } from '../pages/Platfrom/Platfrom'
import InformationMatch from '../pages/InformationMatch/InformationMatch'

// 定义菜单项
export const menuItems = [
    {
        key: 'sub1',
        icon: React.createElement(EditOutlined),
        label: '平台配置',
        children: [
            { key: '1', label: '平台类型管理', path: '/PlatFormType/list', element: <PlatFormTypeList />, icon: React.createElement(TagsOutlined) },
            { key: '2', label: '新增平台类型', path: '/PlatFormType/add', element: <PlatFormTypeAdd />, icon: React.createElement(TagsOutlined) },
            { key: '3', label: '平台组管理', path: '/PlatFormGroup/list', element: <PlatformGroupList />, icon: React.createElement(FolderOutlined ) },
            { key: '4', label: '新增平台组', path: '/PlatFormGroup/add', element: <PlatformGroupAdd />, icon: React.createElement(FolderOutlined ) },
            { key: '5', label: '平台管理', path: '/Platform/list', element: <PlatformList />, icon: React.createElement(FileTextOutlined) },
            { key: '6', label: '新增平台', path: '/Platform/add', element: <PlatformAdd />, icon: React.createElement(FileTextOutlined) },
            // 可以根据需要添加更多子菜单和对应的页面组件
        ],
    },
    {
        key: 'sub2',
        icon: React.createElement(PieChartOutlined),
        label: '数据分析',
        children: [
            { key: '7', label: '3++导出数据分析', path: '/DataAnalysis/3++', element: <InformationMatch />, icon: React.createElement(RadarChartOutlined ) },
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