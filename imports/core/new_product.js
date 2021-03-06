import {Categories} from '../api/categories/categories.js';
import {Roles} from '../api/roles/roles.js';
import {Tags} from '../api/tags/tags.js';
import {Products} from '../api/products/products.js';

function createTag
(
  name,
  createdByUserId,
)
{

}

function createProductTag
(

)
{

}
function newProductRole(
  pruductId,
  roleName,
)
{

}
function generateNewToolRole(product){
  if (!product.isTool) {
    return "IT IS NOT TOOL";
  }
  return Roles.insert({
    name: product.roleName+"_holder",
  })
}

export function newProuct
(
  isTool,
  roleName,
  roleName_zh,
  params,
  categoryName,
  tagNames,
  acl,
)
{
  let category = Categories.findOne({name: categoryName})
  if (!category) {
    let categoryId = Categories.insert({
      superCategoryId: null,
      name: categoryName,
      createdAt: new Date()
    });
    category = Categories.findOne({_id: categoryId});
  }
  if (Products.find({name_zh: params.name_zh}).count()>0) {
    console.log(params.name_zh+"已经存在");
    return "name_zh exist";
  }
  if (Products.find({name: params.name}).count()>0) {
    console.log(params.name+"已经存在");
    return "name exist";
  }
  if (Products.find({name: roleName}).count()>0) {
    console.log(roleName+"已经存在");
    return "roleName exist";
  }
  let buyAcl = {
    roles: ['login_user']
  };
  if(acl && acl.buy){
    buyAcl = acl.buy
  }
  let productId = Products.insert(Object.assign({}, params, {
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
      buy: buyAcl,
    },
    createdAt: new Date(),
    isTool,//是否是工具类商品
    roleName,//当且仅仅当isTool为true的时候设置,会生成roleName+Holder的角色, roleName需要判重, //"shopName.owner""shopName.custService"
    categoryId: category._id,
  }));
  for (var i = 0; i < tagNames.length; i++) {
    if (Tags.find({name: tagNames[i]}).count() < 1) {
      Tags.insert({
       name: tagNames[i],
       shopIds: [params.shopId],
       productIds: [productId],
       createdAt: new Date(),
     })
   }else{
     let tag = Tags.findOne({name: tagNames[i]});
     let shopIds = tag.shopIds;
     let productIds = tag.productIds;
     if (shopIds) {
       shopIds.push(params.shopId);
     }else{
       shopIds = [params.shopId];
     }
     if (productIds) {
       productIds.push(productId);
     }else{
       productIds = [productId];
     }
     Tags.update(tag._id, {
       $set: {
         shopIds,
         productIds,
       }
     })
   }

  };
  if (isTool) {
    if (!Roles.findOne({  name: roleName+"_holder"})) {
      Roles.insert({
          name_zh: roleName_zh,
          name: roleName+"_holder",
          time_limit: 525600000,
          permissions:{
            products: {
              read: true,
            }
          },
          state: true,
          weight: 0,  //0权重权限最大
          createdAt : new Date(),
          isSuper: false,
          users:[]
        });
    }

  }


return productId;

}
