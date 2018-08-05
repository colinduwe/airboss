import React from 'react';
import Loadable from 'react-loadable';

const ExerciseFeathersLoadable = Loadable({
  loader: () => import('./Exercise' /* webpackChunkName: 'exercise' */).then(module => module.default),
  loading: () => <div>Loading</div>
});

export default ExerciseFeathersLoadable;
