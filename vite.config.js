import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';
import { resolve } from 'path';

export default defineConfig({
  plugins: [injectHTML()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        products: resolve(__dirname, 'products.html'),
        blog: resolve(__dirname, 'blog.html'),
        detail: resolve(__dirname, 'product-detail.html'),
        warranty: resolve(__dirname, 'policy-warranty.html'),
        delivery: resolve(__dirname, 'policy-delivery.html'),
        stores: resolve(__dirname, 'stores.html'),
        offers: resolve(__dirname, 'offers.html'),
        about: resolve(__dirname, 'about.html'),
        cart: resolve(__dirname, 'cart.html'),
        login: resolve(__dirname, 'login.html'),
        support: resolve(__dirname, 'support.html'),
        register: resolve(__dirname, 'register.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        profile: resolve(__dirname, 'profile.html'),
        addresses: resolve(__dirname, 'addresses.html'),
      },
    },
  },
});