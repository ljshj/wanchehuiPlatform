import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { allUsersMount, allCardUsersMount } from './actions.js';
import {Orders} from "/imports/api/orders/orders.js"
Meteor.methods({
  'user.role'() {
    if (!Meteor.user()) {

      return [];
    }
    return Meteor.user().roleId;
  },
  'users.count'(){
    return allUsersMount();
  },
  'users.cards.count'(){
    return allCardUsersMount();
  },
  'get.users.limit'(condition={},page=1, pagesize=20){
    let users =  Meteor.users.find(condition, {
      skip: (page-1)*pagesize, limit: pagesize,
      sort: {"createdAt": -1},
      fields:
        {
          'roles': 1,
          'profile': 1,
          'username': 1,
          'createdAt': 1,
          'cards': 1,
          'carnumber': 1,
        }
      }
    );
    return users.fetch();
  },
  'get.users.addOnToady'(){
    let date = new Date();
    let Y=date.getFullYear() +'/';
    let M= (date.getMonth()+1<10?'0'+(date.getMonth()+1) :date.getMonth()+1) +'/';
    let D=date.getDate();
    let NEXTD = D + 1
    return Meteor.users.find({createdAt: {'$gte':new Date(Y+M+D),'$lt':new Date(Y+M+NEXTD)}}).count();
  },

  'users.cards.addOnToady'(){
    let date = new Date();
    let Y=date.getFullYear() +'/';
    let M= (date.getMonth()+1<10?'0'+(date.getMonth()+1) :date.getMonth()+1) +'/';
    let D=date.getDate();
    let NEXTD = D + 1;
    return Orders.find({createdAt: {'$gte':new Date(Y+M+D),'$lt':new Date(Y+M+NEXTD)}, status:'paid',type:'card'}).count();

  },
  'users.cards.addOnWeek'(){
    var day_of_week = new Date().getDay()
    if( day_of_week == 0){
       day_of_week = 7
    }
    let date = new Date();
    let Y=date.getFullYear() +'/';
    let M= (date.getMonth()+1<10?'0'+(date.getMonth()+1) :date.getMonth()+1) +'/';
    let D=date.getDate();
    let EXD = D + 1
    let NTD = D - day_of_week + 1;
    return Orders.find({createdAt: {'$gte':new Date(Y+M+NTD),'$lt':new Date(Y+M+EXD)}, status:'paid',type:'card'}).count();
  }
});
