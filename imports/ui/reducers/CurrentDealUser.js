import {GET_ONE_USER, GET_ONE_PAGE_INCOMES} from '../actions/current_deal_user.js';


export default function CurrentDealUser(state={userId: null, removing: 0, operaType: "", loading: false, incomes: [], charges: []}, action){
  switch (action.type) {
  case GET_ONE_USER:
    return Object.assign({},state, {
      userId: action.userId,
      operaType: action.operaType,
      loading: true,
      incomes: [],
      charges: []
    });
  case GET_ONE_PAGE_INCOMES:
    console.log(action);
    return state;
  default:
    return state;
  }
}
