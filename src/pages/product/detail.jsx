import React, {Component} from 'react'
import {Card, Icon, List} from 'antd'

import LinkButton from '../../components/link-button'
import {BASE_IMG_URL} from '../../utils/constants'
import {reqCategory} from '../../api'

export default class ProductDetail extends Component {
    state = {
        cName1: '', //first level category
        cName2: '',  //second level category
    }
    async componentDidMount(){
        const {pCategoryId, categoryId} = this.props.location.state.product
        if(pCategoryId === '0'){
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
            this.setState({cName1})
        }else{
            const results = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({
                cName1,
                cName2
            })

        }
    }
    render() {
        const {name,desc,price,imgs,detail} = this.props.location.state.product
        const {cName1,cName2} = this.state
        const title = (
            <span>
                <LinkButton onClick = {()=>this.props.history.goBack()}>
                    <Icon type='arrow-left' style={{marginRight:10,fontSize:20}}/>
                </LinkButton>
                Product Detail
            </span>
        )
        return (
            <Card title={title} className='product-detail'>
                <List>
                    <List.Item>
                        <span className='left'>Product name:</span>
                        <span>{name}</span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>Product description:</span>
                        <span>{desc}</span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>Product price:</span>
                        <span>{price} dollars</span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>Product category:</span>
                        <span>{cName1}{cName2 ? '-->'+cName2 : ''}</span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>Product images:</span>
                        <span>
                            {
                                imgs.map(img => (
                                    <img 
                                        key={img}
                                        src={BASE_IMG_URL+img}
                                        className='product-img'
                                        alt='img'
                                    />
                                ))
                            }
                        </span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>Product details:</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}></span>
                    </List.Item>
                </List>
            </Card>
        )
    }
}