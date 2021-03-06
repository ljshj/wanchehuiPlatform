import {addMountToBalance, loseMountFromBalance, findOrCreateBalanceByUser} from './balances_actions.js'
import {noteIncome} from './balance_incomes_actions.js'
import {noteCharge} from './balance_charge_actions.js'
import {BalanceCharges} from './balance_charges';



export function giveUserMoney(userId, amount, reason){
  console.log('userId', userId);
  let balance = findOrCreateBalanceByUser(userId);
  if (!balance) {
    return "BLANCE NOT FOUND IN giveUserMoney";
  }
  let text = ''
  if (reason.type === "agencyCard") {
    text = '分享奖励'
  }
  noteIncome(reason, amount, text, balance._id);
  console.log(balance);
  return addMountToBalance(balance._id, amount);
}

export function loseUserMoney(userId, amount, reason){
  let balance = findOrCreateBalanceByUser(userId);

  if (!balance) {
    return "BLANCE NOT FOUND IN loseUserMoney";
  }
  let text = ''
  if (reason.type === "withdrawals") {
    text = '提现金额';
  }
  if (reason.type === "refund") {
    text = "用户已经退款";
  }

  noteCharge(reason, amount, text, balance._id);
  return loseMountFromBalance(balance._id, amount);
}


export function allBalanceChargeCount(condition){
  console.log(condition);
  console.log(BalanceCharges.find(condition).count());
  return BalanceCharges.find(condition).count();
}


export function getCurrentMonthFirst(){
   var date=new Date();
   date.setDate(1);
   return date;
}

export function getCurrentMonthLast(){
   var date=new Date();
   var currentMonth=date.getMonth();
   var nextMonth=++currentMonth;
   var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
   var oneDay=1000*60*60*24;
   return new Date(nextMonthFirstDay-oneDay);
}
