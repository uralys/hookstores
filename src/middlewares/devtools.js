// -----------------------------------------------------------------------------

const logPrefix = '[La Taverne 🐛]';

// -----------------------------------------------------------------------------

const getNesting = (action = {}) => {
  if (!action.from) {
    return '';
  }

  return '──' + getNesting(action.from);
};

// -----------------------------------------------------------------------------

const createDevtools = taverne => {
  const extension = window && window.__REDUX_DEVTOOLS_EXTENSION__;

  if (!extension) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        '❌ Could not connect Redux devtools. \nTry to install and enable the extension'
      );
    }

    return;
  }

  const initialState = taverne.getState();
  const devtoolsInstance = extension.connect({maxAge: 100});
  devtoolsInstance.init(initialState);

  devtoolsInstance.subscribe(message => {
    if (message.type === 'DISPATCH' && message.state) {
      taverne.setState(JSON.parse(message.state));
    } else {
      console.log(`${logPrefix} monitor message not handled:`, message);
    }
  });

  devtoolsInstance.onDispatch = (action, dispatch, getState) => {
    let type = action.type;
    const {bypassDevtoolsState} = action.meta || {};

    const nesting = getNesting(action.from);
    type = `${action.from ? `└──${nesting}` : ''} ${type}`;

    devtoolsInstance.send(
      {
        ...action,
        type
      },
      bypassDevtoolsState ? 'bypassed for performance' : getState()
    );
  };

  console.log(`${logPrefix} Plugged Redux devtools`);
  return devtoolsInstance;
};

// -----------------------------------------------------------------------------

export default createDevtools;
