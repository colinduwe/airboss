import React from 'react';
import Loadable from 'react-loadable';

const FrequencyAddFeathersLoadable = Loadable({
  loader: () => import('./FrequencyAdd' /* webpackChunkName: 'frequencyAdd' */).then(module => module.default),
  loading: () => <div>Loading</div>
});

export default FrequencyAddFeathersLoadable;
