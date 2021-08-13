import React, {Component} from 'react'
import {Form,Select,Input} from 'antd'
import PropTypes from 'prop-types'

class AddForm extends Component {

    static propTypes = {
        categories: PropTypes.array.isRequired,
        parentId: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired,
    }

    UNSAFE_componentWillMount(){
        this.props.setForm(this.props.form)
    }

    render() {
        const {categories,parentId} = this.props
        const {getFieldDecorator} = this.props.form
        return (
            <Form>

                <Form.Item>
                    {
                        getFieldDecorator('parentId',{
                            initialValue: parentId
                        })(
                            <Select>
                                <Select.Option value='0' key='0'>First Level Category</Select.Option>
                                {
                                    categories.map(c => <Select.Option value={c._id} key={c._id}>{c.name}</Select.Option>)
                                }
                            </Select> 
                        )
                    }   
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('categoryName',{
                            rules: [
                                {required:true, message: 'Category name is required.'}
                            ],
                        })(
                            <Input placeholder="Enter category name"></Input> 
                        )
                    }
                </Form.Item>
            </Form>
        )
    }
}
export default Form.create()(AddForm)