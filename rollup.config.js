// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'app.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'CharacterSheetApp',
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    typescript({
      tsconfig: './tsconfig.json'
    })
  ]
};
