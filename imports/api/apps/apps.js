// Definition of the apps collection

import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import {Orders} from "/imports/api/orders/orders.js";
import {UserRoles} from "/imports/api/user_roles/user_roles.js";
import { Products } from '../products/products.js';
import {Balances} from '../balances/balances.js';
import {Bankcards} from '../bankcards/bankcards.js';
import {BalanceIncomes} from '../balances/balance_incomes.js';
import {BalanceCharges} from '../balances/balance_charges.js';
export const Apps = new Mongo.Collection('apps');
export const AppCarts = new Mongo.Collection("app_carts");
export const UserContacts = new Mongo.Collection("user_contacts");


//需要用的工具类函数， 
function validUserLogin(token){
   
    let hashStampedToken = Accounts._hashStampedToken(token);
    let hashedToken = hashStampedToken.hashedToken;
    let validToken = Accounts._hashLoginToken(token.token);
    if(hashedToken===validToken){
        return true;
    }else{
        return false;
    }
}

function getUserInfo(loginToken, appName, collectionType, callBack){
    //标准获取用户信息模板
    if(!findOneAppByName(appName)){
        return {
            type: "error",
            reason: "invalid app"
        }
    }
    if(validUserLogin(loginToken)){
        return callBack();
        
    }else{
        return {
            type: "error",
            reason: "NOT LOGIN"
        }
    }
}

function generateRondom(n) {
    let str = "";
    let num ;
    for(var i = 0; i < n ; i ++) {
        num  = Math.ceil(Math.random()*10);
        str += num ;
    }
   return str;
}


export function syncUser(userId, stampedToken, appName){
    if(!findOneAppByName(appName)){
        return {
            type: "error",
            reason: "invalid app"
        }
    }
    let hashStampedToken = Accounts._hashStampedToken(stampedToken);
    let hashedToken = hashStampedToken.hashedToken;
    let validToken = Accounts._hashLoginToken(stampedToken.token);
    if(hashedToken!==validToken){
        return {
            type: "fail",
            msg: "NOT LOGINED"
        };
    }
      let roles = [];
      UserRoles.find({userId}).forEach((item)=>{
        roles.push(item.roleName);
      });
      let user = Meteor.users.findOne({_id: userId});
      let userContact = UserContacts.findOne({userId, default: true})
      roles.push("login_user");
      return {
          type: "users",
          msg: {roles, user, userId: user._id, userContact},
      }
}


export function findOneAppByName(name){
    
    if (name === "wanrenchehui") {
        if(Apps.find(name).count()===0){
            Apps.insert({
                name,
                name_zh: "万人车汇",
                domain: "10000cars.cn",
                testDomain: "test1.10000cars.cn",
                breif: "专注网约车创业"
            });
        }
    }
    return Apps.findOne({name});
}

export function appRegNewUser(userParams, appName){
    if(!findOneAppByName(appName)){
        return {
            type: "error",
            reason: "invalid app"
        }
    }

    if(Meteor.users.findOne({'profile.mobile': userParams.mobile})){
        return {
            type: "error",
            reason: "USER REG MOBILE EXISTS" 
        }
    }


    userId =  Accounts.createUser({username: userParams.username, password: userParams.password});
    if(userId){
      Meteor.users.update(userId, {
        $set: {
          'profile.mobile': userParams.mobile,
          "regPosition": userParams.position,
          "regAddress": userParams.address,
          "regCity": userParams.city,
        }
       })
       return {
           type: "users",
           msg: userId,
       }
    }else{
        return {
            type: "error",
            reason: "USER REG USERNAME EXISTS" 
        }
    }
}

export function appLoginUser(type, loginParams, appName){
    if(!findOneAppByName(appName)){
        return {
            type: "error",
            reason: "invalid app"
        }
    }
    switch (type) {
        case 'mobileSMS':
        //短线验证码登陆
            let mobileUser = Meteor.users.findOne({username: loginParams.mobile});
            if(mobileUser === undefined){
            mobileUser = Meteor.users.findOne({'profile.mobile': loginParams.username});
            if(mobileUser===undefined){
                let newUserId =Accounts.createUser({
                username: loginParams.mobile,
                password: loginParams.mobile
                })
                Meteor.update(mobileUser._id, {
                "profile.mobile": loginParams.mobile,
                "regPosition": loginParams.position,
                "regAddress": loginParams.address,
                "regCity": loginParams.city,
                });
                mobileUser = Meteor.users.findOne({_id: newUserId});
                return {type: 'users',msg: {stampedToken: stampedTokenMobile, userId: mobileUser._id, needToResetPassword: true}};
            }
            }
            if(mobileUser){
            let stampedTokenMobile = Accounts._generateStampedLoginToken();
            let hashStampedTokenMobile = Accounts._hashStampedToken(stampedTokenMobile);
            Meteor.users.update(mobileUser._id,
                {$push: {
                    'services.resume.loginTokens': hashStampedTokenMobile,
                    "logPosition": loginParams.position,
                    "logAddress": loginParams.address,
                    "logCity": loginParams.city,
                }}
            );
            return {type: "users", msg: {stampedToken: stampedTokenMobile, userId: mobileUser._id, needToResetPassword: false}};
            }

        case 'password':
        //密码登陆
          let user = Meteor.users.findOne({username: loginParams.username});
          if(user === undefined){
            user = Meteor.users.findOne({'profile.mobile': loginParams.username});
            if(user===undefined){
              return {type: "error", reason:"USER NOT FOUND"};
            }
          }
          let rlt = Accounts._checkPassword(user, loginParams.password);
          if(rlt.userId === user._id && !rlt.error){
            let stampedToken = Accounts._generateStampedLoginToken();
            let hashStampedToken = Accounts._hashStampedToken(stampedToken);
            Meteor.users.update(user._id,
                {$push: {
                    'services.resume.loginTokens': hashStampedToken,
                    'services.resume.loginLocation': {
                        "logPosition": loginParams.position,
                        "logAddress": loginParams.address,
                        "logCity": loginParams.city,
                        "loginedAt": new Date(),
                    },
                }}
            );
            let roles = [];
                UserRoles.find({userId: user._id}).forEach((item)=>{
                roles.push(item.roleName);
                });
            roles.push("login_user");
            let userContact = UserContacts.findOne({userId: user._id, default: true})
            
            return {type: "users", 
            msg: 
            {stampedToken, userId: user._id, roles, user, userContact}};
          }else{
            return {type: "error", reason: "LOGIN PASS WRONG"};
          }
          
        default:
          return {type: "error", reason: "INVALID LOGIN"};
      }
}



export function appNewCart(cartParams, appName){
    if(!findOneAppByName(appName)){
        return {
            type: "error",
            reason: "invalid app"
        }
    }
    if (validUserLogin) {
        return {
            type: "error",
            reason: "NEED TO LOGIN"
        }
    }
}

export function updateCart(cartId, userId, appName, cartParams){
    if(!findOneAppByName(appName)){
        return {
            type: "error",
            reason: "invalid app"
        }
    }
    if (validUserLogin) {
        return {
            type: "error",
            reason: "NEED TO LOGIN"
        }
    }
}

export function appNewOrder(cartParams, appName){
    if(!findOneAppByName(appName)){
        return {
            type: "error",
            reason: "invalid app"
        }
    }
    if (validUserLogin) {
        return {
            type: "error",
            reason: "NEED TO LOGIN"
        }
    }
}

export function getOneProduct(token, appName, condition){
    if(!findOneAppByName(appName)){
        return {
            type: "error",
            reason: "invalid app"
        }
    }
    let product = Products.findOne(condition);
    if (!product) {
        return {
            type: "error",
            reason: "PRODUCT NOT FOUND"
        }
    }
    return {
        type: "products",
        msg: product
    }
}
export function updateOrder(loginToken, appName, orderParams, orderId){
    return getUserInfo(loginToken, appName, "orders", function(){
        let updateRlt = Orders.update(orderId, {
            $set: {
                ...orderParams
            }
        })
    })
}

export function createNewOrder(loginToken, appName, orderParams){
    if(!findOneAppByName(appName)){
        return {
            type: "error",
            reason: "invalid app"
        }
    }
    if(validUserLogin(loginToken)){
        let  orderCode = new Date().getTime().toString()+generateRondom(10).toString();
        let order = Orders.findOne({orderCode});
        if(order){
            return {
                type: "error",
                reason: "ORDERCODE REPEAT"
            }
        }
        let orderParamsDealed = {
            ...orderParams,
            type: "card",
            mobile: orderParams.contact.mobile, //兼容1.0
            carNumber: orderParams.contact.carNumber, //兼容1.0
            price: orderParams.totalAmount/100, //兼容1.0
            productId: orderParams.productIds[0], //兼容1.0
            realNote: {
                realName: orderParams.contact.name,
                mobile: orderParams.contact.mobile,
                carNumber: orderParams.contact.carNumber,
            }, //兼容1.0
            count: 1, //兼容1.0
            orderCode,
            status: "unconfirmed",
            createdAt: new Date()
        }
        let orderId = Orders.insert(orderParamsDealed);
        return {
            type: "orders",
            msg: orderId
        }
    }else{
        return {
            type: "error",
            reason: "NOT LOGIN"
        }
    }
}

export function getOneOrderById(loginToken, appName, orderId){
    if(!findOneAppByName(appName)){
        return {
            type: "error",
            reason: "invalid app"
        }
    }
    if(validUserLogin(loginToken)){
        let order = Orders.findOne({_id: orderId})
        if (!order) {
            return {
                type: "error",
                msg: "ORDER NOT FOUND"
            }
        }
        return {
            type: "orders",
            msg: order
        }
    }else{
        return {
            type: "error",
            reason: "NOT LOGIN"
        }
    }
}

export function loadOneOrderById(loginToken, appName, orderId){
    return getUserInfo(loginToken, appName, "orders", function(){
        let order = Orders.findOne({_id: orderId});
        if(!order){
            return {
                type: "error",
                reason: "ORDER NOT FOUND"
            }
            
        }else{
            return {
                type: "orders",
                msg: order,
            }
        }
    });
}

export function loadMoneyPage(loginToken, appName, userId){
    return getUserInfo(loginToken, appName, "balances", {userId}, function(params){
        let balance = Balances.findOne({userId});
        if(!balance){
           let balanceId = Balances.insert({
                userId,
                amount: 0,
                createdAt: new Date()
           })

           balance = Balances.findOne({_id: balanceId});
            
        }
        let balance_incomes = BalanceIncomes.find({userId});
        let balance_charges = BalanceCharges.find({userId});
        //数据结构兼容，之后可以删除
        let incomeNeedToUpdate = false;
        balance_incomes.forEach(income=>{
            if(!income.balanceId){
                BalanceIncomes.update(income._id, {
                    $set: {
                        balanceId: balance._id
                    }
                })
                incomeNeedToUpdate = true;
            }
        })
        if(incomeNeedToUpdate){
            balance_incomes = BalanceIncomes.find({balanceId: userId});
        }
        
        //======================收入更新完毕
        //支出数据结构兼容
        let chargeNeedToUpdate = false;
        balance_charges.forEach(charge=>{
            if(!charge.balanceId){
                BalanceCharges.update(charge._id, {
                    $set: {
                        balanceId: balance._id
                    }
                })
                chargeNeedToUpdate = true;
            }
        });
        if(chargeNeedToUpdate){
            balance_charges = BalanceCharges.find({userId});
        }
        //======================支出更新完毕

        return {
            type: "balances",
            msg: {
                balance,
                balance_incomes: balance_charges.fetch(),
                balance_charges: balance_charges.fetch()
            }
        }
        
        
    });
}


export function withdrawMoney(loginToken, appName, userId, amount, bankId){
    return getUserInfo(loginToken, appName, "balances", function(){
        let incomeId = BalanceIncomes.insert({
          userId, 
          text: "提现金额",
          money: amount, 
          bankId, 
          status: "revoke", 
          reasonType: "withdrawals", 
          createdAt: new Date()
         });
         if(incomeId){
            return {
                type: "balances",
                msg: incomeId
            }
         }else{
             return {
                 type: "error",
                 msg: "INSERT BALANCEINCOME SOMEHOW"
             }
         }
    });
}

export function getUserBankcards(loginToken, appName, userId){
    return getUserInfo(loginToken, appName, "bankcards", function(){
        let bankcards = Bankcards.find({userId});
        return {
            type: "bankcards",
            msg: bankcards.fetch()
        }
    });
}

export function createBankcard(
    loginToken, 
    appName,
    userId, 
    realName,
    accountNumber,
    bankAddress){
    return getUserInfo(loginToken, appName, "bankcards", function(){
        let bankId = Bankcards.insert({
            userId, 
            realName,
            accountNumber,
            bankAddress,
            createdAt: new Date()
        });
        if(bankId){
            return {
                type: "bankcards",
                msg: bankId
            }
        }else{
            return {
                type: "error",
                reason: "CREATE BANKCARD ERROR"
            }
        }
        
    });
}

export function syncRemoteCartToLocal(loginToken, appName, cartId){
    return getUserInfo(loginToken, appName, "app_carts", function(){
        let cart = AppCarts.findOne({_id: cartId, status: "notFinish"});
        if(!cart){
            return {
                type: "app_carts",
                msg: cart
            }
        }
        return {
            type: "error",
            reason: "CART NOT FOUND"
        }
    })
}



export function syncLocalCartToRemote(loginToken, appName, cartId, cartParams){
    return getUserInfo(loginToken, appName, "app_carts", function(){
        let updateRlt = null;
        if(cartId){
            let cart = AppCarts.findOne({_id: cartId, status: "notFinish"});
            
            updateRlt = AppCarts.update(cartId, {
                $set: {
                    ...cartParams,
                }
            });
            if(!updateRlt){
                return {
                    type: "error",
                    reason: "UPDATE CART FAIL"
                }
            }
            return {
                tyep: "app_cart",
                msg: updateRlt,
            }
        }else{
          let newCartId = AppCarts.insert({
              ...cartParams,
              createdAt: new Date()
          })
          if(!newCartId){
              return {
                  type: "error",
                  reason: "CREATE CART FAIL"
              }
          }else{
              return {
                 type: "app_cart",
                 msg: newCartId
              }
          }
        }
        
       
    })
}

export function getUserDetailsById(loginToken, appName, userId){
    return getUserInfo(loginToken, appName, "users", function(){
        let user = Meteor.users.findOne({_id: userId});
        if(user){
            return {
                 type: "users",
                 msg: user
            }
        }else{
            return {
                type: "error",
                reason: "USER NOT FOUND"
            }
        }
    })
}

export function createUserContact(loginToken, appName, userId, contactParams){
    return getUserInfo(loginToken, appName, "user_contacts", function(){
        if(contactParams.default === true){
            let contacts = UserContacts.find({userId});
            contacts.forEach(contact=>{
                UserContacts.update(contact._id, {
                    $set: {
                        default: false,
                    }
                })
            })
        }
        let newContactId = UserContacts.insert({
            ...contactParams,
            deleted: false,
            createdAt: new Date(),

        })
        return {
            type: "user_contact",
            msg: UserContacts.findOne({_id: newContactId})
        }
    });
}

export function getUserContacts(loginToken, appName, userId){
    return getUserInfo(loginToken, appName, "user_contacts", function(){
        let contacts = UserContacts.find({userId, deleted: false})
        return {
            type: "user_contact",
            msg: contacts
        }
    })
}

export function deleteUserContact(loginToken, appName, contactId){
    return getUserInfo(loginToken, appName, "user_contacts", function(){
        let delRlt = UserContacts.update({
            $set: {
                deleted: true
            }
        })
        return {
            type: "user_contact",
            msg: delRlt
        }
    })
}

export function setUserContactDefatult(loginToken, appName, contactId){
    return getUserInfo(loginToken, appName, "user_contacts", function(){
        let contact = UserContacts.findOne({_id: contactId});
        if(contact.default){
            return {
                type: "user_contact",
                msg: contact._id,
            }
        }else{
            let contacts = UserContacts.find({userId});
            contacts.forEach(contact=>{
                UserContacts.update(contact._id, {
                    $set: {
                        default: false,
                    }
                })
            })
            let updateRlt = UserContacts.update(contactId, {
                $set: {
                    default: true
                }
            });
            return {
                type: "user_contact",
                msg: updateRlt
            }
        }
    })
}