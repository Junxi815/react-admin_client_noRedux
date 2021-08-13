import React, {PureComponent} from 'react'
import {Form,Input,Select} from 'antd'
import PropTypes from 'prop-types'

const { Item } = Form
const { Option } = Select

class UserForm extends PureComponent {

    static propTypes = {
        setForm: PropTypes.func.isRequired,
        roles: PropTypes.array.isRequired,
        user: PropTypes.object,
    }

    UNSAFE_componentWillMount(){
        this.props.setForm(this.props.form)
    }

    render() {
        const {getFieldDecorator} = this.props.form
        const {roles} = this.props
        const user = this.props.user
        const formItemLayout = {
            labelCol: { span: 5},
            wrapperCol: { span: 17}
        }
        return (
            <Form {...formItemLayout}>
                <Item label='User Name:'>
                    {
                        getFieldDecorator('username',{
                            rules: [
                                { required: true, whitespace: true, message: 'Please input your username!' },
                                { min: 4, message: 'At least 4 characters!' },
                                { max: 12, message: 'Maximum 12 characters!' },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: 'Only can contain character number or underline!' },

                            ],
                            initialValue: user.username,
                        })(
                            <Input placeholder="Enter user name"></Input> 
                        )
                    }
                </Item>
                {
                    user._id?null:(
                        <Item label='Password:'>
                            {
                                getFieldDecorator('password',{
                                    rules: [
                                        { required: true, whitespace: true, message: 'Please input your password!' },
                                        { min: 6, message: 'At least 6 characters!' },
                                        { max: 12, message: 'Maximum 12 characters!' }, 
                                    ],
                                    initialValue: user.password,
                                })(
                                    <Input type='password' placeholder="Enter user password"></Input> 
                                )
                            }
                        </Item>
                    )
                }
                
                <Item label='Phone Number:'>
                    {
                        getFieldDecorator('phone',{
                            rules: [
                                { max: 11, message: 'Maximum 11 numbers!' },
                                { pattern: /^[0-9]+$/, message: 'Only can contain number!' },

                            ],
                           initialValue: user.phone,
                        })(
                            <Input placeholder="Enter phone number"></Input> 
                        )
                    }
                </Item>
                <Item label='Email Address:'>
                    {
                        getFieldDecorator('email',{
                            rules: [
                                { pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, message: 'Email pattern is incorrect!' },
                            ],
                            initialValue: user.email,
                        })(
                            <Input placeholder="Enter email address"></Input> 
                        )
                    }
                </Item>
                <Item label='Role:'>
                    {
                        getFieldDecorator('role_id',{
                            initialValue: user.role_id,
                        })(
                            <Select placeholder="Select one role">
                                {
                                    roles.map(role=>(
                                        <Option key={role._id} value={role._id}>
                                            {role.name}
                                        </Option>
                                    ))
                                }
                            </Select>
                        )
                    }
                </Item>
                
            </Form>
        )
    }
}
export default Form.create()(UserForm)