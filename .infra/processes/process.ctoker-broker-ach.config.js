require("dotenv").config();

module.exports = {
	apps: [
		{
			name: "broker-collect-ach",
			script: "node",
			args: "dist/src/main.js --service=collect",
			cwd: "./packages/broker",
			autorestart: true,
			// max_restarts: 3,
			restart_delay: 5000,
			env: {
				NODE_ENV: "production",
				CUR: "ach",
				POSTGRES: process.env.POSTGRES,
				FULLNODE_URI: process.env.FULLNODE_URI,
				SSL_CERT_PATH: process.env.SSL_CERT_PATH,
				SSL_KEY_PATH: process.env.SSL_KEY_PATH,
				STOCK_HOLDER_ADDRESS: process.env.STOCK_HOLDER_ADDRESS,
				SERVICE_NAME: "broker-collect-ach",
				LOG_LEVEL: process.env.LOG_LEVEL,
			},
		},
		{
			name: "broker-payout-ach",
			script: "node",
			args: "dist/src/main.js --service=payout",
			cwd: "./packages/broker",
			autorestart: true,
			// max_restarts: 3,
			restart_delay: 5000,
			env: {
				NODE_ENV: "production",
				CUR: "ach",
				POSTGRES: process.env.POSTGRES,
				KEY_STORAGE_PATH: process.env.KEY_STORAGE_PATH,
				FULLNODE_URI: process.env.FULLNODE_URI,
				SSL_CERT_PATH: process.env.SSL_CERT_PATH,
				SSL_KEY_PATH: process.env.SSL_KEY_PATH,
				SERVICE_NAME: "broker-payout-ach",
				LOG_LEVEL: process.env.LOG_LEVEL,
			},
		},
	],
};
