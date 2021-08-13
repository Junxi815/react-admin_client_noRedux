import React, {Component} from 'react'
import {Card,Select,Input,Button,Icon,Table, message} from 'antd'

import LinkButton from '../../components/link-button'
import {reqProducts, reqSearchProducts,reqUpdateStatus} from '../../api/'
import {PAGE_SIZE} from '../../utils/constants'


export default class ProductHome extends Component {
    state = {
        products: [],
        total: 0,
        loading: false,
        searchName:'',
        searchType:'productName',
    }

    initColumns = () => {
        this.columns = [
            {
                title: 'Product Name',
                dataIndex: 'name',
            },
            {
                title: 'Product Description',
                dataIndex: 'desc',
            },
            {
                title: 'Price',
                dataIndex: 'price',
                render: (price) => '$'+price
            },
            {
                width: 100,
                title: 'Status',
                // dataIndex: 'status',
                render: (product) => {
                    const {status,_id} = product
                    return (
                        <span>
                            <Button type='primary' onClick={()=>this.updateStatus(_id,status===1?2:1)}> 
                                {status===1?'Taken off shelf':'Put on shelf'}
                            </Button>
                            <span>{status===1?'For sale':'Sold out'}</span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: 'Action',
                dataIndex: '',
                render: (product) => {
                    return (
                        <span>
                            <LinkButton onClick={()=>this.props.history.push('/product/detail',{product})}>Detail</LinkButton>
                            <LinkButton onClick={()=> this.props.history.push('/product/addupdate',{product})}>Update</LinkButton>
                        </span>
                    )
                }
            },
        ]
    }

    getProducts = async (pageNum) => {
        this.pageNum = pageNum
        this.setState({loading:true})
        const {searchName,searchType} = this.state
        let result
        if(searchName){
            result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
        }else{
            result = await reqProducts(pageNum,PAGE_SIZE)
        }
        this.setState({loading:false})
        if(result.status === 0){
            const {total,list} = result.data
            this.setState({
                total,
                products: list
            })
        }
    }

    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId,status)
        if(result.status===0){
            message.success('Product status updated successfully')
            this.getProducts(this.pageNum)
        }
    }

    UNSAFE_componentWillMount(){
        this.initColumns()
    }

    componentDidMount(){
        this.getProducts(1)
    }

    render() {
        const {products,total,loading,searchName,searchType} = this.state

        const title = (
            <span>
                <Select value={searchType} onChange={value=>this.setState({searchType:value})} style={{width:160}}>
                    <Select.Option value='productName'>Search by name</Select.Option>
                    <Select.Option value='productDesc'>Search by description</Select.Option>
                </Select>
                <Input placeholder='keyword' onChange={e=>this.setState({searchName:e.target.value})} style={{width:150,margin:"0 15px"}} value={searchName} />
                <Button type='primary' onClick = {() => this.getProducts(1)}>Search</Button>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={()=>this.props.history.push('/product/addupdate')}>
                <Icon type='plus' />
                Add Product
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    loading={loading}
                    pagination={{
                        current:this.pageNum,
                        total,
                        defaultPageSize:PAGE_SIZE,
                        showQuickJumper:true,
                        onChange: this.getProducts
                    }}
                    rowKey='_id'
                    dataSource={products}
                    columns={this.columns}
                />
            </Card>
        )
    }
}