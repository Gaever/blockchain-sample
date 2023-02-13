require("dotenv").config();

module.exports = {
	apps: [
		{
			name: "broker-match-2",
			script: "node",
			args: "dist/src/main.js --service=match",
			cwd: "./packages/broker",
			autorestart: true,
			// max_restarts: 3,
			restart_delay: 5000,
			env: {
				NODE_ENV: "production",
				POSTGRES: process.env.POSTGRES,
				STOCK_CONFIG_ID: 2,
				CUR1_STOCK_HOLDER_ADDRESS: process.env.CUR1_STOCK_HOLDER_ADDRESS,
				CUR2_STOCK_HOLDER_ADDRESS: process.env.CUR2_STOCK_HOLDER_ADDRESS,
				SERVICE_NAME: "broker-match-2",
				LOG_LEVEL: process.env.LOG_LEVEL,
			},
		},
	],
};
