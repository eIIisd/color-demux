import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/main.js',
  output: {
    format: 'esm',
    name: 'colorDemux',
    file: 'dist/colorDemux.js',
  },
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    terser(),
  ]
};
