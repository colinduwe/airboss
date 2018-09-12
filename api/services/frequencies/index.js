// import _ from 'lodash';
import feathersNedb from 'feathers-nedb';
// import { SOCKET_KEY } from '@feathersjs/socketio';
import NeDB from 'nedb';
import hooks from './hooks';

export default function frequenciesService(app) {
  const options = {
    Model: new NeDB({
      filename: `${__dirname}/frequencies.nedb`,
      autoload: true
    }),
    paginate: {
      default: 25,
      max: 100
    }
  };

  app.use('/frequencies', feathersNedb(options));

  const service = app.service('frequencies');

  service.hooks(hooks);

  service.publish('created', () => app.channel('anonymous', 'authenticated'));
}
