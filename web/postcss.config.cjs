// Keep configuration local so PostCSS does not inherit files above this app.
// Preserve Next.js's default CSS transforms and browser prefixing.
module.exports = {
  plugins: {
    'next/dist/compiled/postcss-flexbugs-fixes': {},
    'next/dist/compiled/postcss-preset-env': {
      autoprefixer: { flexbox: 'no-2009' },
      stage: 3,
      features: { 'custom-properties': false },
    },
  },
};
