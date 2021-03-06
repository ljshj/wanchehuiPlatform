import React, { Component } from 'react';
import Modal from 'antd/lib/modal';
import { Divider } from 'antd';
import Checkbox from 'antd/lib/checkbox';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Upload from 'antd/lib/upload';
import message from 'antd/lib/upload';
import { Row, Col } from 'antd';
import { Switch} from 'antd';
import "antd/lib/form/style";
import "antd/lib/icon/style";
import "antd/lib/input/style";
import "antd/lib/button/style";
import "antd/lib/checkbox/style";
import "antd/lib/tooltip/style";
import "antd/lib/time-picker/style";
import "antd/lib/select/style";
import "antd/lib/upload/style";
import 'antd/lib/modal/style';
import AMapSearcher from '../tools/AMapSearcher.jsx';
import AMapComplete from '../tools/AMapComplete.jsx';
import { Roles } from '/imports/api/roles/roles.js';
import moment from 'moment';
import { Radio } from 'antd';
import {Menu} from 'antd'
const FormItem = Form.Item;
const format = 'HH:mm';
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
import UploadToCloudinary from '../../public/UploadToCloudinary';
import UploadCoverToCloudinary from '../../public/UploadCoverToCloudinary';
import UploadDetailsToCloudinary from '../../public/UploadDetailsToCloudinary';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
const Option =Select.Option;
const SubMenu = Menu.SubMenu;
function uploadImageCallBack(file) {

  return new Promise(
    (resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/images/upload');
      xhr.send(file);

      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      });
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);

      });
    }
  );
}
function handleChangeSpec(value) {
  console.log(`selected ${value}`);
}


class ProductFormWrap extends Component {


    constructor(props){
      super(props);

      // const contentBlock = htmlToDraft(html);
      // const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      // const editorState = EditorState.createWithContent(contentState);
      // this.state = {
      //     contentState: editorState,
      //
      //   };
    }
    rootSubmenuKeys = [];
    state = {
        cover: '',
        fileList: [],
        fileListDetails:[],
        fileListMore:this.props.xx,
        image_url:this.props.product.cover,
        image_details:this.props.product.detailsImage,
        value: false,
        status:false,
        images:[],
        key_arr:[],
        key_length:0,
        agencykey_arr:[],
        parameterkey_arr:[],
        agencykey_length:0,
        parameterkey_length:0,
        initialProductClass:[],
        openKeys:this.props.descriptionKey,
        fileState:this.props.changefileState
      };

      onOpenChange = (openKeys) => {
        let self =this;
          let description= this.props.product.description
          if(typeof(description)=='undefined'){
            let description='<p>开始编辑</p>'
            const setFieldsValue = this.props.form.setFieldsValue;
            setFieldsValue({description:description})
            const html =description;
            const contentBlock = htmlToDraft(html);
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            // self.state={
            //   contentState: editorState,
            // }
            self.changel(editorState);
          }
          else {
            const html =description;
            const contentBlock = htmlToDraft(html);
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            // self.state={
            //   contentState: editorState,
            // }
            self.changel(editorState);
          }



      const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.setState({ openKeys });
      } else {
        this.setState({
          openKeys: latestOpenKey ? [latestOpenKey] : [],
        });
      }
    }
      changel(editorState){
        let self =this;

        self.setState({
          contentState:editorState
        })
      }
    remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }
  agencyremove = (k) => {
  const { form } = this.props;
  // can use data-binding to get
  const keyss = form.getFieldValue('keyss');
  // We need at least one passenger
  if (keyss.length === 1) {
    return;
  }

  // can use data-binding to set
  form.setFieldsValue({
    keyss: keyss.filter(key => key !== k),
  });
  }

  parameterremove = (k) => {
    const {form} =this.props;
    const parameterkeys = form.getFieldValue('parameterkeys');
    if (parameterkeys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      parameterkeys: parameterkeys.filter(key => key !== k),
    });
  }

  agencyadd = () => {
    const { form } = this.props;
    // can use data-binding to get

    const keyss = form.getFieldValue('keyss');
    this.setState({
      agencykey_arr:keyss
    })
    let agencyLength = keyss.length;
    this.setState({
      agencykey_length:agencyLength
    })
    const nextKeys = keyss.concat(agencyLength);
    agencyLength++;
    // console.log(uuid);
    //
    // this.update_uuid(uuid);
    // console.log(this.state.uuid);
    form.setFieldsValue({
      keyss: nextKeys,
    });
  }

  parameteradd =()=>{
    const { form } = this.props;
    // can use data-binding to get

    const parameterkeys = form.getFieldValue('parameterkeys');
    this.setState({
      parameterkey_arr:parameterkeys
    })
    let parameterLength = parameterkeys.length;
    this.setState({
      parameterkey_length:parameterLength
    })
    const nextKeys = parameterkeys.concat(parameterLength);
    parameterLength++;
    // console.log(uuid);
    //
    // this.update_uuid(uuid);
    // console.log(this.state.uuid);
    form.setFieldsValue({
      parameterkeys: nextKeys,
    });
  }


  add = () => {
    const { form } = this.props;
    // can use data-binding to get

    const keys = form.getFieldValue('keys');
    this.setState({
      key_arr:keys
    })
    let uuid = keys.length;
    this.setState({
      key_length:uuid
    })
    const nextKeys = keys.concat(uuid);
    uuid++;
    // console.log(uuid);
    //
    // this.update_uuid(uuid);
    // console.log(this.state.uuid);
    form.setFieldsValue({
      keys: nextKeys,
    });
  }
  update_uuid(uuid){
    this.setState({
      uuid:uuid
    })
  }
    //
    // componentWillReceiveProps(nextProps){
    //     this.setState(nextProps);
    //
    // }

    changeisTool = (e) => {
    this.setState({
      value: e.target.value,
    });

  }
  componentDidMount(){
    let images=this.props.product.images;
    let fileListImages=[];
    if(images!=null){
      for(var i=0;i<images.length;i++){
        var url=images[i];
        var first={uid:i};
        var end={url:url}
        var obj =Object.assign(first,end);
        fileListImages.push(obj)
      }
      this.setState({
        images:this.props.product.images,
        fileListMore:fileListImages
      })
    }
    else{
      // console.log('did 插入商品');
      this.setState({
        fileListMore:[],
        images:[],
      })
    }
    if(this.props.product.cover!=null){
      this.setState({
        fileList:[{uid:1,url:this.props.product.cover}],

      })
    }
    else{
      this.setState({
        fileList:[{uid:1,url:''}],

      })
    }
    if(this.props.product.detailsImage!=null){
      this.setState({
        fileListDetails:[{uid:1,url:this.props.product.detailsImage}]
      })
    }
    else{
      this.setState({
        fileListDetails:[{uid:1,url:''}]
      })
    }
    let self =this;
    Meteor.call('get.all_product_classes',function(err,alt){
      if (!err) {
        self.setState({
          initialProductClass:alt
        })
      }
      else {
        console.log(err);
      }
    })

    self.setState({
      openKeys: self.props.descriptionKey,
      cover:self.props.product.cover,
    })
  }
  componentWillReceiveProps(nextProps){
    if(!nextProps.modalState){
      // console.log(nextProps);
      // console.log('will',nextProps.product.images);
      // console.log(this.state.images);
      // console.log(nextProps.fileState);

      if(nextProps.product.images==null){
        nextProps.product.images=[];
        // console.log(nextProps.product.images);
      }

      let images=nextProps.product.images;
      let fileListImages=[];
      if(images!=null){
        for(var i=0;i<images.length;i++){
          var url=images[i];
          var first={uid:i};
          var end={url:url}
          var obj =Object.assign(first,end);
          fileListImages.push(obj)
        }
      }
      if(nextProps.fileState!='removed'&&nextProps.fileState!='done'){
        // console.log('add');
        this.setState({
          fileListMore:fileListImages,
          images:nextProps.product.images,
        })
      }
      else{
        // console.log('removed');
      }
      if(nextProps.coverState!='removed'&&nextProps.coverState!='done'){
      if(nextProps.product.cover!=null){
        this.setState({
          fileList:[{uid:1,url:nextProps.product.cover}],
        })
      }
      else{
        this.setState({
          fileList:[{uid:1,url:''}],
        })
      }
    }
          // this.setState({
          //   cover: nextProps.product.cover,
          // })
        if(nextProps.detailsState!='removed'&&nextProps.detailsState!='done'){
        if(nextProps.product.detailsImage!=null){
          this.setState({
            fileListDetails:[{uid:2,url:nextProps.product.detailsImage}],
          })
        }
        else{
          console.log('nsadasdasd');
          this.setState({
            fileListDetails:[{uid:2,url:''}]
          })
        }
      }
        // this.setState({
        //   detailsImage:nextProps.product.detailsImage
        // })
        }
        else {
          // console.log(nextProps);
          if(nextProps.coverState!='done'){
            this.setState({
              fileList:[{uid:1,url:''}],
            })
          }
          // console.log(nextProps.detailsState);
          if(nextProps.detailsState!='done'){
            this.setState({
              fileListDetails:[{uid:1,url:''}],
            })
          }

          let file =nextProps.xx;
          let newfile=[];
          for(var i=0;i<file.length;i++){
            if (file[i].url==undefined) {
              newfile.push(file[i].response.data.link)
            }
            else{
              newfile.push(file[i].url)
            }
          }
          // console.log(newfile);
          if(nextProps.fileState!='removed'&&nextProps.fileState!='done'){
            // console.log('add');
            this.setState({
              fileListMore:nextProps.xx,
              images:newfile
            })
          }
          else{
            // console.log('removed');
          }
        }
    }
   getDS=()=>{
    this.refs.getSwordButton.childMethod();
  }


  onEditorStateChange(editorState) {
    this.setState({
      contentState: editorState,
    });
    let htmlcontent=draftToHtml(convertToRaw(this.state.contentState.getCurrentContent()));
    const setFieldsValue = this.props.form.setFieldsValue;
    setFieldsValue({description:htmlcontent})
  }


    handleChange(info) {
      let fileList = info.fileList;
      fileList = fileList.slice(-1);
      console.log("上传的链接", info);

      let self = this
      if (info.file.status === 'uploading') {
          console.log("上传中。");
      }
      if (info.file.status === 'done') {
          console.log("上传成功。");
          // console.log(info.file.response.data.link)
          // console.log(self.state.image_url);
          self.setState({
            image_url:info.file.response.data.link
          })
          self.props.changecoverState(info.file.status)
          const setFieldsValue = this.props.form.setFieldsValue;
          setFieldsValue({cover:self.state.image_url})

      } else if (info.file.status === 'error') {
          console.log("上传失败。");
      }
      self.setState({
        fileList:fileList
      })
    }
    handleChangeDetails(info) {
      let fileList = info.fileList;
      fileList = fileList.slice(-1);
      console.log("上传的链接", info);

      let self = this
      if (info.file.status === 'uploading') {
          console.log("上传中。");
      }
      if (info.file.status === 'done') {
          console.log("上传成功。");
          // console.log(info.file.response.data.link)
          // console.log(self.state.image_url);
          self.setState({
            image_details:info.file.response.data.link
          })
          self.props.changedetailsState(info.file.status)
          const setFieldsValue = this.props.form.setFieldsValue;

          setFieldsValue({detailsImage:self.state.image_details})

      } else if (info.file.status === 'error') {
          console.log("上传失败。");
      }
      self.setState({
        fileListDetails:fileList
      })
    }
    changeOpenState(){
      this.setState({
        openKeys:[]
      })
    }
    handleChangeMore(info) {
      let fileList = info.fileList;
      let self = this
      console.log("上传的链接", info);

      if (info.file.status === 'uploading') {
          console.log("上传中。");
      }
      if (info.file.status === 'done') {
          console.log("上传成功。");
          // console.log(info.file.response.data.link)
          // console.log(self.state.images);
          // console.log(self.state.fileListMore);
          let old_images = self.state.images;
          console.log(old_images);
          // if(old_images==null){
          //   console.log('null');
          //   old_images=[];
          // }
          old_images.push(info.file.response.data.link);
          self.setState({
            images:old_images,
          })
          // console.log(this.state.images);
          // console.log(this.state.fileListMore);
          let v =this.state.fileListMore;
          let state=info.file.status;
          self.props.changeXX(v)
          self.props.changefileState(state)
          const setFieldsValue = this.props.form.setFieldsValue;
          setFieldsValue({images:self.state.images})
      } else if (info.file.status === 'error') {
          console.log("上传失败。");
      }
      self.setState({
        fileListMore:fileList
      })
      if(info.file.status === 'removed'){
        // console.log(this.state.fileListMore);
        // console.log(this.state.images);
        let file=this.state.fileListMore;
        let newfile=[];
        for(var i=0;i<file.length;i++){
          if (file[i].url==undefined) {
            newfile.push(file[i].response.data.link)
          }
          else{
            newfile.push(file[i].url)
          }
        }
        // console.log(newfile);
        this.setState({
          images:newfile,
        })
        let state=info.file.status;
        this.props.changefileState(state)
        const setFieldsValue = this.props.form.setFieldsValue;
        setFieldsValue({images:newfile})
      }

    }

    getInitialvalue(){
      let spec_length=this.props.product.specifications;
      if(spec_length!=undefined)
      {
      }

    }
    handleConfirmName = (rule,value,callback ) => {
      let id= this.props.id;
      let condition={};
      if(!this.props.modalState){
        condition = {shopId:this.props.product.shopId,_id:{$ne:this.props.product._id}}
      }
      else{
        condition={shopId:id}
      }
      console.log(condition);
        const { getFieldValue } = this.props.form;
        let newName=getFieldValue('name');
        let newalt=[];
        Meteor.call('get.product.byShopIdOr',condition,function(err,alt){
          if(!err){
            for(var i =0;i<alt.length;i++){
              newalt.push(alt[i].name)
            }

          }
          else{
            console.log(err);
          }
          if(newalt.indexOf(newName)>-1){
            callback('已有相同商品名！请重新输入')
          }

        })



    }
    getdesValue(){


    }
    getProductPrice(){
      let price=this.props.product.price
      if(typeof(price)!='undefined'){
        return price/100
      }
      else {
        return ''
      }
    }
    getProductEndprice(){
      let price=this.props.product.endPrice
      if(typeof(price)!='undefined'){
        return price/100
      }
      else {
        return ''
      }
    }
    getCoverValue(){
      let cover = this.props.product.cover;
      return cover
    }
    getSpecName(k){
      const { form } = this.props;
      let spec=this.props.product.specifications;
      if(typeof(spec)!='undefined'){
        let length=spec.length-1;

      if(k<=length){
      return  spec[k].spec_name;
        }
      else {
        return ''
      }
    }
    else {
      return ''
    }
    }

    getSpecNameGroup(k){
      const { form } = this.props;
      let spec=this.props.product.newSpecGroups;
      if(typeof(spec)!='undefined'){
        let length=spec.length-1;

      if(k<=length){
      return  spec[k].spec_name;
        }
      else {
        return ''
      }
    }
    else {
      return ''
    }
    }

    getSpecValueGroup(k){
      const { form } = this.props;
      let spec=this.props.product.newSpecGroups;
      if(typeof(spec)!='undefined'){
        let length=spec.length-1;

      if(k<=length){
      return  spec[k].spec_value;
        }
      else {
        return ''
      }
    }
    else {
      return ''
    }
    }


    proClassCheck=(rule,value,callback) => {
      let self =this;
      const { getFieldValue } = this.props.form;
      let result =getFieldValue('productClass');
      console.log(result);
      if (typeof(result)!='undefined') {
        console.log('1');
        callback()
      }
      else {
        console.log('2');
        callback('请选择商品种类！不能为空')
      }
    }





    getParameterName(k){
      const { form } = this.props;
      let parameter=this.props.product.parameterlist;
      if(typeof(parameter)!='undefined'){
        let length=parameter.length-1;

      if(k<=length){
      return  parameter[k].parameter_name;
        }
      else {
        return ''
      }
      }
      else {
      return ''
      }
      }
      getParameterValue(k){
        const { form } = this.props;
        let parameter=this.props.product.parameterlist;
        if(typeof(parameter)!='undefined'){
          let length=parameter.length-1;

        if(k<=length){
        return  parameter[k].parameter_value;
          }
        else {
          return ''
        }
        }
        else {
        return ''
        }
        }
    getAgency(k){
      const {form} =this.props;
      let agency=this.props.product.agencyLevelPrices;
      if(typeof(agency)!='undefined'){
        let length = agency.length -1 ;
        if(k<=length){
          return agency[k]/100;
        }
        else {
          return ''
        }
      }
      else {
        return ''
      }
    }
    getSpecValue(k){
      let aaa =this.props.key_arr.length;
      let spec=this.props.product.specifications;
      if(typeof(spec)!='undefined'){
        let length=spec.length-1;

      if(k<=length){
      return  spec[k].spec_value;
        }
      else {
        return ''
      }
    }
    else {
      return ''
    }

    }
    getSpecPrice(k){
      let aaa =this.props.key_arr.length;
      let spec=this.props.product.specifications;
      if(typeof(spec)!='undefined'){
        let length=spec.length-1;

      if(k<=length){
      return  spec[k].spec_price;
        }
      else {
        return ''
      }
    }
    else {
      return ''
    }

    }

    change(a){
      this.setState({
        uuid:a
      })
    }


    getDescription(){
      const setFieldsValue = this.props.form.setFieldsValue;
      let description=this.props.product.description;
      if(typeof(description)!='undefined'){
        return description
      }
      else{
        return '<p>开始编辑<p>'
      }
    }

    handleTestFileOnChange = (e) => {
      let self = this;
      let files = e.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            let  fileReader = new FileReader();

            fileReader.onload = ( (file) =>  {
                return (e) => {
                    document.getElementById("showUpload").src = e.target.result;
                    self.setState({
                      image_url:e.target.result
                    })
                    const setFieldsValue = self.props.form.setFieldsValue;
                    setFieldsValue({cover:self.state.image_url})
                }

            })(file);
            fileReader.readAsDataURL(file);
    }
  }

  handleTestFileDetailsOnChange= (e) => {
    let self = this;
    let files = e.target.files;
      for (let i = 0; i < files.length; i++) {
          const file = files[i];
          let  fileReader = new FileReader();

          fileReader.onload = ( (file) =>  {
              return (e) => {
                  document.getElementById("showUploadDetails").src = e.target.result;
                  self.setState({
                    image_details:e.target.result
                  })
                  const setFieldsValue = self.props.form.setFieldsValue;
                  setFieldsValue({detailsImage:self.state.image_details})
              }

          })(file);
          fileReader.readAsDataURL(file);
  }
}

  handleTestFilesOnChange = (e) => {
    let self = this;
    let files = e.target.files;
    console.log(files);
    var images_file = [];
    var result =document.getElementById("result");
      for (let i = 0; i < files.length; i++) {
          const file = files[i];
          let  fileReader = new FileReader();

          fileReader.onload = ( (file) =>  {
              return (e) => {

                  // document.getElementById("showUploads").src = e.target.result;
                  let images = e.target.result;
                  result.innerHTML=result.innerHTML+'<img  src="' + images +'"  style="  width:30%;margin:5px"  key={i}  alt="" />';

                  images_file.push(images)
                  console.log(images_file);
                  self.setState({
                    images:images_file
                  })
                  const setFieldsValue = self.props.form.setFieldsValue;
                  setFieldsValue({images:self.state.images})
              }

          })(file);

          fileReader.readAsDataURL(file);
  }

}

setUrl = (urls) => {
  console.log(urls);
  let self = this ;
  const setFieldsValue = self.props.form.setFieldsValue;
  setFieldsValue({ images: urls})

}
getRemoteCover = (cover) => {
  console.log(cover);
  let self = this ;
  const setFieldsValue = self.props.form.setFieldsValue;
  setFieldsValue({cover:cover})

}
getRemoteDetails=(detailsImage) => {
  console.log(detailsImage);
  let self = this ;
  const setFieldsValue = self.props.form.setFieldsValue;
  setFieldsValue({detailsImage:detailsImage})

}

    selectHandleChange(value){
      // console.log(`selected ${value}`);
    }
    //初次挂载去获取数据
    changeholeder(){
      // console.log(this.props.product.holder);
    }

    render() {
      const { contentState,cover ,fileList,fileListMore,fileListDetails} = this.state;
      const  { product,editState,modalState } = this.props;
        let uploadProps = {
          action: '/images/upload',
          onChange: this.handleChange.bind(this),
          listType: 'picture',
          fileList:fileList
        };

      const uploadPropsMore = {
        action: '/images/upload',
        onChange: this.handleChangeMore.bind(this),
        listType: 'picture',
        fileList:fileListMore
      };
      const uploadPropsDetails={
        action: '/images/upload',
        onChange:this.handleChangeDetails.bind(this),
        listType:'picture',
        fileList:fileListDetails
      }

      const { getFieldDecorator, getFieldValue } = this.props.form;
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

           getFieldDecorator('cover')
           getFieldDecorator('parameterkeys',{initialValue:this.props.key_parameterarr});
            const parameterkeys = getFieldValue('parameterkeys');
            const parameterItems =parameterkeys.map((k, index) => {
              return(
                <FormItem
                {...formItemLayout}
                label='参数名'
                  required={false}
                  key={k}
                >
                  {getFieldDecorator(`parameter_name[${k}]`, {
                    initialValue:this.getParameterName(k),
                    validateTrigger: ['onChange', 'onBlur'],

                  })(
                    <Input placeholder="参数名" style={{ width: '100%'}} />
                  )}
                </FormItem>

              )
            })
            const parameterItems2 = parameterkeys.map((k, index) => {
              return(
                <FormItem
                {...formItemLayout}
                label='参数值'
                  required={false}
                  key={k}
                >
                  {getFieldDecorator(`parameter_value[${k}]`, {
                    initialValue:this.getParameterValue(k),
                    validateTrigger: ['onChange', 'onBlur'],

                  })(
                    <Input placeholder="参数值" style={{ width: '80%'}} />
                  )}
                  {parameterkeys.length > 1 ? (
                          <Icon
                            style={{marginLeft:10}}
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            disabled={parameterkeys.length === 1}
                            onClick={() => this.parameterremove(k)}
                          />
                        ) : null}
                </FormItem>

              )
            })





            getFieldDecorator('keyss',{initialValue:this.props.key_agencyarr})
            const keyss = getFieldValue('keyss');
            const formItemsAgency = keyss.map((k, index) => {
              return (
                <FormItem
                {...formItemLayout}
                label={k+1+'级分销'}
                  required={false}
                  key={k}
                >
                  {getFieldDecorator(`agencyPrice[${k}]`, {
                    initialValue:this.getAgency(k),
                    validateTrigger: ['onChange', 'onBlur'],
                    // rules: [{
                    //   required: true,
                    //   whitespace: true,
                    //   message: "请输入奖励.",
                    // }],
                  })(
                    <Input placeholder="奖励" style={{ width: '30%'}} />
                  )}
                  {keyss.length > 1 ? (
                    <Icon
                      style={{marginLeft:10}}
                      className="dynamic-delete-button"
                      type="minus-circle-o"
                      disabled={keyss.length === 1}
                      onClick={() => this.agencyremove(k)}
                    />
                  ) : null}
                </FormItem>
              );
            });

            const type=this.state.initialProductClass;
            const children=[];
            for (var i = 0; i < type.length; i++) {
              children.push(<Option key={type[i].name}>{type[i].name_zh}</Option>)
            }
            
            const productImageslength = [1];
            const productImages=productImageslength.map((k,index) => {
              if (this.props.modalState) {
                return(
                  <FormItem
                  {...formItemLayout}
                  label="商品多图(测试base64)"
                  hasFeedback
                  >
                    <input type="file" multiple onChange={(e)=>this.handleTestFilesOnChange(e)} />
                    <div id="result" name="result"></div>

                  </FormItem>
                )
              }


              else {
                const imagess= this.props.product.images
                console.log(imagess);
                const aaa =[];
                console.log(aaa);

                if (typeof(imagess)!='undefined') {
                  for (var i = 0; i < imagess.length; i++) {
                    aaa.push(<img src={imagess[i]} key={i*100} style={{width:'30%',margin:'5px'}}/>)
                  }
                }

                return(
                  <FormItem
                  {...formItemLayout}
                  label="商品多图(测试base64)"
                  hasFeedback
                  >
                    <input type="file" multiple onChange={(e)=>this.handleTestFilesOnChange(e)} />
                    <div id="result" name="result" >
                      {aaa}
                    </div>
                  </FormItem>
                )
              }
            })


            const productClassLength = [1];
            const productClass = productClassLength.map((k,index) => {
              if(this.props.modalState){
                return(
                  <FormItem
                  {...formItemLayout}
                  label='商品分类'
                    required={false}
                    key={k}
                  >
                    {getFieldDecorator(`productClass`, {
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [{ validator: this.proClassCheck }],

                    })(
                      <Select
                      placeholder="选择商品分类"
                      dropdownStyle={{zIndex:'99999' }}
                      style={{ width: '20%' }}>
                       {children}
                     </Select>
                    )}
                  </FormItem>

                )
              }
              else {
                return(
                  <FormItem
                  {...formItemLayout}
                  label='商品分类'
                    required={false}
                    key={k}
                  >
                    {getFieldDecorator(`productClass`, {
                      // validateTrigger: ['onChange', 'onBlur'],
                      initialValue:this.props.product.productClass,
                      rules: [{ required: true, message: '商品名称不能为空' }],
                    })(
                      <Select
                      placeholder="选择商品分类"
                      dropdownStyle={{zIndex:'99999' }}
                      style={{ width: '20%' }}>
                       {children}
                     </Select>
                      // <Input placeholder="商品分类" disabled={!this.props.modalState} style={{ width: '20%'}} />
                    )}
                  </FormItem>
                )
              }
            })


            getFieldDecorator('keys', { initialValue:this.props.key_arr});
            const keys = getFieldValue('keys');
            const formItems = keys.map((k, index) => {
              if(this.props.modalState){
                return (
                  <FormItem
                  {...formItemLayout}
                  label='规格名'
                    required={false}
                    key={k}
                  >
                    {getFieldDecorator(`spec_name[${k}]`, {
                      initialValue:this.getSpecName(k),
                      validateTrigger: ['onChange', 'onBlur'],

                    })(
                      <Input placeholder="产品规格" disabled={!this.props.modalState} style={{ width: '100%'}} />
                    )}
                  </FormItem>
                );
              }
              else {
                return (
                  <FormItem
                  {...formItemLayout}
                  label='规格名'
                    required={false}
                    key={k}
                  >
                    {getFieldDecorator(`spec_name[${k}]`, {
                      initialValue:this.getSpecNameGroup(k),
                      validateTrigger: ['onChange', 'onBlur'],

                    })(
                      <Input placeholder="产品规格" disabled={this.props.modalState} style={{ width: '100%'}} />
                    )}
                  </FormItem>
                );
              }


            });

            const formItems2 = keys.map((k, index) => {
              if (this.props.modalState) {
                return (
                  <FormItem
                    {...formItemLayout}
                    label='规格值'
                    required={false}
                    key={k}
                  >
                    {getFieldDecorator(`spec_value[${k}]`, {
                      validateTrigger: ['onChange', 'onBlur'],

                    })(
                      <Select
                      mode="tags"
                      style={{ width: '80%' }}
                      placeholder="Please select"
                      onChange={handleChangeSpec}
                      disabled={!this.props.modalState}
                      dropdownStyle={{zIndex:'99999' }}
                      ></Select>
                    )}
                    {keys.length > 1 ? (
                            <Icon
                              style={{marginLeft:10}}
                              className="dynamic-delete-button"
                              type="minus-circle-o"
                              disabled={keys.length === 1}
                              onClick={() => this.remove(k)}
                            />
                          ) : null}
                  </FormItem>
                );
              }
              else {
                return (
                  <FormItem
                    {...formItemLayout}
                    label='规格值'
                    required={false}
                    key={k}
                  >
                    {getFieldDecorator(`spec_value[${k}]`, {
                      initialValue:this.getSpecValueGroup(k),
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: "请输入属性.",
                      }],
                    })(
                      <Input placeholder="属性" disabled={this.props.modalState} style={{ width: '70%'}} />
                    )}

                  </FormItem>
                );
              }

            });
      return (
        <Form onSubmit={this.handleSubmit}>

        {productClass}

        <FormItem
      {...formItemLayout}
      label="商品名称"
      hasFeedback
      >
      {getFieldDecorator('name', {
          initialValue: this.props.product.name,
          // rules: [{validator: this.handleConfirmName}]
          rules: [{ required: true, message: '商品名称不能为空' }],
      })(

          <Input className="shop-name-input"  disabled={this.props.editState} prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="商品名称" />
      )}
      </FormItem>


      <FormItem
      {...formItemLayout}
      label="商品中文名称"
      hasFeedback
      >
      {getFieldDecorator('name_zh', {
          initialValue: this.props.product.name_zh,
          rules: [{ required: true, message: '商品名称不能为空' }],
      })(

          <Input className="shop-name-input"  disabled={this.props.editState} prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="商品中文名称" />
      )}
      </FormItem>



      <FormItem
      {...formItemLayout}
      label="商品封面地址"
      hasFeedback
      >
      {getFieldDecorator('cover', {
          initialValue: this.props.product.cover,
      })(

          <Input className="shop-name-input"    placeholder="商品封面地址" />
      )}
      </FormItem>
      <FormItem
      {...formItemLayout}
      label="商品封面预览"
      hasFeedback
      >
          <UploadCoverToCloudinary getRemoteCover={this.getRemoteCover}  ref="getSwordButton"  cover={this.props.product.cover} images_state={this.props.images_state}/>
      </FormItem>




      <FormItem
      {...formItemLayout}
      label='商品多图地址'
        required={false}
      >
        {getFieldDecorator(`images`, {
          validateTrigger: ['onChange', 'onBlur'],
          initialValue: this.props.product.images,
          // rules: [{ validator: this.proClassCheck }],

        })(
          <Select
          mode="tags"
          placeholder="商品多图地址"
          dropdownStyle={{zIndex:'99999' }}
          style={{ width: '100%' }}>
         </Select>
        )}
      </FormItem>
      <FormItem
      {...formItemLayout}
      label="商品多图预览"
      hasFeedback
      >
            <UploadToCloudinary setUrl={this.setUrl.bind(this)}  ref="getSwordButton"  images={this.props.product.images} images_state={this.props.images_state}/>
      </FormItem>
      <FormItem
      {...formItemLayout}
      label="商品详情地址"
      hasFeedback
      >
      {getFieldDecorator('detailsImage', {
          initialValue: this.props.product.detailsImage,
      })(

          <Input className="shop-name-input"    placeholder="商品详情地址" />
      )}
      </FormItem>
      <FormItem
      {...formItemLayout}
      label="商品详情图片预览"
      hasFeedback
      >
          <UploadDetailsToCloudinary getRemoteDetails={this.getRemoteDetails}  ref="getSwordButton"  detailsImage={this.props.product.detailsImage} images_state={this.props.images_state}/>
      </FormItem>






      <FormItem
      {...formItemLayout}
      label="商品简介"
      hasFeedback
      >
      {getFieldDecorator('brief', {
          initialValue: this.props.product.brief,
          rules: [{ required: true, message: '商品简介' }],
      })(

          <Input className="shop-name-input"  disabled={this.props.editState} prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="商品简介" />
      )}
      </FormItem>



      <FormItem
      {...formItemLayout}
      label="商品类型"
      >
      {getFieldDecorator('isTool', {
        valuePropName:'checked',
        initialValue: this.props.product.isTool,
          })(
            <Checkbox disabled={this.props.editState}>工具类型</Checkbox>
          )}
      </FormItem>
      <FormItem
      {...formItemLayout}
      label="是否预约"
      >
      {getFieldDecorator('isAppointment', {
        valuePropName:'checked',
        initialValue: this.props.product.isAppointment,
          })(
            <Checkbox disabled={this.props.editState}>预约</Checkbox>
          )}
      </FormItem>
      <FormItem
      {...formItemLayout}
      label="商品推荐"
      >
      {getFieldDecorator('recommend', {
        valuePropName:'checked',
        initialValue: this.props.product.recommend,
          })(
            <Checkbox disabled={this.props.editState}>上推荐</Checkbox>
          )}
      </FormItem>
      <Divider dashed />
      <FormItem
      {...formItemLayout}
      label="商品参数"
      hasFeedback
      >
      <Button type="dashed" onClick={this.parameteradd} disabled={!this.props.modalState} >
        <Icon type="plus" />添加参数
      </Button>
      </FormItem>
      <Row>
        <Col span={4}></Col>
        <Col span={6}>{parameterItems}</Col>
        <Col span={6}>{parameterItems2}</Col>
        <Col span={4}></Col>
      </Row>
      <Divider dashed />
      <FormItem
      {...formItemLayout}
      label="商品分销奖励"
      hasFeedback
      >
      <Button type="dashed" onClick={this.agencyadd} disabled={!this.props.modalState} >
        <Icon type="plus" />添加等级
      </Button>
      </FormItem>

        {formItemsAgency}

      <Divider dashed />
      <FormItem {...formItemLayout}label='添加商品规格'>
        <Button type="dashed" onClick={this.add} disabled={!this.props.modalState} >
          <Icon type="plus" />添加规格
        </Button>

      </FormItem>
      <Row>
        <Col span={4}></Col>
        <Col span={6}>{formItems}</Col>
        <Col span={12}>{formItems2}</Col>
        <Col span={4}></Col>
      </Row>

        <Divider dashed style={{marginTop:5 ,marginBottom:5}}/>
        <FormItem label='商品描述'>
          {getFieldDecorator('description',{initialValue:this.getDescription()})(

            <Menu
        mode="inline"
        openKeys={this.state.openKeys}
        onOpenChange={this.onOpenChange}
        style={{ width: '100%' }}
        onBlur={() => {console.log('blur')}}
      >
      <SubMenu key="sub1" title={<span><Icon type="mail" /><span>点击开始编辑</span></span>}>

          <Editor
          onEditorStateChange={this.onEditorStateChange.bind(this)}
           initialEditorState={contentState}
             editorState={contentState}
          localization={{
            locale: 'zh',
          }}
          toolbarClassName="rdw-storybook-toolbar"
           wrapperClassName="rdw-storybook-wrapper"
           editorClassName="rdw-storybook-editor"
          toolbar={{
              inline: { inDropdown: true },
              list: { inDropdown: true },
              textAlign: { inDropdown: true },
              link: { inDropdown: true },
              history: { inDropdown: true },
              image: {
                uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: false },
              },
            }}
            onBlur={this.changeOpenState.bind(this)}
            />

            </SubMenu>
            </Menu>
          )}
          </FormItem>
        {getFieldDecorator('specifications', { initialValue:this.getInitialvalue()})}
        {getFieldDecorator('parameterlist', { initialValue:this.getInitialvalue()})}
        {getFieldDecorator('images')}
        {getFieldDecorator('detailsImage')}

      </Form>
      )
    }
  }

  const ProductForm = Form.create()(ProductFormWrap);

  export default ProductForm;
