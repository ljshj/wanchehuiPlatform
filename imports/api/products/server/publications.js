// All links-related publications

import { Meteor } from 'meteor/meteor';
import { Products } from '../products.js';


Meteor.publish('user.products', function (pageId) {
  return Products.find({pageId: pageId});
});

Meteor.publish('products.user_id', function(user_id, page, pagesize
){
  return Products.find({userId: user_id},
  {skip: page*pagesize, limit: pagesize, sort: {createdAt: -1}});

});

// Meteor.publish('home.top.products', function(page, pagesize){
//   return Products.find(
//     {recommendLevel: {$lte: 0}},
//     {skip: (page-1)*pagesize, limit: pagesize, sort: {createdAt: -1}}
//   );
// })


Meteor.publish('get.product.id', function(shop_id){
  return Products.find(
    {shopId: shop_id }
  );
})

Meteor.publish('get.shop.products', function(id,page, pagesize){
  return Products.find(
    {recommendLevel: {$lte: 0}},
    {skip: (page-1)*pagesize, limit: pagesize, sort: {createdAt: -1}}
  );
})


// Meteor.publish('app.get.shop.products', function(shop_id,page, pagesize){
//   console.log(shop_id)
//   console.log(page)
//   return Products.find(
//     {shopId: shop_id},
//     {skip: (page-1)*pagesize, limit: pagesize, sort: {createdAt: -1}}
//   );
// })


// Meteor.publish('app.get.recommend.products', function(page, pagesize){
//   console.log(page);
//   console.log(pagesize);
//   console.log(`走这里`)
//   return Products.find(
//       {recommend: true},
//       { 
//         skip: (page-1)*pagesize, 
//         limit: pagesize, 
//         sort: {createdAt: -1},
//         fields:
//               {
//                 name: 1,
//                 name_zh: 1,
//                 price: 1,
//                 createdAt: 1,
//                 isTool: 1,
//                 endPrice: 1,
//                 images: 1,
//                 cover: 1
//               }
//       },
//     )
  // return Products.find(
  //   {recommend: true },
  //   {skip: (page-1)*pagesize, limit: pagesize, sort: {createdAt: -1}}
  // )
// })



