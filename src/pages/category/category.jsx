import React, {Component} from 'react'
import {Card,Table,Button,Icon, message,Modal} from 'antd'

import LinkButton from '../../components/link-button'
import {reqCategories,reqUpdateCategory,reqAddCategory} from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'

export default class Category extends Component{

    state = {
        parentId:'0',
        parentName:'',
        categories: [],
        subCategories: [],
        loading: false,
        showModalStatus: 0
    }
    //initiate columns
    initColumns = () => {
        this.columns = [
            {
              title: 'Category Name',
              dataIndex: 'name',
            },
            {
              title: 'Action',
              width:300,
              dataIndex: '',
              key: 'action',
              render: (category) => (
                  <span>
                    <LinkButton onClick={()=>{this.showUpdate(category)}}>Update</LinkButton>
                    {/* transfer parameter to event callback */}
                    {this.state.parentId==='0'?
                    <LinkButton onClick={()=>this.showSubCategories(category)}>Check sub-category</LinkButton>:null
                    }
                       
                  </span>
              )
            },
        ]
    }

    //add category
    addCategory = () => {
        this.form.validateFields(async (err,values)=>{
            if(!err){
                //hide modal
                this.setState({showModalStatus:0})
                //request to add category
                const {parentId,categoryName} = values
                //clear form data
                this.form.resetFields()
                const result = await reqAddCategory(parentId,categoryName)
                if(result.status===0){
                    //added category parentId is as same as current state parentId
                    if(parentId===this.state.parentId){
                        //re-render after add
                        this.getCategories()           
                    }else if(parentId==='0'){//add first level under sub-level category page
                        this.getCategories("0")
                    }
                }
            }
        })    
    }

    //update category
    updateCategory = () => {
        this.form.validateFields(async (err,values)=>{
            if(!err){
                //hide modal
                this.setState({showModalStatus:0})
                //request to update category
                const categoryId = this.category._id
                const {categoryName} = values
                //Should clear input data otherwise it can be defaltly used because stored in memory
                this.form.resetFields()
                const result = await reqUpdateCategory(categoryId,categoryName)
                if(result.status===0){
                    //re-render after changed
                    this.getCategories() 
                }
            }
        }) 
    }

    //hide Model
    handleCancel = () => {
        //Should clear input data otherwise it can be defaltly used because stored in memory
        this.form.resetFields()
        //hide form
        this.setState({showModalStatus:0})
    }

    showAdd = () => {
        this.setState({showModalStatus:1})
    }
    showUpdate = (category) => {
        this.category = category
        this.setState({showModalStatus:2})
    }

    showSubCategories = (category) => {
        //setState is executed async
        this.setState({parentId:category._id,parentName:category.name},()=>{
            this.getCategories()
        })   
    }

    showCategories = () => {
        this.setState({
            parentId:'0',
            parentName:'',
            subCategories: []
        })
    }

    getCategories = async (parentId) => {
        this.setState({loading:true})
        parentId = parentId || this.state.parentId
        const result = await reqCategories(parentId)
        this.setState({loading:false})
        if(result.status === 0){
            const categories = result.data
            if(parentId==='0'){
               this.setState({categories}) 
            }else{
                this.setState({subCategories:categories})
            }   
        }else{
            message.error('Reqested categories unsuccessfully.')
        }
    }

    UNSAFE_componentWillMount(){                   
        this.initColumns()
    }

    //execute async functions here
    componentDidMount(){
        this.getCategories(this.parentId)
    }
    render(){
        const {categories,subCategories,parentId,parentName,loading,showModalStatus} = this.state
        const category = this.category || {}
        const title = parentId === '0'?'First Level Category List':(
            <span>
                <LinkButton onClick={this.showCategories}>First Level Category List</LinkButton>
                <Icon type='arrow-right' style={{marginRight:5}}/>
                <span>{parentName}</span>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <Icon type='plus' />
                Add New
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table 
                    bordered
                    rowKey='_id'
                    dataSource={parentId==='0'?categories:subCategories}
                    columns={this.columns} 
                    pagination={{defaultPageSize:5, showQuickJumper:true}}
                    loading={loading}/> 
                <Modal
                    title="Add new category"
                    visible={showModalStatus===1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        setForm={(form)=>this.form=form} 
                        categories={categories}
                        parentId={parentId}/>
                </Modal>
                <Modal
                    title="Update category"
                    visible={showModalStatus===2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm 
                    setForm={(form)=>this.form=form}
                    categoryName={category.name} />
                </Modal>         
            </Card>
        )
    }
}