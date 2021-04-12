# La Taverne

<a href="https://www.npmjs.com/package/taverne"><img src="https://img.shields.io/npm/v/taverne?color=%23123" alt="Current npm package version." /></a> <a href="https://www.npmjs.com/package/taverne"><img src="https://img.shields.io/github/license/uralys/taverne" alt="MIT" /></a> <a href="https://immerjs.github.io/immer/produce"><img src="https://img.shields.io/badge/immer-produce-5908d2.svg" alt="immer" /> </a>

`La Taverne` is an elementary [Flux](https://facebook.github.io/flux/docs/in-depth-overview) implementation to manage a global app state.

It provides an optional, yet easy integration with React using custom **hooks**.

<p align="center"><img  height="280px"  src="./docs/taverne.png"></p>

![action->dispatcher->store->view](https://facebook.github.io/flux/img/overview/flux-simple-f8-diagram-1300w.png)

## 🕵️ Demo

- Try live on <https://taverne.surge.sh/>
- Demo sources: <https://github.com/uralys/taverne-website>

## 📦 installation

```sh
> npm i --save taverne
```

## 🐿️ Instanciate your taverne with your barrels

Once your barrels are ready, you can instanciate your `taverne` and `dispatch`:

```js
import createLaTaverne from 'taverne';
import books from './barrels/books';
import potions from './barrels/potions';
import handcrafts from './barrels/handcrafts';

const {dispatch, taverne} = createLaTaverne({
  books,
  potions,
  handcrafts
});
```

## 🧬 Create a barrel

A "Barrel" is an `initialState` and a list of `reactions`.

```js
const ADD_BOOK = 'ADD_BOOK';

const addBook = {
  on: ADD_BOOK,
  reduce: (state, payload) => {
    const {book} = payload;
    state.entities.push(book);
  }
};

export default {
  initialState: {entities: []},
  reactions: [addBook]
};

export {ADD_BOOK};
```

## 🧚 Reactions

- A `reaction` will be triggered when an action is dispatched with `action.type` === `on`.

```js
const doSomethingWithThisBarrel = {
  on: 'ACTION_TYPE',
  reduce: (state, payload) => {
    /*
      Just update the state with your payload.
      Here, `state` is the draftState used by `Immer.produce`
      You taverne will then record your next immutable state.
    */
    state.foo = 'bar';
  },
  perform: (parameters, dispatch, getState) => {
    /*
      Optional sync or async function.
      It will be called before `reduce`

      When it is done, reduce will receive the result in
      the `payload` parameter.

      You can `dispatch` next steps from here as well
    */
  }
};
```

- `reduce` is called using `Immer`, so mutate the `state` exactly as you would with the `draftState` parameter in [produce](https://immerjs.github.io/immer/docs/produce).

- If you have some business to do before reducing, for example calling an API, use the `perform` function, either `sync` or `async`.

  Then `reduce` will be called with the result once it's done.

## 🎨 React integration

<a href="https://reactjs.org/docs/hooks-custom.html"><img src="https://img.shields.io/badge/react-hooks-5908d2.svg" alt="hooks" /></a>

`La Taverne` has a context Provider `<Taverne>` which provides 2 utilities:

- the `pour` hook to access your global state anywhere
- the `dispatch` function

```js
/* src/app.js */
import React from 'react';
import {render} from 'react-dom';
import {Taverne} from 'taverne/hooks';

render(
  <Taverne dispatch={dispatch} taverne={taverne}>
    <App id={id} />
  </Taverne>,
  container
);
```

```js
/* src/feature/books/container.js */
import {useTaverne} from 'taverne/hooks';

const BooksContainer = props => {
  const {dispatch, pour} = useTaverne();
  const books = pour('books');

  return <BooksComponent books={books} />;
};
```

See the complete React integration [steps here](docs/react.md).

You can "pour" specific parts of the "taverne", to allow [accurate local rendering](docs/react.md#-advanced-usage) from your global app state.

## 🔆 Middlewares

You can create more generic middlewares to operate any actions:

```js
const customMiddleware = {
  onCreate: taverne => {},
  onDispatch: (action, dispatch, getState, middleware) => {}
};
```

Then instanciate `La Taverne` with your list of middlewares as 2nd parameter:

```js
const {dispatch, taverne} = createLaTaverne(barrels, [customMiddleware]);
```

example: plugging the [redux devtools extension](https://github.com/reduxjs/redux-devtools) with this [middleware](src/middlewares/devtools.js)

## 🐛 Redux devtools

```js
import createLaTaverne from 'taverne';
import {devtools} from 'taverne/middlewares';
import books from './barrels/books';

const {dispatch, taverne} = createLaTaverne({books}, [devtools]);
```

## 🏗️ development

[![devDeps](https://david-dm.org/uralys/taverne/dev-status.svg)](https://david-dm.org/uralys/taverne?type=dev)
[![deps](https://david-dm.org/uralys/taverne/status.svg)](https://david-dm.org/uralys/taverne)

local dev [tips](docs/dev.md)

## 👋 about La Taverne

<a href="https://www.npmjs.com/package/taverne"><img src="https://img.shields.io/github/license/uralys/taverne" alt="MIT" /></a>

🎨 Tavern drawing: <https://www.deviantart.com/brandonstarr/art/Colored-Pirate-Tavern-210784171>
