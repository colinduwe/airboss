// import _ from 'lodash';
import feathersNedb from 'feathers-nedb';
// import { SOCKET_KEY } from '@feathersjs/socketio';
import NeDB from 'nedb';
import hooks from './hooks';

export default function exercisesService(app) {
  const options = {
    Model: new NeDB({
      filename: `${__dirname}/exercises.nedb`,
      autoload: true
    }),
    paginate: {
      default: 25,
      max: 100
    }
  };

  app.use('/exercises', feathersNedb(options));

  const service = app.service('exercises');

  service.hooks(hooks);

  service.publish('created', () => app.channel('anonymous', 'authenticated'));

  // service.publish('updateVisitors', () => app.channel('chat'));

  /*
  app.on('connection', connection => {
    const socket = connection[SOCKET_KEY];
    const chatChannel = app.channel('chat');

    socket.on('joinChat', () => {
      chatChannel.join(connection);
      updateVisitors(app);
    });

    socket.on('leaveChat', () => {
      chatChannel.leave(connection);
      updateVisitors(app);
    });

    socket.on('disconnect', () => {
      updateVisitors(app);
    });
  });
  */
}
