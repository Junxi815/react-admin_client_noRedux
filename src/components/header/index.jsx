import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import { Modal, Icon } from 'antd'

import './index.less'
import {formatDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {reqWeather} from '../../api'
import menuList from '../../config/menuConfig'
import LinkButton from '../link-button'

class Header extends Component{
    state = {
        currentTime: formatDate(Date.now()),
        loading:false,
        weatherIcon: '',
        weatherDescription: '', 
    }
    getTime = () => {
        this.intervalId = setInterval(()=>{
            const currentTime = formatDate(Date.now())
            this.setState({currentTime})
        },1000)
    }

    getWeather = async () => {
        this.setState({loading:true})
        const {icon,description} = await reqWeather('Parramatta','AU')
        this.setState({loading:false})
        const weatherIcon = require('./images/'+icon+'.png')
        this.setState({
            weatherIcon,
            weatherDescription:description
        })
    }

    getTitle(){
        const path = this.props.location.pathname
        let title
        menuList.forEach(item=>{
            if(item.key===path){
                title = item.title
            }else if(item.children){
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                if(cItem){
                    title = cItem.title
                }
            }
        })
        return title
    }

    logout = () => {
        Modal.confirm({
            title: 'Are you sure to log out?',
            onOk: () => {
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
            }
        })
    }

    // normally execute async function in componentDidMount
    //which is only executed one time
    componentDidMount(){
        this.getTime()
        this.getWeather()
    }
    componentWillUnmount(){
        clearInterval(this.intervalId)
    }
    render(){
        const {currentTime,weatherIcon,weatherDescription,loading} = this.state
        const {username} = memoryUtils.user
        const title = this.getTitle()
        return (
            <div className='header'>
                <div className="header-top">
                    <span>Hello, {username}</span>
                    <LinkButton onClick={this.logout}>Log out</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        {!loading?<span><img src={weatherIcon} alt='weather' />{weatherDescription}</span>:<span className='header-bottom-right-loading'><Icon type="loading"></Icon>&nbsp;Loading Weather Condition</span>}
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)