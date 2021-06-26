import isEmpty from './isEmpty.mjs';
import { hearts } from './emoji.mjs';
// import jsonrpc from '@polkadot/types/interfaces/jsonrpc'
// import config from './config/index.js'
let sys = undefined
// import { createStore } from 'redux'
import redux from '@reduxjs/toolkit'
let createSlice = redux.createSlice
let configureStore = redux.configureStore
const INIT_STATE = {
  keyring: null,
  keyringState: null,
  api: null,
  apiError: null,
  apiState: null,
  counter: { }
};

const reducer = (state, action) => {
  // console.log('-----ssssssssss--reducer----------',{
  //   state: state,
  //   action:action
  // })
  switch (action.type) {
    case 'CONNECT_INIT':
      return { ...state, apiState: 'CONNECT_INIT' };

    case 'CONNECT':
      return { ...state, api: action.payload, apiState: 'CONNECTING' };

    case 'CONNECT_SUCCESS':
      return { ...state, apiState: 'READY' };

    case 'CONNECT_ERROR':
      return { ...state, apiState: 'ERROR', apiError: action.payload };

    case 'LOAD_KEYRING':
      return { ...state, keyringState: 'LOADING' };

    case 'SET_KEYRING':
      return { ...state, keyring: action.payload, keyringState: 'READY' };

    case 'KEYRING_ERROR':
      return { ...state, keyring: null, keyringState: 'ERROR' };

    default:
      // console.log('----->', {
      //   "action.payload": action
      // })
      return { ...state, keyring: action.payload, counter: {
          index:'sssssssssss'
        }
      };
      // return { ...state, keyring: null, keyringState: 'ddddddddddd' };
      // throw new Error(`Unknown type: ${action.type}`);
  }
};

const counterSlice = createSlice({
  name: 'chain',
  initialState: INIT_STATE,
  reducers: {
    substrate: reducer,
  },
})
const { substrate } = counterSlice.actions
// console.log('sssssssssssssssssssssssssssss',substrate)

const store = configureStore({
  reducer: counterSlice.reducer
})


store.subscribe((e) => {
  store.getState()
  // console.log(`${hearts[2][1]} -> store`,store.getState())
})

let init = () =>{
  return sys = new Proxy({}, {
    get: (obj, prop) => {
      // console.log(`${hearts[0][0]} -> get`, {
      //   obj:obj,
      //   prop:prop,
      // });
      return obj[prop];
    },
    set: (obj, prop, value) => {
      if(isEmpty(obj[prop])) {
        obj[prop] = [];
      }
      // console.log(`${hearts[2][0]} -> set`, {
      //   prop:prop,
      //   value:value,
      // })
      store.dispatch(substrate( ))
      obj[prop].push(value);
      return true;
    },
    "deleteProperty": function (oTarget, sKey) {
      // console.log(`${hearts[0][1]} -> get`, {
      //   oTarget:oTarget,
      //   sKey:sKey
      // });
      if (sKey in oTarget) { return false; }
      return oTarget.removeItem(sKey);
    },
    "enumerate": function (oTarget) {
      return oTarget.keys();
    },
    "iterate": function (oTarget) {
      return oTarget.keys();
    },
    "ownKeys": function (oTarget) {
      return oTarget.keys();
    },
    "has": function (oTarget, sKey) {
      return sKey in oTarget || oTarget.hasItem(sKey);
    },
    "hasOwn": function (oTarget, sKey) {
      return oTarget.hasItem(sKey);
    },
    "defineProperty": function (oTarget, sKey, oDesc) {
      if (oDesc && "value" in oDesc) { oTarget.setItem(sKey, oDesc.value); }
      return oTarget;
    },
    "getPropertyNames": function (oTarget) {
      return Object.getPropertyNames(oTarget).concat(oTarget.keys());
    },
    "getOwnPropertyNames": function (oTarget) {
      return Object.getOwnPropertyNames(oTarget).concat(oTarget.keys());
    },
    "getPropertyDescriptor": function (oTarget, sKey) {
      let vValue = oTarget[sKey] || oTarget.getItem(sKey)
      return vValue ? {
        "value": vValue,
        "writable": true,
        "enumerable": true,
        "configurable": false
      } : undefined;
    },
    "getOwnPropertyDescriptor": function (oTarget, sKey) {
      let vValue = oTarget.getItem(sKey)
      return vValue ? {
        "value": vValue,
        "writable": true,
        "enumerable": true,
        "configurable": false
      } : undefined;
    },
    "fix":  function (oTarget) {
      // console.log(`${hearts[0][1]} -> get`, {
      //   oTarget:oTarget,
      //   text:"not implemented yet!"
      // });
      return "not implemented yet!";
    },
  });
}
export default (()=>{

    return (sys === undefined) ? init() : sys
})()

