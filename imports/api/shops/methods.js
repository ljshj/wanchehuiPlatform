import { Meteor } from 'meteor/meteor';
import { Shops } from './shops.js'
import { validLoginToken } from '../actions/validLoginToken.js';
Meteor.methods({
    'shops.insert'(params){
      console.log(params)
        return Shops.insert({
            name: params.name,
            appName: params.appName,  
            phone: params.phone,
            pictures:params.pictures,
            description: params.description,
            tags:params.tags,
            cover:params.cover,
            address: params.address,
            lntAndLat:params.lntAndLat,
            status: true, //true为营业，fasle为关闭
            acl: {
              own: {
                roles: ["shop_owner"],
                users: '',
              },
              read: {
                roles: ['nobody', 'login_user']
              },
              write: {
                roles: ["shop_owner","shop_manager"],
                users: '',
              }
            },
            createdAt : new Date(),
          });
    },
    'get.shops.limit'(condition={},page=1, pageSize=20){
        let shops =  Shops.find(condition, {
            skip: (page-1)*pageSize, limit: pageSize,
            sort: {"createdAt": -1},
            fields:
              {
                'name': 1,
                'phone': 1,
                'pictures': 1,
                'description':1 ,
                'tags':1,
                'createdAt': 1,
                'cover':1,
                'address':1,
                'lntAndLat':1,
                'status':1,
                'acl':1
              }
            }
          );
          return shops.fetch();
        },
    'shops.findShopById'(shopId){
      let shop = Shops.findOne({_id:shopId})
      if (!shop) {
        return "SHOP NOT FOUND";
      }
      return shop;
    },
    'shops.findShopName'(shopId,token){
      if(validLoginToken(token)){
        let shop = Shops.findOne({_id:shopId})
        if (!shop) {
          return "SHOP NOT FOUND";
        }
        return {
          shopName:shop.name,
          formMethod: "shops.findShopName"
        };
      }

    },
    'shops.findOneShopById'(shopId){
      let shop = Shops.find({_id:shopId}).fetch();
      return shop;
    },
    'shops.editAddress'(id,address){
      return Shops.update({_id:id},{$set:{address:address}});
    },
    'shops.editPhone'(id,phone){
      return Shops.update({_id:id},{$set:{phone:phone}});
    },
    'shops.changeShopState'(shopId){
      let shop = Shops.findOne({_id:shopId})
       Shops.update(shopId, {
        $set: {
          status: !shop.status,
        }
      });
      return shop
    },
    'shops.update'(shop, params){
      Shops.update(shop, {
        $set: {
          appName: params.appName,
          name: params.name,
          phone: params.phone,
          pictures:params.pictures,
          description: params.description,
          tags:params.tags,
          cover:params.cover,
          address: params.address,
          lntAndLat:params.lntAndLat,
        }
      });
    },
    'shops.count'(){
      return Shops.find().count();
    },
    'shop.update.acl_own'(shop,userId){
      if(shop.acl.own.users.length > 0){
        console.log('=============')
        console.log('以前有店长')
        let OldOwner = shop.acl.own.users
        Shops.update(shop, {
          $set:{
            'acl.own.users': userId
          }
        });
      console.log('=============')
      console.log('旧店长ID:'+ OldOwner)
      return OldOwner;
      }else{
        console.log('=============')
        console.log('以前无店长')
        Shops.update(shop, {
          $set:{
            'acl.own.users': userId
          }
        })
      }

    },
    'shops.getByCurrentUser'(currentUserId){
      let shop = Shops.findOne({'acl.own.users': currentUserId})
      if (shop){
        return shop
    }
  }
})
