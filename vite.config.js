import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function offlineShell() {
  return {
    name: 'noorhub-offline-shell',
    generateBundle(_options, bundle) {
      const builtAssets = Object.keys(bundle).filter((name) => name.startsWith('assets/') && /\.(js|css|woff2?|svg)$/.test(name));
      const shell = JSON.stringify(['/', '/manifest.webmanifest', '/favicon.svg', ...builtAssets.map((name) => `/${name}`)]);
      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: `const CACHE='noorhub-shell-v1';const SHELL=${shell};self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)));self.skipWaiting()});self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==self.location.origin)return;if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{if(x.ok)caches.open(CACHE).then(c=>c.put('/',x.clone()));return x}).catch(async()=>await caches.match('/')||Response.error()));return}if(u.pathname.startsWith('/assets/'))e.respondWith(caches.match(r).then(c=>c||fetch(r).then(x=>{if(x.ok)caches.open(CACHE).then(k=>k.put(r,x.clone()));return x})))})`,
      });
    },
  };
}
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), offlineShell()],
  // Use the automatic JSX runtime so components do not need to import React.
  esbuild: { jsx: 'automatic' },
})
