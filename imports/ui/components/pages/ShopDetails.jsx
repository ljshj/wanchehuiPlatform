//此组件用于测试
import React from 'react';
import { connect } from 'react-redux';
import { createContainer } from 'meteor/react-meteor-data';
import Button from 'antd/lib/button/';
import 'antd/lib/button/style';
import Icon from 'antd/lib/icon/';
import 'antd/lib/icon/style';
import Avatar from 'antd/lib/avatar';
import 'antd/lib/avatar/style';
import {getOneShopData} from '../../services/shops.js'
import Tag from 'antd/lib/tag/';
import 'antd/lib/tag/style';
import { Card, Col, Row ,List} from 'antd';
import Table from 'antd/lib/table';
const { Meta } = Card;
import { Switch} from 'antd';
import Modal from 'antd/lib/modal';
import TimePicker from 'antd/lib/time-picker';
import Tooltip from 'antd/lib/tooltip';
import "antd/lib/tooltip/style";
import Checkbox from 'antd/lib/checkbox';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Upload from 'antd/lib/upload';
import message from 'antd/lib/message';
import "antd/lib/form/style";
import "antd/lib/input/style";
import "antd/lib/checkbox/style";
import "antd/lib/tooltip/style";
import "antd/lib/time-picker/style";
import "antd/lib/select/style";
import "antd/lib/upload/style";
import 'antd/lib/modal/style';
import 'antd/lib/message/style';
import {Spin} from 'antd';
import { Roles } from '/imports/api/roles/roles.js';
import { showProduct, editProduct,addProduct,changePrice } from '/imports/ui/actions/products.js';
import ProductModal from './shops_components/ProductModal.jsx';
import ProductPriceForm from './shops_components/ProductPriceForm.jsx';
import Product from './shops_components/Product.jsx';


const FormItem = Form.Item;
const confirm = Modal.confirm;
const format = 'HH:mm';
const { TextArea } = Input;
class ShopDetails extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.params._id);
  }
  state={
    shopdetails:[],
    product:[],
    visible: false,
    editaddressVisible:false,
    editphoneVisible:false,
    editaddress:'',
    editphone:[],
    pricevisible:false,
    defaultprice:'',
    productmodalVisible: false,  // modal是否可见
    productmodalTitle: '',
    spec_length:0,
    product_id:'',
    loading:false
  }
  componentDidMount(){
    console.log('1');
    let self = this;
    let id= this.props.params._id;
    self.setState({
      loading:true
    })
    Meteor.call('shops.findShopById',id,function(err,alt){
      if(!err){
      self.setState({
        shopdetails:alt
      })
      // self.getFormdata();
    }
    })
    Meteor.call('get.product.byShopId',id,function(error,result){
      console.log(result);
      self.setState({
        product:result,
        loading:false
      })
    })
  }
  changeOnline(state,id) {
    let self =this;
        Meteor.call('product.price',id,function(err,alt){
          if (!err) {
           let intprice = alt
           if (intprice!=0) {
             Meteor.call('product.isSale',id, function(error,result){
               if(!error){
                   if (!result.isSale){
                     message.success('商品上架成功！')
                   }else{
                     message.success('商品下架成功！')
                   }
               }else{
                 console.log("商品状态改变失败！")
               }
             })
           }else {
             Meteor.call('product.isSaleFalse',id,function(err,alt){
               console.log(alt);
               self.getProducts();
             });
             message.error('请先填写价格！！')
           }
          }
        })



  }
  getProducts(){
    let self = this;
    let id= this.props.params._id;
    Meteor.call('get.product.byShopId',id,function(error,result){
      console.log(result);
      self.setState({
        product:result
      })
    })
  }

  hideModal = () => {
    this.setState({
      productmodalVisible: false,
      loading:false
    });
  };
  onAddProduct(){
    let self =this;
    self.setState({
      spec_length:0
    })
    const {dispatch } = self.props;

    self.setState({
      productmodalVisible:true,
      productmodalTitle:'增加商品',
      loading:true
    })
    dispatch(addProduct())

  }


  onShowProduct = (id) => {
    let self =this;
    self.setState({
      productmodalVisible:true,
      productmodalTitle:'查看商品'
    })
    Meteor.call('get.oneproduct.id',id,function(err,alt){
      const {dispatch } = self.props;
      if(!err){
        dispatch(showProduct(alt))
        console.log("当前不可编辑" + self.props.editState)
        console.log("当前是否为新增商品" + self.props.modalState)

      }
    })
  }
  onChangePrice = (id) =>{
    console.log(id);
    let self = this;

    Meteor.call('get.oneproduct.id',id,function(err,alt){
      const {dispatch } = self.props;
      if (!err) {
        console.log(alt);
        let price =alt.price;
        let endPrice= alt.endPrice;
        dispatch(changePrice(price,endPrice,id))
        self.setState({
          pricevisible:true
        })
      }

    })

  }
  pricehandleCancel = (e) => {
    let self = this;
    self.setState({
      pricevisible:false,
    })
    self.setFormData({});

  }
  priceinput(value){
    this.setState({
      defaultprice:value
    })
  }
  pricehandleOk= (e) =>{
    let self = this;
    let validated = true;
    this.formComponent.validateFieldsAndScroll((err, values) => validated = err ? false : validated);
    if (!validated) {
      console.log('参数错误');
      return;
    }
    const newObj = {};
    const getFieldValue = this.formComponent.getFieldValue;
    const setFieldsValue = this.formComponent.setFieldsValue;
    const oldObj = this.formComponent.getFieldsValue();
    for (const key in oldObj) {
        newObj[key] = oldObj[key];
    }
    console.log(newObj);
    let price =newObj.price*100;
    let endPrice = newObj.endPrice*100;
    let id = self.props.localproductid;
    Meteor.call('product.updatePrice',id,price,endPrice,function(err,alt){
      if (!err) {
        self.setState({
          pricevisible:false,
          defaultprice:''
        })
        self.getProducts();
        self.setFormData({});
      }
    })
  }
  setFormData(data) {
    console.log(data);
    if (this.formComponent) {
      console.log(this.formComponent);
      this.formComponent.resetFields();
      if (data) {
        this.formComponent.setFieldsValue(data);
      }
    } else {
      this.formInitData = data;
    }
  }
  onEditProduct = (id) => {
    let self =this;



    Meteor.call('get.oneproduct.id',id,function(err,alt){
      let spec_length = 0;

      if (typeof(alt.specName)!='undefined') {
        spec_length=alt.specName.length;
      }
      else {
        spec_length = 0;

      }

      self.setState({
        spec_length:spec_length
      })
      console.log(typeof(alt.parameterlist));
      let parameter_length = 0
      if(typeof(alt.parameterlist)!='undefined'){
        parameter_length = alt.parameterlist.length;
      }
      else(
        parameter_length = 0
      )
      var parameter_arr=new Array(parameter_length);
      var arr =new Array(spec_length);
      let agency_length=alt.agencyLevelPrices.length;
      var agency_arr = new Array(agency_length)
      for(var i=0;i<arr.length;i++){
          arr[i] = i;
      }
      for(var i = 0;i<agency_arr.length;i++){
        agency_arr[i]=i;
      }
      for(var i = 0;i<parameter_arr.length;i++){
        parameter_arr[i]=i;
      }
      const {dispatch } = self.props;
      if(!err){
        console.log(alt);
        dispatch(editProduct(alt,spec_length,arr,agency_arr,parameter_arr,id))
        self.setState({
          productmodalVisible:true,
          productmodalTitle:'修改商品',
          product_id:id,
          loading:true
        })
        console.log("当前不可编辑" + self.props.editState)
        console.log("当前是否为新增商品" + self.props.modalState)

      }
    })


  }
  handleSearchInput(str){
    let self= this;
    let id= this.props.params._id;
    let condition = {shopId:id,$or: [{name_zh: eval("/"+str+"/")},{name: eval("/"+str+"/")},{brief:eval("/"+str+"/")}]
    };
    console.log(condition);
    Meteor.call('get.product.byShopIdOr',condition,function(err,alt){
      if(!err){
        console.log(alt);
        self.setState({
          product:alt
        })
      }
      else{
        console.log(err);
      }
    })
  }
  changeLoading(state){
    this.setState({
      loading:state
    })
  }

  render(){
    console.log(this.state.defaultprice);
      const {singleProduct, modalState, editState,allState,length,key_arr,productId} = this.props
    const actionStyle = {
      fontSize: 16, color: '#08c'
    };
    const colors=['blue','red','green','lime'];

    const Columns=[

      {
        title: '商品名',
        dataIndex: 'name',
        key: 'name',
        width: 150,
      },{
        title: '商品中文名',
        dataIndex: 'name_zh',
        key: 'name_zh',
        width: 150,
      },{
        title: '封面',
        dataIndex: 'cover',
        key: 'cover',
        width: 50,
        render:(text, record) =>{

          return (
            <img src={record.cover} style={{height:50,width:50}}/>

          )
        }
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        width: 100,
        render:(text,record)=>{
          return(record.price/100)
        }
      },
      {
      title: '最终价格',
      dataIndex: 'endPrice',
      key: 'endPrice',
      width: 100,
      render:(text,record)=>{
        return(record.endPrice/100)
      }
      },
      {
        title: '简介',
        dataIndex: 'brief',
        key: 'brief',
        width: 150,
      },
       {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 150,
      render: (text, record) => {
        return(
          <span>

          <Tooltip placement="topLeft" title="修改" arrowPointAtCenter>
            <Button shape="circle" icon="edit"  onClick={ () => this.onEditProduct(record._id)}></Button>
          </Tooltip>

          <span className="ant-divider" />
          <Tooltip placement="topLeft" title="价格" arrowPointAtCenter>
            <Button shape="circle" icon="pay-circle"  onClick={ () => this.onChangePrice(record._id)}></Button>
          </Tooltip>
          <span className="ant-divider" />
          <Tooltip placement="topLeft" title="商品上下架" arrowPointAtCenter>
            <Switch checkedChildren="上架" unCheckedChildren="下架"  defaultChecked={record.isSale} onChange={() => this.changeOnline(record.isSale,record._id)}  />
          </Tooltip>

        </span>)
    },
    }
    ]
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          console.log(selectedRows);
        },
        getCheckboxProps: record => ({
          disabled: record.name === 'Disabled User', // Column configuration not to be checked
        }),
      };
    const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
          },
        };
      const tailFormItemLayout = {
          wrapperCol: {
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 14,
              offset: 6,
            },
          },
        };
        const headerMenuStyle ={
          display: 'flex',
          alignItems: 'center',
          justifyItems: 'center',
          justifyContent: 'space-around',
          padding: '15px',
          borderWidth: 'thin',
          background:'#ECECEC',
          marginTop:10
        };


    return (
      <div>
      <Product id={this.props.params._id} onAddProduct={this.onAddProduct.bind(this)}/>

      <div style={headerMenuStyle}>
        <Tooltip placement="topLeft" title="发布商品" arrowPointAtCenter>
          <Button shape="circle" icon="plus"  onClick={this.onAddProduct.bind(this)}  style={{fontSize: "18px", color: "red"}} ></Button>
        </Tooltip>


        <div>
          <Input.Search
                placeholder="搜索商品相关"
                style={{ width: 200 }}
                onSearch={value => console.log(value)}
                onInput={input => this.handleSearchInput(input.target.value) }
              />
        </div>
      </div>
      <ProductModal
     productmodalVisible={this.state.productmodalVisible}
     productmodalTitle={this.state.productmodalTitle}
     getproduct={this.state.spec_length}
     onCancel = { this.hideModal}
     changeLoading= {this.changeLoading.bind(this)}
     getProducts={this.getProducts.bind(this)}
     ref = {(input) => { this.fromModal = input; }}
     id={this.props.params._id}
     />

      <Spin spinning={this.state.loading}>
      <Table rowSelection={rowSelection} rowKey={record => record._id} dataSource={this.state.product} columns={Columns} />
      </Spin>
      <Modal
          title="价格"
          visible={this.state.pricevisible}
          onOk={this.pricehandleOk}
          onCancel={this.pricehandleCancel}
          okText="确认"
          cancelText="取消"
        >
        <ProductPriceForm productprice={this.props.productprice}  productendprice={this.props.productendprice}  ref = {(input) => { this.formComponent = input; }} />
        </Modal>
      <div>





      </div>

      </div>

        )
  }
}



function mapStateToProps(state) {
  return {
    allState: state.ProductsList,
    singleProduct: state.ProductsList.singleProduct,
    modalState: state.ProductsList.productmodalInsert,
    editState: !state.ProductsList.productmodalEditable,
    length:state.ProductsList.key_length,
    key_arr:state.ProductsList.key_arr,
    key_agencyarr:state.ProductsList.key_agencyarr,
    productId:state.ProductsList.productId,
    productprice:state.ProductsList.productprice,
    productendprice:state.ProductsList.productendprice,
    localproductid:state.ProductsList.localproductid,
  };
}

export default createContainer(() => {
  if (Meteor.userId()) {
    Meteor.subscribe('roles.current');
  }
  return {
    current_role: Roles.findOne({users: {$all: [Meteor.userId()]}})
  };
}, connect(mapStateToProps)(ShopDetails));
