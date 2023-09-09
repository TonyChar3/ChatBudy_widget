import { readFileSync } from 'fs';
import { resolve } from 'path';

export default {
    build: {
        manifest: true,
        rollupOptions: {
            input: {
            main: './main.js',
            assets: './asset.js'
            }
        }
    },
    plugins: [
        {
          name: 'manifest-customizer',
          writeBundle(_, bundle) {
            const manifestPath = resolve(__dirname, 'dist', 'manifest.json');
            try {
                const manifestData = JSON.parse(readFileSync(manifestPath, 'utf-8'));
                console.log('Manifest data:', manifestData);
                // Here, you can do further customization to your manifestData if needed.
                // Then write it back to the file or another file.
              } catch (err) {
                console.error('Could not read manifest:', err);
              }
          }
        }
      ]
}