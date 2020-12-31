# dev notes

## local dev

Using `npm link` leads to hooks issues (with React in both `node_modules`)

Linking manually the parent React turned out to be a solution:

```sh
> npm link @uralys/hookstores
> rm -rf node_modules/react
> ln -s ~/absolute/path/to/your/project/node_modules/react ~/absolute/path/to/hookstores/node_modules/react
```

then use rollup for every changes to `src`

```sh
> npm run build
```