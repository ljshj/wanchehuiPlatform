import { Meteor } from 'meteor/meteor';
import {Shops} from '../shops.js';
import {Tags} from '../../tags/tags.js';

Meteor.publish('shops.tag.name', function(tagName, page, pagesize){

  return Shops.find({tags: {$all: [tagName]}},
    {
      skip: (page-1)*pagesize, limit: pagesize,
      sort: {createdAt: -1}
    }
  );
});



// Meteor.publish('home.top.products', function(page, pagesize){
//   console.log(page);
//   return Shops.find(
//     {skip: (page-1)*pagesize, limit: pagesize, sort: {createdAt: -1}}
//   );
// })
