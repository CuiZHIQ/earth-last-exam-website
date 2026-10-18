// One explicit publication allowlist for both the builder and release checker.
export const pages = ['index.html', 'benchmark.html', 'typhoon.html', 'contribute.html'];
export const publicFiles = [...pages, 'styles.css', 'app.js', 'proposal.js', 'config.js', 'i18n.js',
  'favicon.svg', 'logo.svg', 'logo-light.svg', 'evolvent-wordmark.svg',
  'evolvent-symbol.svg', 'community-data.js', 'community.js', 'motion.js'];
export const generatedFiles = ['locales.js'];
export const assetGroups = {
  fonts: ['InterVariable.woff2', 'OFL.txt'],
  images: ['earth-epic.jpg', 'saola-viirs.jpg', 'lena-delta.jpg', 'barents-bloom.jpg',
    'zagros-folds.jpg', 'maysak-eye.jpg', 'elephant-foot-glacier.jpg',
    'typhoon-observed-tracks.svg', 'typhoon-observed-pressure.svg', 'CREDITS.md',
    'typhoon-ahi-b13.png', 'typhoon-tracks.png', 'typhoon-tracker-divergences.png', 'GSHHG-LICENSE.txt'],
};
export const expectedFiles = [...publicFiles, ...generatedFiles, '.nojekyll', ...Object.entries(assetGroups)
  .flatMap(([folder, files]) => [folder, ...files.map(file => `${folder}/${file}`)])];
