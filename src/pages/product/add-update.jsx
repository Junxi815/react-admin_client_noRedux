import React, {PureComponent} from 'react'
import {Card,Form,Input,Icon,Cascader,Button,message} from 'antd'

import LinkButton from '../../components/link-button'
import {reqCategories, reqAddOrUpdateProduct} from '../../api'
import PictureWall from './picture-wall'
import RichTextEditor from './rich-text-editor'

class ProductAddUpdate extends PureComponent {
    state = {
        options: [],
    }

    constructor(props) {
        super(props)
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    initOptions = async (categories) => {
        const options = categories.map(c=>({
            value: c._id,
            label: c.name,
            isLeaf: false
        }))
        //optionally, make first level category without arrow if they dont have subcategory
        // let options = []
        // for(let i=0; i<categories.length;i++){
        //     const subCategories = await this.getCategories(categories[i]._id)
        //     let isLeaf = true
        //     if(subCategories && subCategories.length>0){
        //         isLeaf = false
        //     }
        //     options.push({
        //         value: categories[i]._id,
        //         label: categories[i].name,
        //         isLeaf
        //     })
        // }
        const {isUpdate,product} = this
        const {pCategoryId} = product
        if(isUpdate && pCategoryId!=='0'){
            const subCategories = await this.getCategories(pCategoryId)
            const childOptions = subCategories.map(c=>({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            const targetOption = options.find(option=>option.value===pCategoryId)
            targetOption.children = childOptions
        }
        
        this.setState({
            options
        })
    }

    validatePrice = (rule,value,callback) => {
        if(value*1>0){
            callback()
        }else{
            callback('Price should be greater than zero')
        }
    }

    submit = () => {
        this.props.form.validateFields(async (err,values)=>{
            if(!err){
                //1.collect data and make them into a product object
                const {name,desc,price,categoryIds} = values
                let pCategoryId, categoryId
                if(categoryIds.length===1){
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                }else{
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }

                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()

                const product = {name,desc,price,pCategoryId,categoryId,imgs,detail}

                if(this.isUpdate){
                    product._id = this.product._id
                }
                //2.execute api to request add or update 
                const result = await reqAddOrUpdateProduct(product)
                //3.set reminder according to the req status
                if(result.status===0){
                    message.success(`${this.isUpdate?'Updated':'Added'} product successfully`)
                    this.props.history.goBack()
                }else{
                    message.error(`Failed to ${this.isUpdate?'Update':'Add'} product successfully`)
                }
            }
        })
    }

    getCategories = async (parentId) => {
        const result = await reqCategories(parentId)
        if(result.status===0){
            const categories = result.data
            if(parentId==='0'){
                this.initOptions(categories)
            }else{
                return categories
            }
            
        }
    }


    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0]
        targetOption.loading = true

        const subCategories = await this.getCategories(targetOption.value)
        targetOption.loading = false
        if(subCategories && subCategories.length>0){
            const childOptions = subCategories.map(c=>({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            targetOption.children = childOptions
        }else{
            targetOption.isLeaf=true
        }

        this.setState({
            options: [...this.state.options],
        })
    }

    UNSAFE_componentWillMount(){
        if(this.props.location.state){
            const {product} = this.props.location.state
            this.isUpdate = !!product
            this.product = product
        }else{
            this.product = {}
        }
    }

    componentDidMount(){
        this.getCategories('0')
    }
    
    render() {
        const {isUpdate,product} = this
        const {pCategoryId, categoryId, imgs, detail} = product
        const categoryIds = []
        if(isUpdate){
            if(pCategoryId==='0'){
                categoryIds.push(categoryId)
            }else{
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }

        //decide how to layout form's item
        const formItemLayout = {
            labelCol: {
                sm: { span: '200px'},
                md: { span: 7 },
                lg: { span: 6 },
                xl: { span: 4 }
              },
              wrapperCol: {
                sm: { span: 22 },
                md: { span: 16 },
              },
        }
        const title = (
            <span>
                <LinkButton onClick = {()=>this.props.history.goBack()}>
                    <Icon type='arrow-left' style={{fontSize:20}} />
                </LinkButton>
                <span>{isUpdate ? 'Update Product' : 'Add Product'}</span>
            </span>
        )

        const {getFieldDecorator} = this.props.form
        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Form.Item label="Product Name:">
                        {getFieldDecorator('name',{
                            initialValue: product.name,
                            rules: [
                                {required:true, message:'Product name is required'}
                            ]
                        })(
                            <Input placeholder="Enter product name" />
                        )}
                    </Form.Item>
                    <Form.Item label="Product Description">
                        {getFieldDecorator('desc',{
                            initialValue: product.desc,
                            rules: [
                                {required:true, message:'Product description is required'}
                            ]
                        })(
                            <Input.TextArea placeholder="Enter product description" autosize={{minRows:2,maxRows:6}}/>
                        )}
                    </Form.Item>
                    <Form.Item label='Product Price'>
                        {getFieldDecorator('price',{
                            initialValue: product.price,
                            rules: [
                                {required:true, message:'Product price is required'},
                                {validator:this.validatePrice}
                            ]
                        })(
                            <Input type='number' placeholder='Enter product price' addonAfter='dollars' />
                        )}
                    </Form.Item>
                    <Form.Item label='Product Category'>
                        {getFieldDecorator('categoryIds',{
                            initialValue: categoryIds,
                            rules: [
                                {required:true, message:'Product price is required'},
                            ]
                        })(
                            <Cascader
                                placeholder='Select product category.'
                                options={this.state.options}
                                loadData={this.loadData}
                            />                        
                        )}
                    
                    </Form.Item>
                    <Form.Item label='Product Photos'>
                        <PictureWall ref={this.pw} imgs={imgs}/>
                    </Form.Item>
                    <Form.Item label='Product Details'>
                        <RichTextEditor ref={this.editor} detail={detail} />
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' onClick={this.submit}>Submit</Button>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}
export default Form.create()(ProductAddUpdate)