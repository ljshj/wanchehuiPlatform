import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import NewMemberApply from '/imports/ui/reducers/NewMemberApply'
import ShopForm from '/imports/ui/reducers/ShopForm.js'
import CurrentDealAgency from '/imports/ui/reducers/CurrentDealAgency.js'
import AgencyChange from '/imports/ui/reducers/AgencyChange.js'
import {WithDraws, getWithDraw} from '/imports/ui/reducers/WithDraws.js'

const rmiddleware = routerMiddleware(browserHistory)
export default function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(thunk),
    applyMiddleware(rmiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  );
  return createStore(
    combineReducers({
      routing: routerReducer,
      NewMemberApply,
      CurrentDealAgency,

      AgencyChange,
      WithDraws,
      getWithDraw,

    }),
    initialState,
    enhancer);
}
