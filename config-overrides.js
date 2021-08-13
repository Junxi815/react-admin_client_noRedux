const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
    //针对antd实现按需打包，即根据import来打包（使用babel-plugin-import）
    fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true, //打包相关的样式 true意味着style直接找less源码，而不是编译过的css
    }),
    //使用less-loader对源码中的less的变量进行重新指定
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: { '@primary-color': '#1DA57A' },
    }),
);
//还要修改package.json