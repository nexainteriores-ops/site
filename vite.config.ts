import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

const inlineCssPlugin = () => {
  return {
    name: 'inline-css',
    enforce: 'post',
    generateBundle(options, bundle) {
      const cssFiles = Object.keys(bundle).filter(fileName => fileName.endsWith('.css'));
      const htmlFile = Object.keys(bundle).find(fileName => fileName.endsWith('.html'));
      
      if (htmlFile && cssFiles.length > 0) {
        let htmlContent = bundle[htmlFile].source;
        cssFiles.forEach(cssFile => {
          const cssContent = bundle[cssFile].source;
          // remove the `<link rel="stylesheet">`
          htmlContent = htmlContent.replace(new RegExp(`<link[^>]*href="[^"]*${cssFile}"[^>]*>`), '');
          // inject `<style>`
          htmlContent = htmlContent.replace('</head>', `<style>${cssContent}</style></head>`);
        });
        bundle[htmlFile].source = htmlContent;
        // Optionally delete the CSS files if they are not needed
        cssFiles.forEach(cssFile => delete bundle[cssFile]);
      }
    }
  }
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), inlineCssPlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-motion': ['motion/react'],
            'vendor-lucide': ['lucide-react'],
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
