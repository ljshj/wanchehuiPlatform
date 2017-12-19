import React from "react";
import { connect } from 'react-redux';
import { createContainer } from 'meteor/react-meteor-data';
import { Roles } from '/imports/api/roles/roles.js';
import { Shops } from '/imports/api/shops/shops.js';
import Modal from 'antd/lib/modal';
import 'antd/lib/modal/style';

import "antd/lib/table/style";
import Button from 'antd/lib/button';
import "antd/lib/button/style";
import Icon from 'antd/lib/icon';
import "antd/lib/icon/style";
import Tooltip from 'antd/lib/tooltip';
import "antd/lib/tooltip/style";
import Input from 'antd/lib/input';
import 'antd/lib/input/style';
import Row from 'antd/lib/row';
import 'antd/lib/row/style';
import Col from 'antd/lib/col';
import 'antd/lib/col/style';
import Form from 'antd/lib/form';
import Checkbox from 'antd/lib/checkbox';
import message from 'antd/lib/message';
import 'antd/lib/message/style';


import 'antd/lib/form/style';
import 'antd/lib/checkbox/style'
import Divider from 'antd/lib/divider';
import 'antd/lib/divider/style'

const FormItem = Form.Item;
class RoleModalWrap extends React.Component {
  constructor(props){
    super(props);
    
  }
  state = {
      shops:{},
      orders:{},
      users:{},
      roles:{},
      distributions:{},
  }

  
  handleModalOk = (e) => {
    let self = this
    e.preventDefault();
    const form = this.props.form;
    form.validateFieldsAndScroll((err, values) => {
    if (!err) {
        const oldFormData = form.getFieldsValue();
        //处理收到的表单的数据
        const newObj = {}
        newObj.name = oldFormData.name
        newObj.name_zh = oldFormData.name_zh
        // let permissionObj = {shops:{}, orders:{},users:{},roles:{},distributions:{}}
        newObj.permissions = {};
        let permissionsProps = ['shops', 'orders','users','roles','distributions'];
        for(var i = 0,l = permissionsProps.length; i < l; i++ ){
          newObj.permissions[permissionsProps[i]] = self.state[permissionsProps[i]] 
        }        
        // newObj.permissions.shops = self.state.shops;
        // newObj.permissions.orders = self.state.orders;
        // newObj.permissions.users = self.state.users;
        // newObj.permissions.roles = self.state.roles;
        // newObj.permissions.distributions = self.state.distributions;
        console.log(newObj)
        //先去数据库查询角色标识，如果数据库里有就返回错误，等待编码
        if(self.props.modalInsert){
          Meteor.call('role.findByTag',oldFormData.name,function(err,rlt){
            console.log(rlt)
            if(rlt == "ROLE NOT FOUND"){
              Meteor.call('role.insert',newObj,function(err,rlt){
                if(!err){
                  self.hideModal();
                  form.resetFields();
                  message.success('角色添加成功');
                  self.props.refleshTable();
                  console.log(rlt)
                  
                }
              })
            }else{
              message.error('角色名字已经存在，不允许重复添加');
            }
          })
        }else{
          console.log("执行修改操作")
          Meteor.call('role.update', self.props.singleRole,newObj,function(err,rlt){
            if(!err){
              self.hideModal();
              form.resetFields();
              message.success('角色修改成功');
              self.props.refleshTable();
              console.log(rlt)
            }
          })
        }

      }
      else{
        message.error('表格参数有误，提交失败');
      }
    });
  }
  componentDidMount(){
    
  }
  componentWillMount(){
    console.log("组件加载完成")
  }

  hideModal = () => {
    this.props.onCancel();
  };


  handleCancel = (e) => {
    let self = this
    const form = self.props.form;
    form.resetFields();
    this.props.onCancel()
  }
  shopOnChange(checkedValues) {
    let self = this
    let shops = {}
    console.log(checkedValues)
    for(let i in checkedValues){
      shops[checkedValues[i]] = true
    }
    console.log(shops)
    this.setState({
      shops:shops
    });
    console.log(shops)
  }
  orderOnChange(checkedValues) {
    let orders = {}
    for(let i in checkedValues){
      orders[checkedValues[i]] = true
    }
    this.setState({
      orders: orders,
    });
  }
  userOnChange(checkedValues) {
    let users = {}
    for(let i in checkedValues){
      users[checkedValues[i]] = true
    }
    this.setState({
      users: users,
    });
  }
  roleOnChange(checkedValues) {
    let roles = {}
    for(let i in checkedValues){
      roles[checkedValues[i]] = true
    }
    this.setState({
      roles: roles,
    });
  }
  distributionOnChange(checkedValues) {
    let distributions = {}
    for(let i in checkedValues){
      distributions[checkedValues[i]] = true
    }
    this.setState({
      distributions: distributions,
    });
  }

  isEmptyObject(obj){
    for (var key in obj) {
      return false;
      }
      return true;
  }

  objToArry(obj,str){
    console.log(obj)
    let self = this
    let arr = []
    if(!self.isEmptyObject(obj)){
      console.log(obj.permissions[str])
      for(var i in obj.permissions[str]){
        arr.push(i)
      }
      console.log(arr)
      console.log('非空对象')
      return arr
    }
  }

  getInitialvalue = (str) => {
    return this.objToArry(this.props.singleRole, str)
  };


  render(){
    
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const checkoutStyle = {
      paddingTop: 9
    };
    const CheckboxGroup = Checkbox.Group;
    const shopOptions = [
      { label: '新增', value: 'readable' },
      { label: '修改', value: 'updatable' },
      { label: '查看', value: 'showable' },
      { label: '删除', value: 'deletable',disabled: true },
    ];
    const orderOptions = [
      { label: '新增', value: 'readable' },
      { label: '修改', value: 'updatable' },
      { label: '查看', value: 'showable' },
      { label: '删除', value: 'deletable',disabled: true },
    ];
    const userOptions = [
      { label: '新增', value: 'readable' },
      { label: '修改', value: 'updatable' },
      { label: '查看', value: 'showable' },
      { label: '删除', value: 'deletable',disabled: true },
    ];    
    const roleOptions = [
      { label: '新增', value: 'readable' },
      { label: '修改', value: 'updatable' },
      { label: '查看', value: 'showable' },
      { label: '删除', value: 'deletable',disabled: true },
    ];
    
    const distributionOptions = [
      { label: '新增', value: 'readable' },
      { label: '修改', value: 'updatable' },
      { label: '查看', value: 'showable' },
      { label: '删除', value: 'deletable',disabled: true },
    ];



    return (
      <div>
        <Modal
          title={this.props.modalTitle}
          visible={this.props.modalVisible}
          onOk={this.handleModalOk}
          onCancel={this.handleCancel.bind(this)}
        >
          <div>
            <Form>
              <FormItem
                {...formItemLayout}
                label={(
                  <span>
                    角色名称&nbsp;
                    <Tooltip title="简单描述一下该角色">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                )}
              >
                {getFieldDecorator('name_zh', {
                  initialValue: this.props.singleRole.name_zh,
                  rules: [{ required: true, message: '角色名称为必填项目', whitespace: true }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={(
                  <span>
                    英文标识&nbsp;
                    <Tooltip title="英文标识必须为唯一的">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                )}
              >
                {getFieldDecorator('name', {
                  initialValue: this.props.singleRole.name,
                  rules: [{ required: true, message: '角色标识为必填项目', whitespace: true }],
                })(
                  <Input disabled={!this.props.modalInsert}/>
                )}
              </FormItem>
              <Divider>为该角色添加以下权限</Divider>
              <FormItem
                {...formItemLayout}
                label={(
                  <span>
                    店铺权限
                  </span>
                )}
              >
                {getFieldDecorator('shops', {
                   normalize: this.getInitialvalue,
                })(
                  <div style={checkoutStyle}>
                    <CheckboxGroup options={shopOptions} onChange={this.shopOnChange.bind(this)} />
                  </div>
                )}
              </FormItem>              
              <FormItem
                {...formItemLayout}
                label={(
                  <span>
                    订单权限
                  </span>
                )}
              >
                {getFieldDecorator('orders', {
                })(
                  <div style={checkoutStyle}>
                    <CheckboxGroup options={orderOptions} defaultValue={this.props.defaultOperationValue2}  onChange={this.orderOnChange.bind(this)} />
                  </div>
                  
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={(
                  <span>
                    用户权限
                  </span>
                )}
              >
                {getFieldDecorator('users', {
                  initialValue:this.props.defaultOperationValue3,
                  rules: [],
                })(
                  <div style={checkoutStyle}>
                    <CheckboxGroup options={userOptions}  defaultValue={this.props.defaultOperationValue3}  onChange={this.userOnChange.bind(this)} />
                  </div>
                  
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={(
                  <span>
                    角色权限
                  </span>
                )}
              >
                {getFieldDecorator('roles', {
                  initialValue:this.props.defaultOperationValue4,
                  rules: [],
                })(
                  <div style={checkoutStyle}>
                    <CheckboxGroup options={roleOptions}   defaultValue={this.props.defaultOperationValue4}  onChange={this.roleOnChange.bind(this)} />
                  </div>
                  
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={(
                  <span>
                    分销关系权限
                  </span>
                )}
              >
                {getFieldDecorator('distributions', {
                  initialValue:this.props.defaultOperationValue5,
                  rules: [],
                })(
                  <div style={checkoutStyle}>
                    <CheckboxGroup options={distributionOptions}   defaultValue={this.props.defaultOperationValue5} onChange={this.distributionOnChange.bind(this)} />
                  </div>
                  
                )}
              </FormItem>

            </Form>
          </div>
        </Modal>
      </div>
    )
  }

}

const RoleModal = Form.create()(RoleModalWrap);

export default RoleModal;
