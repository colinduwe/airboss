// import _ from 'lodash';
import feathersNedb from 'feathers-nedb';
// import { SOCKET_KEY } from '@feathersjs/socketio';
import NeDB from 'nedb';
import hooks from './hooks';

export default function aircraftService(app) {
  const options = {
    Model: new NeDB({
      filename: `${__dirname}/aircraft.nedb`,
      autoload: true
    }),
    paginate: {
      default: 25,
      max: 100
    }
  };

  app.use('/aircraft', feathersNedb(options));

  const service = app.service('aircraft');

  service.hooks(hooks);

  service.publish('created', () => app.channel('anonymous', 'authenticated'));
}
