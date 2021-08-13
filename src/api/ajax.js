// 能发送异步ajax请求的函数模块
// 封装axios库
// 函数的返回值是promise对象
//优化1：统一处理请求异常?
    // 在外层包一个自己创建的Promise对象
    // 在请求出错时，不reject（error），而是显示错误提示
//优化2：异步得到的不是response，而是response.data，用resolve(response.data)
import axios from 'axios'
import { message } from 'antd'

export default function ajax(url, data={}, type='GET'){
    return new Promise((resolve,reject)=>{
        //1.执行异步ajax请求
        let promise
        if(type==='GET'){
            promise = axios.get(url,{
                params: data
            })
        }else{
            promise = axios.post(url,data)
        }
        //2.如果成功了调用resolve（value)
        promise.then(response=>{
            resolve(response.data)
        }).catch(error=>{//3.如果失败了，不调用reject（reason），而是提示异常信息
            message.error('Requested failed: ' + error.message)
        })
        
    })
    
}