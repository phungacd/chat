import { combineReducers } from 'redux';
import accountData from './accountManaged';
import userData from './userReducer';
import FriendReducer from './friendReducer';
import messageData from './messageReducer';
import GroupReducer from './groupReducer';
import RoomsReducer from './roomsReducer';

export default combineReducers({
  accountData,
  userData,
  FriendReducer,
  messageData,
  GroupReducer,
  RoomsReducer
});
