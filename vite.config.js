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
        source: `const CACHE='noorhub-shell-v1';const SHELL=${shell};
const cacheCopy=(event,key,response)=>{if(!response.ok)return;try{const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(key,copy)).catch(()=>{}))}catch{}};
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))));self.clients.claim()});
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==self.location.origin)return;if(request.mode==='navigate'){event.respondWith(fetch(request).then(response=>{cacheCopy(event,'/',response);return response}).catch(async()=>await caches.match('/')||Response.error()));return}if(url.pathname.startsWith('/assets/'))event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{cacheCopy(event,request,response);return response})))})`,
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
