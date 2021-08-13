import React, {Component} from 'react'
import {Form,Input} from 'antd'
import PropTypes from 'prop-types'

class AddForm extends Component {

    static propTypes = {
        setForm: PropTypes.func.isRequired,
    }

    UNSAFE_componentWillMount(){
        this.props.setForm(this.props.form)
    }

    render() {
        const {getFieldDecorator} = this.props.form
        const formItemLayout = {
            labelCol: { span: 5},
            wrapperCol: { span: 17}
        }
        return (
            <Form {...formItemLayout}>
                <Form.Item label='Role Name:'>
                    {
                        getFieldDecorator('roleName',{
                            rules: [
                                {required:true, message: 'Role name is required.'}
                            ],
                        })(
                            <Input placeholder="Enter role name"></Input> 
                        )
                    }
                </Form.Item>
            </Form>
        )
    }
}
export default Form.create()(AddForm)