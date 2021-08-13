import React, {Component} from 'react'
import {Card, Button, Table, Modal, message} from 'antd'

import {PAGE_SIZE} from '../../utils/constants'
import {reqRoles,reqAddRole,reqUpdateRole} from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'
import {formatDate} from '../../utils/dateUtils'
import storageUtils from '../../utils/storageUtils'

export default class Role extends Component{

    constructor(props){
        super(props)
        this.auth = React.createRef()
        this.state = {
            roles: [],
            role: {},
            isShowAdd: false,
            isShowAuth: false,
        }

    }
    
    initColumn = () => {
        this.columns = [
            {
                title: 'Role Name',
                dataIndex: 'name'
            },
            {
                title: 'Create Time',
                dataIndex: 'create_time',
                render: formatDate
            },
            {
                title: 'Authorization Time',
                dataIndex: 'auth_time',
                render: formatDate
            },
            {
                title: 'Authorization Person',
                dataIndex: 'auth_name'
            },
        ]
    }

    getRoles = async () => {
        const result = await reqRoles()
        if(result.status===0){
            const roles = result.data
            this.setState({
                roles
            })
        }
    }

    onRow = (role) => {
        return {
            onClick: e => {
                if(role._id===this.state.role._id){
                    this.setState({role:{}})
                }else{
                    this.setState({
                        role
                    })
                } 
            }
        }
    }

    //add role
    addRole = () => {
        this.form.validateFields(async (error,values)=>{
            if(!error){
                this.setState({isShowAdd: false})
                const {roleName} = values
                this.form.resetFields()
                const result = await reqAddRole(roleName)
                if(result.status===0){
                    message.success('Added role successfully.')
                    //can add the new role to the current roles, optional can request the new whole roles list from backend
                    const role = result.data
                    this.setState(state=>({
                        roles: [...state.roles,role]
                    }))
                }else{
                    message.error('Failed to add role.')
                }
            }
        })
    }

    //set role authorization
    updateRole = async () => {
        this.setState({isShowAuth:false})
        const {role} = this.state
        const menus = this.auth.current.getMenus()
        if(role.menus.sort().toString()!==menus.sort().toString()){
            role.menus = menus
            role.auth_name = memoryUtils.user.username
            role.auth_time = Date.now()
            const result = await reqUpdateRole(role)
            if(result.status===0){
                if(role._id===memoryUtils.user.role_id){ //should relogin if change self authorization
                    memoryUtils.user = {}
                    storageUtils.removeUser()
                    message.success('Curren user authorization changed, please re-login.')
                    this.props.history.replace('/login')
                }else{
                    message.success('Authorized role permission successfully.')
                    this.setState({roles:[...this.state.roles]})
                } 
            }else{
                message.error('Failed to authorize role permission')
            }  
        }else{
            message.success('You did not change the authorizaiton')
        } 
    }


    UNSAFE_componentWillMount(){
        this.initColumn()
    }

    componentDidMount(){
        this.getRoles()
    }

    render(){
        
        const {roles,role,isShowAdd,isShowAuth} = this.state

        const title = (
            <span>
                <Button type='primary' onClick={()=>this.setState({isShowAdd:true})}>Create Role</Button>&nbsp;
                <Button type='primary' disabled={!role._id}  onClick={()=>this.setState({isShowAuth:true})}>Set Role Permission</Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table 
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    rowSelection={{
                        type:'radio',
                        selectedRowKeys:[role._id],
                        onSelect:(role)=>{
                            this.setState({role})
                        }
                    }}
                    pagination={{defaultPageSize: PAGE_SIZE}}
                    onRow = {this.onRow}
                />
                <Modal
                title="Add new role"
                visible={isShowAdd}
                onOk={this.addRole}
                onCancel={()=>{
                    this.setState({isShowAdd: false})
                    this.form.resetFields()
                }}
                >
                    <AddForm
                        setForm={(form)=>this.form=form} 
                    />
                </Modal>
                <Modal
                title="Set role permission"
                visible={isShowAuth}
                onOk={this.updateRole}
                onCancel={()=>{
                    this.setState({isShowAuth: false})
                    
                }}
                >
                    <AuthForm
                        role={role} ref={this.auth}
                    />
                </Modal>
            </Card>
        )
    }
}