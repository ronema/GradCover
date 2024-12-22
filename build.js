const esbuild = require('esbuild');

async function build() {
  try {
    const result = await esbuild.build({
      entryPoints: ['code.ts'],
      bundle: true,
      outfile: 'code.js',
      target: 'es6',
      format: 'iife',
      plugins: [],
      logLevel: 'info',
    });
    console.log('Build completed:', result);
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
