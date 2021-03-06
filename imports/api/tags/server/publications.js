import { Meteor } from 'meteor/meteor';
import {Tags} from '../tags.js';

Meteor.publish('home.tags', function(){
  return Tags.find({isHome: true},
    {
      skip: 0, limit: 5,
      sort: {createdAt: -1}
    }
  );
});
