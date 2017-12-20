import { Meteor } from 'meteor/meteor';
import {getRoleByUsername} from './actions.js';
import { Roles } from './roles.js'

Meteor.methods({
  'role.by.username'(username) {
    return getRoleByUsername(username);
  },
  'role.insert'(params){
    console.log(params)
    return Roles.insert({
        name_zh: params.name_zh,
        name: params.name,
        permissions:params.permissions,
        state: true, 
        weight: 0,  //0权重权限最大
        createdAt : new Date(), 
        isSuper: false,
        users:[]
      });
    },
  'role.findByTag'(tag){ 
    let role = Roles.findOne({'name':tag})
    if(!role){
      return "ROLE NOT FOUND";
    }
    return role
  },
  'role.findById'(roleId){ 
    let role = Roles.findOne({'_id':roleId})
    if(!role){
      return "ROLE NOT FOUND";
    }
    return role
  },
  'get.roles.limit'(condition={},page=1, pageSize=20){
    let roles =  Roles.find(condition, {
        skip: (page-1)*pageSize, limit: pageSize,
        sort: {"createdAt": -1},
        fields:
          {
            'name': 1,
            'name_zh': 1,
            'permissions': 1,
            'createdAt': 1,
            'isSuper':1,
            'state':1,
            'users':1,
            'weight':1
          }
        }
      );
      return roles.fetch();
    },
    'role.update'(role, params){
      Roles.update(role, {
        $set: {
          name: params.name,
          name_zh: params.name_zh,
          permissions: params.permissions,
        }
      });
    },
    'role.toggleState'(roleState, roleId){
      return Roles.update(roleId, {
        $set: {
          state: !roleState
        }
      });
    },
    'roels.count'(){
      return Roles.find().count();
    }
});
