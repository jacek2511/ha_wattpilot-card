import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/wattpilot-card.ts',
  output: {
    file: 'dist/wattpilot-card.js',
    format: 'es',
    sourcemap: false,
    inlineDynamicImports: true,
  },
  external: [
    'lit',
    'lit/decorators.js',
    'lit/directive.js',
    'lit/directives/style-map.js',
    'lit/directives/class-map.js'
  ],
  plugins: [
    resolve({
      browser: true,
    }),
    typescript({
      declaration: false,
    }),
    terser({
      format: { comments: false },
    })
  ]
};
