import babel from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'

const extensions = ['.ts', '.js']

export default [
  {
    input: 'src/adapter/typeorm/dev-data-source.ts',
    output: {
      dir: 'src/adapter/typeorm/dist',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    plugins: [
      babel({
        babelrc: false,
        extensions,
        presets: [['@babel/preset-env', { modules: false }]],
      }),
      typescript({
        module: 'esnext',
        outDir: 'src/adapter/typeorm/dist',
      }),
    ],
  },
]
