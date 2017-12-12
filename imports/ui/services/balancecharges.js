import { Meteor } from 'meteor/meteor';



export function getMeteorBalanceChargeUnpaid(condition,page,pageSize,callback){
  Meteor.call("balance.chargesdataUnpaid",condition,page,pageSize,function(err,rlt){
    var bankIds = [];
    var result = [];
    for(var charge  of rlt){
      charge.money = charge.money/100.0;
      result.push(charge);
      let userId = charge.userId;
      bankIds.push(userId);
    }
    Meteor.call("bankcards.accouts", bankIds, function(error, accouts) {
      if (!error) {
        accoutHash = {}
        console.log(accouts);
        for(let accout of accouts) {
          accoutHash[accout.userId] = accout;
          console.log(accout);
        }
        for(var charge of result) {
          charge.bankId = accoutHash[charge.userId].accountNumber;
          charge.userId=  accoutHash[charge.userId].realName;
        }
        callback(err, result);
      }
      console.log("error=>", error);
      console.log(result);
    });
    // console.log(rlt);
  });
}

export function getMeteorBalanceChargePaid(condition,page,pageSize,callback){
  Meteor.call("balance.chargesdataPaid",condition,page,pageSize,function(err,rlt){
    console.log(rlt);
    var bankIds = [];
    var result = [];
    for(var charge  of rlt){
      charge.money = charge.money/100.0;
      result.push(charge);
      let userId = charge.userId;
      bankIds.push(userId);
    }
    console.log(bankId);
    Meteor.call("bankcards.accouts", bankIds, function(error, accouts) {
      if (!error) {
        accoutHash = {}
        console.log(accouts);
        for(let accout of accouts) {
          accoutHash[accout.userId] = accout;
          console.log(accout);
        }
        for(var charge of result) {
          charge.bankId = accoutHash[charge.userId].accountNumber;
          charge.userId=  accoutHash[charge.userId].realName;
        }
        callback(err, result);
      }
      console.log("error=>", error);
      console.log(result);
    });
    // console.log(rlt);
  });
}

export function getMeteorBalanceChargeRevoke(condition,page,pageSize,callback){
  Meteor.call("balance.chargesdataRevoke",condition,page,pageSize,function(err,rlt){
    var bankIds = [];
    var result = [];
    for(var charge  of rlt){
      charge.money = charge.money/100.0;
      result.push(charge);
      let userId = charge.userId;
      bankIds.push(userId);
    }
    Meteor.call("bankcards.accouts", bankIds, function(error, accouts) {
      if (!error) {
        accoutHash = {}
        console.log(accouts);
        for(let accout of accouts) {
          accoutHash[accout.userId] = accout;
          console.log(accout);
        }
        for(var charge of result) {
          charge.bankId = accoutHash[charge.userId].accountNumber;
          charge.userId=  accoutHash[charge.userId].realName;
        }
        callback(err, result);
      }
      console.log("error=>", error);
      console.log(result);
    });
    // console.log(rlt);
  });
}


export function countBalanceCharge(callback){
  return Meteor.call('balancecharge.count',function(err,rlt){
    callback(err,rlt)
  })
}
