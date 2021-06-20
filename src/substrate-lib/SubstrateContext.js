import React, { useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import queryString from 'query-string';
import sys from '../sys.mjs';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import keyring from '@polkadot/ui-keyring';
import config from '../config';

const parsedQuery = queryString.parse(window.location.search);
const connectedSocket = parsedQuery.rpc || config.PROVIDER_SOCKET;
console.log(`Connected socket: ${connectedSocket}`);

///
// Initial state for `useReducer`

const INIT_STATE = {
  socket: connectedSocket,
  jsonrpc: { ...jsonrpc, ...config.RPC },
  types: config.types,
  keyring: null,
  keyringState: null,
  api: null,
  apiError: null,
  apiState: null
};
sys.INIT_STATE = INIT_STATE;
///
// Reducer function for `useReducer`

const reducer = (state, action) => {
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
      throw new Error(`Unknown type: ${action.type}`);
  }
  sys.state = state;
};
sys.reducer = reducer;
///
// Connecting to the Substrate node

const connect = (state, dispatch) => {
  const { apiState, socket, jsonrpc, types } = state;
  sys.state = state;
  sys.types = types;
  // We only want this function to be performed once
  if (apiState) return;

  dispatch({ type: 'CONNECT_INIT' });

  const provider = new WsProvider(socket);
  sys.provider = provider;
  const _api = new ApiPromise({ provider, types, rpc: jsonrpc });
  sys._api = _api;
  // Set listeners for disconnection and reconnection event.
  _api.on('connected', () => {
    dispatch({ type: 'CONNECT', payload: _api });
    // `ready` event is not emitted upon reconnection and is checked explicitly here.
    _api.isReady.then((_api) => dispatch({ type: 'CONNECT_SUCCESS' }));
  });
  _api.on('ready', () => dispatch({ type: 'CONNECT_SUCCESS' }));
  _api.on('error', err => dispatch({ type: 'CONNECT_ERROR', payload: err }));
};
sys.connect = connect;
///
// Loading accounts from dev and polkadot-js extension

let loadAccts = false;
sys.loadAccts = loadAccts;
const loadAccounts = (state, dispatch) => {
  const asyncLoadAccounts = async () => {
    dispatch({ type: 'LOAD_KEYRING' });
    try {
      await web3Enable(config.APP_NAME);
      let allAccounts = await web3Accounts();
      allAccounts = allAccounts.map(({ address, meta }) =>
        ({ address, meta: { ...meta, name: `${meta.name} (${meta.source})` } }));
      keyring.loadAll({ isDevelopment: config.DEVELOPMENT_KEYRING }, allAccounts);
      dispatch({ type: 'SET_KEYRING', payload: keyring });
    } catch (e) {
      console.error(e);
      dispatch({ type: 'KEYRING_ERROR' });
    }
  };
  sys.asyncLoadAccounts = asyncLoadAccounts;
  const { keyringState } = state;
  sys.keyringState = keyringState;
  // If `keyringState` is not null `asyncLoadAccounts` is running.
  if (keyringState) return;
  // If `loadAccts` is true, the `asyncLoadAccounts` has been run once.
  if (loadAccts) return dispatch({ type: 'SET_KEYRING', payload: keyring });

  // This is the heavy duty work
  loadAccts = true;
  asyncLoadAccounts();
};
sys.loadAccounts = loadAccounts;
const SubstrateContext = React.createContext();
sys.SubstrateContext = SubstrateContext;
const SubstrateContextProvider = (props) => {
  // filtering props and merge with default param value
  const initState = { ...INIT_STATE };
  const neededPropNames = ['socket', 'types'];
  neededPropNames.forEach(key => {
    initState[key] = (typeof props[key] === 'undefined' ? initState[key] : props[key]);
  });

  const [state, dispatch] = useReducer(reducer, initState);
  sys.state = state;
  sys.dispatch = dispatch;
  connect(state, dispatch);
  loadAccounts(state, dispatch);

  return <SubstrateContext.Provider value={state}>
    {props.children}
  </SubstrateContext.Provider>;
};
sys.SubstrateContextProvider = SubstrateContextProvider;
// prop typechecking
SubstrateContextProvider.propTypes = {
  socket: PropTypes.string,
  types: PropTypes.object
};

const useSubstrate = () => ({ ...useContext(SubstrateContext) });

export { SubstrateContextProvider, useSubstrate };
