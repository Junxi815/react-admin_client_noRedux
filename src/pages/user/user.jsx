import React, {Component} from 'react'
import {Card, Button, Table, Modal, message} from 'antd'

import {formatDate} from '../../utils/dateUtils'
import {PAGE_SIZE} from '../../utils/constants'
import LinkButton from '../../components/link-button'
import {reqUsers, reqDeleteUser,reqAddOrUpdateUser} from '../../api'
import UserForm from './user-form'

export default class User extends Component{

    state = {
        users: [],
        roles: [],
        isShow: false,

    }

    initColumns = () => {
        this.columns = [
            {
                title: 'User Name',
                dataIndex: 'username'
            },
            {
                title: 'Email Address',
                dataIndex: 'email'
            },
            {
                title: 'Phone Number',
                dataIndex: 'phone'
            },
            {
                title: 'Register Time',
                dataIndex: 'create_time',
                render: formatDate
            },
            {
                title: 'Role',
                dataIndex: 'role_id',
                // render: (role_id) => this.state.roles.find(role=>role._id===role_id).name
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: 'Action',
                render: (user) => (
                    <span>
                        <LinkButton onClick={()=>this.showUpdate(user)}>Update</LinkButton>
                        <LinkButton onClick={()=>this.deleteUser(user)}>Delete</LinkButton>
                    </span>
                )
            },
        ]
    }

    deleteUser = (user) => {
        Modal.confirm({
            title:`Do you want to delete ${user.username}?`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if(result.status===0){
                    message.success('Delete user successfully.')
                    this.getUsers()
                }
            }
        })
    }

    addOrUpdateUser = () => {
        this.form.validateFields(async (err, values)=>{
            if(!err){
                this.setState({isShow:false})
                const user = values
                this.form.resetFields()
                if(this.user){
                    user._id = this.user._id
                }
                const result = await reqAddOrUpdateUser(user)
                if(result.status===0){
                    message.success(`${this.user ? 'Updated': 'Added'} user successfully.`)
                    this.getUsers()
                }
            }
        })
        
    }

    showAdd = () => {
        this.user = {}
        this.setState({isShow:true})
    }

    showUpdate = (user) => {
        this.user = user 
        this.setState({isShow:true})
    }

    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre,role)=>{
            pre[role._id]=role.name
            return pre
        },{})
        this.roleNames = roleNames
    }

    getUsers = async () => {
        const result = await reqUsers()
        if(result.status===0){
            const {users,roles} = result.data
            this.initRoleNames(roles)
            this.setState({
                users,
                roles
            })
        }
    }

    componentWillMount(){
        this.initColumns()
    }

    componentDidMount(){
        this.getUsers()
    }

    render(){
        const {users,isShow,roles} = this.state
        const user = this.user || {}
        const title = <Button type='primary' onClick={this.showAdd}>Create User</Button>
        return (
            <Card title={title}>
                <Table 
                    bordered
                    rowKey='_id'
                    dataSource={users}
                    columns={this.columns} 
                    pagination={{defaultPageSize:PAGE_SIZE, showQuickJumper:true}}
                />
                <Modal
                    title={user._id ? 'Update User':'Add new user'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={()=>{
                        this.form.resetFields()
                        this.setState({isShow:false})
                    }}
                >
                    <UserForm 
                        setForm={(form)=>this.form=form} 
                        roles={roles}
                        user={user}

                    />
                </Modal>
                
            </Card>
        )
    }
}