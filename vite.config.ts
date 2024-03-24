import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, type PluginOption } from "vite";
import Icons from "unplugin-icons/vite";
import { promises } from "fs";

// used to load fonts server side for thumbnail generation
function loadTTFAsArrayBuffer(): PluginOption {
	return {
		name: "load-ttf-as-array-buffer",
		async transform(_src, id) {
			if (id.endsWith(".ttf")) {
				return `export default new Uint8Array([
			${new Uint8Array(await promises.readFile(id))}
		  ]).buffer`;
			}
		},
	};
}

export default defineConfig({
	plugins: [
		sveltekit(),
		Icons({
			compiler: "svelte",
		}),
		loadTTFAsArrayBuffer(),
	],
	optimizeDeps: {
		include: ["browser-image-resizer", "uuid"],
	},
	server: {
	  cors: {
		origin: '*', // Allow all origins
		methods: ['GET', 'POST'], // You can adjust the methods as per your requirement
		allowedHeaders: ['Content-Type'], // Adjust headers as per your requirement
		credentials: true,
		exposedHeaders: ['*'], // Expose all headers
	  },
	  headers: {
		'Content-Security-Policy': "frame-ancestors *", // Allow embedding from any source
	  }
	}
  });
