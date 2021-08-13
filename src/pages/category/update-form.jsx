import React, {Component} from 'react'
import {Form,Input} from 'antd'
import PropTypes from 'prop-types'

class UpdateForm extends Component {
    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }
    UNSAFE_componentWillMount(){
        this.props.setForm(this.props.form)
    }

    render() {
        const {categoryName} = this.props
        const {getFieldDecorator} = this.props.form
        
       
        return (
            <Form>
                <Form.Item>
                    {
                        getFieldDecorator('categoryName',{
                            rules: [
                                {required:true, message: 'Category name is required.'}
                            ],
                            initialValue: categoryName
                        })(
                            <Input placeholder="Enter category name"></Input> 
                        )
                    }
                </Form.Item>
            </Form>
        )
    }
}
export default Form.create()(UpdateForm)