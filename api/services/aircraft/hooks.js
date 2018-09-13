import auth from '@feathersjs/authentication';
import local from '@feathersjs/authentication-local';
// import { restrictToOwner } from 'feathers-authentication-hooks';
import { fastJoin, disallow } from 'feathers-hooks-common';
import { required } from 'utils/validation';
import { validateHook as validate } from 'hooks';

const schemaValidator = {
  name: required
};

function joinResolvers(context) {
  const { app } = context;
  const users = app.service('users');

  return {
    joins: {
      author: () => async aircraft => {
        const author = aircraft.sentBy ? await users.get(aircraft.sentBy) : null;
        aircraft.author = author;
        return aircraft;
      }
    }
  };
}

const joinAuthor = [
  fastJoin(joinResolvers, {
    author: true
  }),
  local.hooks.protect('author.password')
];

const aircraftHooks = {
  before: {
    all: [auth.hooks.authenticate('jwt')],
    find: [],
    get: [],
    create: [
      validate(schemaValidator),
      context => {
        context.data = {
          name: context.data.name,
          sentBy: context.params.user ? context.params.user._id : null, // Set the id of current user
          createdAt: new Date(),
          exercise: context.data.exercise,
          status: false,
          log: []
        };
      }
    ],
    update: disallow(),
    /* patch: [
      auth.hooks.authenticate('jwt'),
      restrictToOwner({ ownerField: 'sentBy' }),
      iff(isProvider('external'), keep('text'))
    ], */
    patch: [],
    remove: disallow()
  },
  after: {
    all: [],
    find: joinAuthor,
    get: joinAuthor,
    create: joinAuthor,
    update: [],
    patch: [],
    remove: []
  }
};

export default aircraftHooks;
