import { defineConfig } from 'rasengan';
import { rasengan } from 'rasengan/plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(async () => {
  return {
    ssr: false,
    prerender: true,
    vite: {
      plugins: [tailwindcss(), rasengan({})],
    },
  };
});
