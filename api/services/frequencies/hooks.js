import auth from '@feathersjs/authentication';
import local from '@feathersjs/authentication-local';
// import { restrictToOwner } from 'feathers-authentication-hooks';
import { fastJoin, disallow } from 'feathers-hooks-common';
import { required } from 'utils/validation';
import { validateHook as validate } from 'hooks';

const schemaValidator = {
  name: required,
  exercise: required,
  lowerBound: required,
  upperBound: required,
  spreadSpectrum: required
};

function joinResolvers(context) {
  const { app } = context;
  const users = app.service('users');

  return {
    joins: {
      author: () => async frequencies => {
        const author = frequencies.sentBy ? await users.get(frequencies.sentBy) : null;
        frequencies.author = author;
        return frequencies;
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

const frequenciesHooks = {
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
          lowerBound: context.data.lowerBound,
          upperBound: context.data.upperBound,
          spreadSpectrum: context.data.spreadSpectrum,
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
    patch: [], // joinAuthor,
    remove: []
  }
};

export default frequenciesHooks;
