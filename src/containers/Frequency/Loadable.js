import React from 'react';
import Loadable from 'react-loadable';

const FrequencyFeathersLoadable = Loadable({
  loader: () => import('./Frequency' /* webpackChunkName: 'frequency' */).then(module => module.default),
  loading: () => <div>Loading</div>
});

export default FrequencyFeathersLoadable;
