require("dotenv").config();

module.exports = {
	apps: [
		{
			name: "ctocks-match-2",
			script: "node",
			args: "dist/src/main.js --service=match",
			cwd: "./packages/ctocks",
			autorestart: true,
			// max_restarts: 3,
			restart_delay: 5000,
			env: {
				NODE_ENV: "production",
				POSTGRES: process.env.POSTGRES,
				STOCK_CONFIG_ID: 2,
				SERVICE_NAME: "ctocks-match-2",
				LOG_LEVEL: process.env.LOG_LEVEL,
			},
		},
	],
};
