import React, {PureComponent} from 'react'
import {Form,Input,Tree} from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'

const { TreeNode } = Tree

export default class AuthForm extends PureComponent {

    static propTypes = {
      role: PropTypes.object.isRequired
    }

    constructor(props){
        super(props)
        const {menus} = this.props.role
        // debugger
        this.state = {
            checkedKeys: menus
        }
    }

    //for parent component role.jsx 
    getMenus = () => this.state.checkedKeys

    getTreeNodes = (menuList) => {
        return menuList.reduce((pre,item) => {
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {
                        item.children ? this.getTreeNodes(item.children):null
                    }
                </TreeNode>
            )
            return pre
        },[])
    }

    onCheck = checkedKeys => {
        this.setState({checkedKeys})
    }

    UNSAFE_componentWillMount(){
        this.treeNodes = this.getTreeNodes(menuList)
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys: menus
        })
    }

    render() {
        const {role} = this.props
        const {checkedKeys} = this.state
        const formItemLayout = {
            labelCol: { span: 5},
            wrapperCol: { span: 17}
        }
        return (
            <Form {...formItemLayout}>
                <Form.Item label='Role Name:'>
                    <Input value={role.name} disabled/>
                </Form.Item>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    <TreeNode title="Authorization Cover" key="all">
                        {this.treeNodes}
                    </TreeNode>  
                </Tree>
            </Form>
        )
    }
}