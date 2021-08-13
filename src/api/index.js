// 要求：能根据接口文档定义接口请求
// 包含应用中所有接口请求函数的模块
// 每个函数的返回值都是promise
import jsonp from 'jsonp'

import ajax from './ajax'
import { message } from 'antd'

const baseUrl = ''
//login
export const reqLogin = (username,password) => ajax( baseUrl+'/login',{username,password}, 'POST' )


//request categories
export const reqCategories = (parentId) => ajax(baseUrl+'/manage/category/list',{parentId})

//add category
export const reqAddCategory = (parentId,categoryName) => ajax(baseUrl+'/manage/category/add',{parentId,categoryName},'POST')

//update category
export const reqUpdateCategory = (categoryId,categoryName) => ajax(baseUrl+'/manage/category/update',{categoryId,categoryName},'POST')

//acquire products paging list
export const reqProducts = (pageNum, pageSize) => ajax(baseUrl+'/manage/product/list',{pageNum, pageSize})

//acquire products search paging result
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType}) => ajax(baseUrl+'/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]: searchName
})

//acquire a certain category through id
export const reqCategory = (categoryId) => ajax(baseUrl+'/manage/category/info',{categoryId})

//update product status /taken off shelf or put on shelf
export const reqUpdateStatus = (productId,status) => ajax(baseUrl+'/manage/product/updateStatus',{productId,status},'POST')

//delete img
export const reqDeleteImg = (name) => ajax(baseUrl + '/manage/img/delete',{name},'POST')

//add or update product
export const reqAddOrUpdateProduct = (product) => ajax(baseUrl+'/manage/product/' + (product._id?'update':'add'),product,'POST')

//get all roles
export const reqRoles = () => ajax(baseUrl+'/manage/role/list')

//add new role
export const reqAddRole = (roleName) => ajax(baseUrl+'/manage/role/add',{roleName},'POST')

//update role /authorizing
export const reqUpdateRole = (role) => ajax(baseUrl+'/manage/role/update',role,'POST')

//get all users
export const reqUsers = () => ajax(baseUrl+'/manage/user/list')

//delete user
export const reqDeleteUser = (userId) => ajax(baseUrl+'/manage/user/delete',{userId},'POST')

//add or update user
export const reqAddOrUpdateUser = (user) => ajax(baseUrl+'/manage/user/'+(user._id?'update':'add'),user,'POST')

// acquire weather info
export const reqWeather = (city,country) => {
    return new Promise((resolve,reject)=>{
       const url = `http://api.weatherbit.io/v2.0/current?city=${city}&country=${country}&key=4566e7bc26f54d688b3a95d562512bb1`
        jsonp(url,{},(err,data)=>{
            // console.log("jsonp()",err,data)
            if(!err){
                const {icon,description} = data.data[0].weather
                resolve({icon,description})
            }else{
                message.error('Failed to acquire weather information.')
            }
        }) 
    })
    
}
 