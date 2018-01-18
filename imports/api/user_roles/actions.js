import {UserRoles} from './user_roles.js';


export function userBindingRoles(userId,roleIds){
  let user_roles = UserRoles.find({userId: userId}).fetch();
  if(user_roles.length == 0){
    //关系表中有没有userId，增加user和roles的对应关系
    for (let i = 0; i < roleIds.length; i++) {
      UserRoles.insert({
        userId: userId,
        roleId: roleIds[i],
        createdAt: new Date(),
      })
    }
  }else{
    let OldRoles = []
    //关系表中对应已经有N条关系，找出这N条关系对应的roles数组
    for (let i = 0; i < user_roles.length; i++) {
      OldRoles.push(user_roles[i].roleId)
    }
    //求出差集,大神尤雨溪提供的方法
    let difference = OldRoles.concat(roleIds).filter(v => !OldRoles.includes(v) || !roleIds.includes(v))
    console.log(difference)
    for (let i = 0; i < difference.length; i++) {
      //如果以前有该用户的记录，先删除以前有的记录
      if (UserRoles.findOne({userId:userId,roleId:difference[i]})){
        UserRoles.remove({userId:userId,roleId:difference[i]})
      }else{
        //插入新的记录
        UserRoles.insert({
          userId: userId,
          roleId: difference[i],
          createdAt: new Date(),
        })
      }
    }
  }
}

export function usersFindByRoleId(roleId){
  let user_roles_record =  UserRoles.find({roleId:roleId}).fetch();
  let userIds = []
  for(i=0; i<user_roles_record.length;i++){
    userIds.push(user_roles_record[i].userId)
  }
  return Meteor.users.find({_id: {$in: userIds}}).fetch();
}

export function rolesFindByUserId(userId){
  let user_role_record = UserRoles.find({userId:userId}).fetch();
  if(user_role_record.length > 0){
    let roleIds = []
    for (let i = 0; i < user_role_record.length; i++) {
      roleIds.push(user_role_record[i].roleId)
    }
    return roleIds
  } else{
    return []
  }
}