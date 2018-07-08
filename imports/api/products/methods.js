import { Meteor } from 'meteor/meteor';
import {Roles} from '../roles/roles.js'
import { Products } from './products.js';
import { UserRoles } from '../user_roles/user_roles.js';
import { Shops } from '../shops/shops.js';
import {ProductOwners} from '../product_owners/product_owners';
import {getProductTypeById, getProductByZhName} from './actions.js';

Meteor.methods({
  "products.insert"(product,shopId,shopName,newSpec,newSpecGroups,userId){
    let copy_roles = []
    cards = Products.find({shopId: shopId, $or: [{ productClass: 'advanced_card' },{ productClass: 'common_card' }]}).fetch()
    for(var i=0;i < cards.length;i++){
      if(cards[i].name){
        copy_roles.push(cards[i].name + '_holder')
      }
    }
    Products.insert({
      name: product.name,
      name_zh:product.name_zh,
      price: 0,
      description: product.description,
      brief:product.brief,
      cover:product.cover,
      detailsImage:product.detailsImage,
      createdByUserId: userId,
      endPrice:0,
      curency:product.curency,
      detailsImage:product.detailsImage,
      isTool:product.isTool,
      isAppointment:product.isAppointment,
      roleName:product.roleName,
      categoryld:product.categoryld,
      images: product.images,
      isSale: false,
      shopId:shopId,
      productClass:product.productClass,
      shopName:shopName,
      parameterlist:product.parameterlist,
      specName:product.spec_name,
      specifications:newSpec,
      newSpecGroups:newSpecGroups,
      curency:'cny',
      recommend:product.recommend,
      agencyLevelCount: 2,//eg: 2
      agencyLevelPrices: product.agencyPrice,
      createdAt : new Date(),
      acl: {
        own: {
          roles: ["shop_owner"],
          users: [],
        },
        read: {
          roles: ['nobody', 'login_user']
        },
        write: {
          roles: ["shop_owner","shop_manager"],
          users: [],
        },
        copy:{
          roles: copy_roles,
          users:[]
        },
        buy:{
          roles: ['login_user']
        }
      },
    },function (err,alt) {
      if(!err){
        if(product.isTool){
          console.log('yesyes');
          let roles_name_count =Roles.find({name:product.name+'_holder'}).count();
          if(roles_name_count===0){
            Roles.insert({
              name:product.name+'_holder',
              name_zh:product.name_zh,
              time_limit:-1,
              permissions:{},
              state:true,
              weight:0,
              createdAt : new Date(),
              isSuper: false,
              users:[]
            })
          }
        }
        else {
          console.log('nono');
        }

      }

    });
  },

  'product.isSale'(_id){
    let Product = Products.findOne({_id:_id})
    Products.update(_id, {
      $set: {
        isSale: !Product.isSale,
      }
    });
    return Product
  },

  'product.isSaleFalse'(_id){
    let Product = Products.findOne({_id:_id})
    Products.update(_id, {
      $set: {
        isSale: false,
      }
    });
    return Product
  },

  'product.price'(_id){
    let price = Products.findOne({_id:_id}).price;
    console.log(price);
    return price
  },

  'product.updatePrice'(id,price,endPrice){
    Products.update(id,{
      $set:{
        price:price,
        endPrice:endPrice
      }
    })
  },

  'product.offline'(id){
    Products.update(id, {
      $set: {
        onLine: false,
      }
    });
  },

  'product.descount'(id, discount){
    Products.update(id, {
      $set: {
        onLine: discount,
      }
    });
  },

  'product.edit'(product){
    Products.update({
      $set: {
        name: product.name,
        price: product.price,
        discount: product.discount,
        descirption: product.descirption,
        image_des: product.image_des,
        images: product.images,
        onLine: product.onLine,
      }
    });
  },

  'get.product.id'(productId){
    return getProductTypeById(productId);
  },

  'get.product.byShopId'(id){
    return Products.find({shopId:id}).fetch();
  },

  'get.product.byShopIdOr'(condition){
    console.log(condition)
    return Products.find(condition).fetch();
  },

  'get.oneproduct.id'(id,token){
    console.log(`打印token`)
    console.log(token)
      let product =  Products.findOne({_id:id});
      console.log(`产品`)
      console.log(product)
      let shop = Shops.findOne({_id: product.shopId});
      console.log(shop.name)
      return {
        ...product,
        shop_name: shop.name,
        shop_address: shop.address,
        shop_cover: shop.cover,
        formMethod: 'get.oneproduct.id'
      }

    // Object.assign(product,{shop_name: shop.name})
  },

  'product.update'(old,product){
    Products.update({_id:old._id},{
      $set:{
        name: product.name,
        name_zh:product.name_zh,
        price: product.price,
        description: product.description,
        brief:product.brief,
        image_des: product.image_des,
        images: product.images,
        detailsImage:product.detailsImage,
        cover:product.cover,
        detailsImage:product.detailsImage,
        endPrice:product.endPrice,
        isTool:product.isTool,
        recommend:product.recommend,
        status:product.status,
        specifications:product.specifications,
        agencyLevelPrices:product.agencyPrice,
        productClass:product.productClass,
        isAppointment:product.isAppointment
      }
    },function(err,alt){
      if (!err) {
        if (product.isTool) {
          console.log('yesyes');
          let roles_name_count = Roles.find({ name: product.name + '_holder' }).count();
          if (roles_name_count === 0) {
            Roles.insert({
              name: product.name + '_holder',
              name_zh: product.name_zh,
              time_limit: -1,
              permissions: {},
              state: true,
              weight: 0,
              createdAt: new Date(),
              isSuper: false,
              users: []
            })
          }
        }
        else {
          console.log('nono');
        }
      }
    })
  },

  'app.get.recommend.products'(page,pagesize){
    let products =  Products.find(
      {
        recommend: true,
        isSale: true
      },
      {
        skip: (page-1)*pagesize,
        limit: pagesize,
        sort: {createdAt: -1},
        fields:
              {
                name: 1,
                name_zh: 1,
                price: 1,
                createdAt: 1,
                isTool: 1,
                endPrice: 1,
                images: 1,
                cover: 1
              }
      },

    ).fetch()
    return {
      list: [...products],
      formMethod: 'app.get.recommend.products'
    }

  },

  'app.get.shop.products'(shopId) {
    let products = Products.find(
      {
        shopId: shopId,
        isSale: true,
      }
      ).fetch()
    return {
      list: [...products],
      formMethod: 'app.get.shop.products'
    }
  },

  'home.top.products'(page, pagesize) {
   let  products = Products.find(
      {recommendLevel: {$lte: 0}},
      {skip: (page-1)*pagesize, limit: pagesize, sort: {createdAt: -1}}
    ).fetch()
    return {
        list: [...products],
        formMethod: 'home.top.products'
      }
  },

  'app.product.search'(data) {
    let products = Products.aggregate([
        { $match: { name_zh: {$regex:data}}},
        {
          $lookup: {
            from: "Shops",
            localField: "shopId",
            foreignField: "_id"
          }
        }
      ])
    console.log(products);
    return {
      products,
      formMethod: 'app.product.search'
    }
  },

  'fancyshop.getProductByZhName'(zhName){
    let product = getProductByZhName(zhName);
    return {
      product,
      fromMethod: 'fancyshop.getProductByZhName',
    }
  },
  
  'product.cardBindToUser'(cardId,username){
    let user = Meteor.users.findOne({username:username})
    let product = Products.findOne({'_id': cardId})
    console.log(product)
    if(user){
      let productOwener = ProductOwners.findOne({ userId: user._id, productId: cardId })
      if (productOwener){
        console.log('记录已经存在')
        throw new Meteor.Error("该用户已经是高级会员卡用户，请勿重复添加");
      }else{
        ProductOwners.insert({
          userId: user._id, 
          productId: cardId,
          createdAt: new Date(),
        },function(err,alt){
          //如果授卡成功，给该用户相应的角色
          if(!err){
            let roleName = product.name + '_holder'
            console.log(roleName) 
            let role = Roles.findOne({ 'name': roleName})
            console.log(role._id)
            console.log(role.name)
            let user_role = UserRoles.findOne({ 'roleName': roleName, 'userId': user._id })
            if (user_role){
              console.log('更新角色用户表')
              UserRoles.update(user_role,{
                status: true
              })
            }else{
              console.log('插入角色用户表')
              UserRoles.insert({
                roleName: role.name,
                userId: user._id,
                roleId: role._id,
                createdAt: new Date(),
                status: true
              })
            }
          }
        })
      }
    }else{
      throw new Meteor.Error("授卡失败,请检查用户名是否存在");
    }
  },
  'product.cardUnbindUser'(){
    console.log('解绑用户')
  }
});
