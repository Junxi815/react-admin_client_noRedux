const menuList = [ 
    { 
        title: 'Home', 
        key: '/home', 
        icon: 'home', 
        isPublic: true
    },
    { 
        title: 'Products', 
        key: '/products',
        icon: 'appstore', 
        children: [ // submenu 
            { 
                title: 'Category Admin',
                key: '/category', 
                icon: 'bars' 
            },
            { 
                title: 'Product Admin', 
                key: '/product', 
                icon: 'tool' 
            }, 
        ] 
    },
    { 
        title: 'User Admin',
        key: '/user',
        icon: 'user' 
    },
    { 
        title: 'Role Admin',
        key: '/role', 
        icon: 'safety', 
    },
    {
        title: 'Charts',
        key: '/charts',
        icon: 'area-chart',
        children: [ 
            { 
                title: 'Bar-chart',
                key: '/charts/bar',
                icon: 'bar-chart' 
            },
            { 
                title: 'Line-chart',
                key: '/charts/line',
                icon: 'line-chart' 
            },
            { 
                title: 'Pie-chart',
                key: '/charts/pie',
                icon: 'pie-chart'
            }, 
        ] 
    }, 
]

export default menuList