import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  	plugins: [react()],
  	server: {
  	  	port: 3000,
  	  	// Get rid of the CORS error
  	  	proxy: {
  	  	  "/api": {
  	  	    target: "https://campus-connect-backend-t60k.onrender.com",
  	  	    changeOrigin: true,
  	  	    secure: false,
  	  	  },
  	  	},
  	},
  	optimizeDeps: {
  	  	include: ['styled-components'],
  	},
});
