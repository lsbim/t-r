import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
            rollupOptions: {
                output: {
                    manualChunks: {
                        'vendor-react': ['react', 'react-dom'],
                        'vendor-router': ['react-router-dom'],
                        'vendor-query': ['@tanstack/react-query'],
                        'vendor-chart': [
                            'chart.js',
                            'react-chartjs-2',
                            'chartjs-plugin-annotation',
                            'chartjs-plugin-datalabels',
                        ],
                        'vendor-motion': ['framer-motion'],
                        'vendor-ui': [
                            '@radix-ui/react-accordion',
                            '@radix-ui/react-slider',
                            'react-virtuoso',
                            'react-tooltip',
                            'react-helmet-async',
                        ],
                        'vendor-utils': ['es-hangul', 'es-toolkit'],
                    },
                },
            },
        },
        plugins: [
            react(),
        ],
        esbuild: {
            drop: ['debugger'],
        },
    };
});