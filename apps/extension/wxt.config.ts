import {defineConfig} from 'wxt';
import vue from '@vitejs/plugin-vue';

// See https://wxt.dev/api/config.html
export default defineConfig({
    manifest: {
        name: 'Linkos extension'
    },
    imports : {
        addons: {
            vueTemplate: true,
        },
    },
    vite    : () => ({
        plugins: [vue()],
    }),
});
