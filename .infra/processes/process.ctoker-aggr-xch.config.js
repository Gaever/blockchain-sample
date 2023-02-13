require("dotenv").config();

module.exports = {
	apps: [
		{
			name: "ctocks-collect-xch",
			script: "node",
			args: "dist/src/main.js --service=collect",
			cwd: "./packages/ctocks",
			autorestart: true,
			// max_restarts: 3,
			restart_delay: 5000,
			env: {
				NODE_ENV: "production",
				POSTGRES: process.env.POSTGRES,
				CUR: "xch",
				FULLNODE_URI: process.env.FULLNODE_URI,
				SSL_CERT_PATH: process.env.SSL_CERT_PATH,
				SSL_KEY_PATH: process.env.SSL_KEY_PATH,
				STOCK_CONFIG_ADDRESS: process.env.STOCK_CONFIG_ADDRESS,
				SERVICE_NAME: "ctocks-collect-xch",
				LOG_LEVEL: process.env.LOG_LEVEL,
			},
		},
	],
};
