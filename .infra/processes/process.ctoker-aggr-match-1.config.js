require("dotenv").config();

module.exports = {
	apps: [
		{
			name: "ctocks-match-1",
			script: "node",
			args: "dist/src/main.js --service=match",
			cwd: "./packages/ctocks",
			autorestart: true,
			// max_restarts: 3,
			restart_delay: 5000,
			env: {
				NODE_ENV: "production",
				POSTGRES: process.env.POSTGRES,
				STOCK_CONFIG_ID: 3,
				SERVICE_NAME: "ctocks-match-1",
				LOG_LEVEL: process.env.LOG_LEVEL,
			},
		},
	],
};
