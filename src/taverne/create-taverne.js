// -----------------------------------------------------------------------------

import {produce} from 'immer';
import get from '../lib/get';

// -----------------------------------------------------------------------------

const processReactions = (
  action,
  reactions,
  applyReducing,
  dispatch,
  getState
) => {
  const {type, payload} = action;

  reactions.forEach(({on, perform, reduce}) => {
    if (on === type) {
      if (typeof perform === 'function') {
        const result = perform(payload, dispatch, getState);
        if (result && result.then) {
          result.then(asyncResult => {
            applyReducing(reduce, asyncResult);
            dispatch({type: `${type}/success`, payload: asyncResult});
          });
        } else {
          applyReducing(reduce, result);
        }
      } else {
        applyReducing(reduce, payload);
      }
    }
  });
};

// -----------------------------------------------------------------------------

const createReducing = (nestedPath, getState, setState) =>
  function applyReducing(reduce, payload) {
    if (!reduce) {
      return;
    }

    const currentStoreState = getState();
    const previousNestedState = get(nestedPath, currentStoreState);
    const newNestedState = produce(previousNestedState, draftState =>
      reduce(draftState, payload)
    );

    setState(newNestedState, nestedPath);
  };

// -----------------------------------------------------------------------------

const createTaverne = barrels => {
  const initialState = Object.keys(barrels).reduce(
    (acc, key) => ({
      ...acc,
      [key]: barrels[key].initialState
    }),
    {}
  );

  // -------------------------------------------------

  let state = initialState;
  const subscriptions = [];

  // -------------------------------------------------

  const getState = () => state;
  const setState = (newState, nestedPath) => {
    const previousState = {...getState()};

    if (nestedPath) {
      state[nestedPath] = newState;
    } else {
      state = newState;
    }

    subscriptions.forEach(onUpdate => {
      onUpdate(state, previousState);
    });
  };

  // -------------------------------------------------

  const taverne = {
    initialState,
    getState,
    setState,
    onDispatch: (action, dispatch, getState) => {
      Object.keys(barrels).forEach(key => {
        const applyReducing = createReducing(key, getState, setState);
        const {reactions} = barrels[key];
        processReactions(action, reactions, applyReducing, dispatch, getState);
      });
    },
    subscribe: subscription => {
      subscriptions.push(subscription);
    },
    unsubscribe: subscription => {
      subscriptions.splice(subscriptions.indexOf(subscription), 1);
    },
    debug: () => ({
      state,
      subscriptions
    })
  };

  return taverne;
};

// -----------------------------------------------------------------------------

export default createTaverne;