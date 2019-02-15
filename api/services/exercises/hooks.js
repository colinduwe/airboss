import auth from '@feathersjs/authentication';
import local from '@feathersjs/authentication-local';
// import { restrictToOwner } from 'feathers-authentication-hooks';
import { fastJoin, disallow } from 'feathers-hooks-common';
import { required, nonEmptyArray } from 'utils/validation';
import { validateHook as validate } from 'hooks';

const schemaValidator = {
  text: required,
  locations: nonEmptyArray
};

function joinResolvers(context) {
  const { app } = context;
  const users = app.service('users');

  return {
    joins: {
      author: () => async exercise => {
        const author = exercise.sentBy ? await users.get(exercise.sentBy) : null;
        exercise.author = author;
        return exercise;
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

const exerciseHooks = {
  before: {
    all: [auth.hooks.authenticate('jwt')],
    find: [],
    get: [],
    create: [
      validate(schemaValidator),
      context => {
        context.data = {
          text: context.data.text,
          sentBy: context.params.user ? context.params.user._id : null, // Set the id of current user
          createdAt: new Date(),
          locations: context.data.locations,
          startDate: context.data.startDate,
          endDate: context.data.endDate
        };
      }
    ],
    update: disallow(),
    patch: [validate(schemaValidator)],
    /* patch: [
      auth.hooks.authenticate('jwt'),
      restrictToOwner({ ownerField: 'sentBy' }),
      iff(isProvider('external'), keep('text'))
    ], */
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

export default exerciseHooks;
