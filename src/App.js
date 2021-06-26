import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { SubstrateContextProvider } from './substrate-lib';

export default function App () {
  return (
  <SubstrateContextProvider>
  </SubstrateContextProvider>
  );
}
