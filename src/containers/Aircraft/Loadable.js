import React from 'react';
import Loadable from 'react-loadable';

const AircraftFeathersLoadable = Loadable({
  loader: () => import('./Aircraft' /* webpackChunkName: 'Aircraft' */).then(module => module.default),
  loading: () => <div>Loading</div>
});

export default AircraftFeathersLoadable;
