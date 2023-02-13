require("dotenv").config();

module.exports = {
	apps: [
		{
			name: "ctocks-api",
			script: "node",
			args: "dist/src/main.js",
			cwd: "./packages/web-api",
			autorestart: true,
			// max_restarts: 3,
			restart_delay: 5000,
			env: {
				NODE_ENV: "production",
				POSTGRES: process.env.POSTGRES,
				HTTP_PORT: 4000,
				WEBSOCKET_PORT: 4050,
				HOST: "0.0.0.0",
				SERVICE_NAME: "ctocks-api",
				LOG_LEVEL: process.env.LOG_LEVEL,
			},
		},
	],
};
