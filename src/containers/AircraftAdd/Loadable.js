import React from 'react';
import Loadable from 'react-loadable';

const AircraftAddFeathersLoadable = Loadable({
  loader: () => import('./AircraftAdd' /* webpackChunkName: 'aircraftAdd' */).then(module => module.default),
  loading: () => <div>Loading</div>
});

export default AircraftAddFeathersLoadable;
