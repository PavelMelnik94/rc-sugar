import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'components/ui/show/index': 'src/components/ui/show/index.ts',
    'components/iteration/for/index': 'src/components/iteration/for/index.ts',
    'components/iteration/repeat/index': 'src/components/iteration/repeat/index.ts',
    'components/utilities/debug/index': 'src/components/utilities/debug/index.ts',
    'components/interaction/tap/index': 'src/components/interaction/tap/index.ts',
    'components/performance/lazy/index': 'src/components/performance/lazy/index.ts',
    'components/performance/static/index': 'src/components/performance/static/index.ts',
    'components/animation/ticker/index': 'src/components/animation/ticker/index.ts',
    'components/performance/bound/index': 'src/components/performance/bound/index.ts',
    'components/state/cache/index': 'src/components/state/cache/index.ts',
    'components/ui/zoom/index': 'src/components/ui/zoom/index.ts',
    'components/ui/lock/index': 'src/components/ui/lock/index.ts',
    'components/state/toggle/index': 'src/components/state/toggle/index.ts',
    'components/interaction/focus/index': 'src/components/interaction/focus/index.ts',
    'components/ui/scroll/index': 'src/components/ui/scroll/index.ts',
    'components/ui/gate/index': 'src/components/ui/gate/index.ts',
    'components/utilities/compose/index': 'src/components/utilities/compose/index.ts',
    'components/state/live/index': 'src/components/state/live/index.ts',
    'components/state/atom/index': 'src/components/state/atom/index.ts',
    'components/utilities/mirror/index': 'src/components/utilities/mirror/index.ts',
    'components/utilities/experiment/index': 'src/components/utilities/experiment/index.ts',
    'components/animation/cycle/index': 'src/components/animation/cycle/index.ts',
    'components/navigation/micro-route/index': 'src/components/navigation/micro-route/index.ts',
    'components/interaction/gesture-pad/index': 'src/components/interaction/gesture-pad/index.ts'
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.jsx = 'automatic'
  }
})