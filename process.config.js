const POSTGRES_BROKER =
	"postgres://ctocker:password@localhost:15432/ctocker_broker";
const POSTGRES_CTOCKS = "postgres://ctocker:password@localhost:15432/ctocks";

const XCH_FULLNODE_URI = "https://localhost:18855";
const ACH_FULLNODE_URI = "https://localhost:19965";
const HDD_FULLNODE_URI = "https://localhost:28555";

const XCH_SSL_CERT_PATH =
	"/Users/gaever/Documents/chia-stock/certs/XCH_SSL_CERT.crt";
const XCH_SSL_KEY_PATH =
	"/Users/gaever/Documents/chia-stock/certs/XCH_SSL_CERT.key";
const ACH_SSL_CERT_PATH =
	"/Users/gaever/Documents/chia-stock/certs/ACH_SSL_CERT.crt";
const ACH_SSL_KEY_PATH =
	"/Users/gaever/Documents/chia-stock/certs/ACH_SSL_CERT.key";
const HDD_SSL_CERT_PATH =
	"/Users/gaever/Documents/chia-stock/certs/HDD_SSL_CERT.crt";
const HDD_SSL_KEY_PATH =
	"/Users/gaever/Documents/chia-stock/certs/HDD_SSL_CERT.key";

const XCH_STOCK_HOLDER_ADDRESS =
	"xch1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hsffhssp";
const ACH_STOCK_HOLDER_ADDRESS =
	"ach1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hss7xfna";
const HDD_STOCK_HOLDER_ADDRESS =
	"hdd1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hshd0gh0";

const XCH_KEY_STORAGE_PATH =
	"/Users/gaever/Documents/chia-stock/config/xch_heavy_1_keychain.json";
const ACH_KEY_STORAGE_PATH =
	"/Users/gaever/Documents/chia-stock/config/ach_heavy_2_keychain.json /Users/gaever/Documents/chia-stock/config/ach_heavy_3_keychain.json";
const HDD_KEY_STORAGE_PATH =
	"/Users/gaever/Documents/chia-stock/config/hdd_heavy_4_keychain.json";

const stockBrokerAchHddId = 516;
const stockBrokerXchAchId = 517;

const stockCtocksAchHddId = 82;
const stockCtocksXchAchId = 83;

module.exports = {
	apps: [
		// {
		// 	name: "broker-collect-xch",
		// 	script: "node",
		// 	args: "dist/src/main.js --service=collect",
		// 	cwd: "./packages/broker",
		// 	autorestart: false,
		// 	env: {
		// 		LOG_LEVEL: "info",
		// 		NODE_ENV: "production",
		// 		CUR: "xch",
		// 		POSTGRES: POSTGRES_BROKER,
		// 		FULLNODE_URI: XCH_FULLNODE_URI,
		// 		SSL_CERT_PATH: XCH_SSL_CERT_PATH,
		// 		SSL_KEY_PATH: XCH_SSL_KEY_PATH,
		// 		STOCK_HOLDER_ADDRESS: XCH_STOCK_HOLDER_ADDRESS,
		// 	},
		// },
		{
			name: "broker-collect-ach",
			script: "yarn",
			args: "dev --service=collect",
			interpreter: "/bin/bash",
			cwd: "./packages/broker",
			autorestart: false,
			env: {
				LOG_LEVEL: "debug",
				NODE_ENV: "development",
				CUR: "ach",
				POSTGRES: POSTGRES_BROKER,
				FULLNODE_URI: ACH_FULLNODE_URI,
				SSL_CERT_PATH: ACH_SSL_CERT_PATH,
				SSL_KEY_PATH: ACH_SSL_KEY_PATH,
				STOCK_HOLDER_ADDRESS: ACH_STOCK_HOLDER_ADDRESS,
				SERVICE_NAME: "broker-collect-ach",
			},
		},
		{
			name: "broker-collect-hdd",
			script: "yarn",
			args: "start --service=collect",
			interpreter: "/bin/bash",
			cwd: "./packages/broker",
			autorestart: false,
			env: {
				NODE_ENV: "production",
				LOG_LEVEL: "info",
				CUR: "hdd",
				POSTGRES: POSTGRES_BROKER,
				FULLNODE_URI: HDD_FULLNODE_URI,
				SSL_CERT_PATH: HDD_SSL_CERT_PATH,
				SSL_KEY_PATH: HDD_SSL_KEY_PATH,
				STOCK_HOLDER_ADDRESS: HDD_STOCK_HOLDER_ADDRESS,
			},
		},
		// {
		// 	name: "broker-payout-xch",
		// 	script: "yarn",
		// 	args: "start --service=payout",
		// 	interpreter: "/bin/bash",
		// 	cwd: "./packages/broker",
		// 	autorestart: false,
		// 	env: {
		// 		NODE_ENV: "production",
		// 		LOG_LEVEL: "info",
		// 		CUR: "xch",
		// 		POSTGRES: POSTGRES_BROKER,
		// 		KEY_STORAGE_PATH: XCH_KEY_STORAGE_PATH,
		// 		FULLNODE_URI: XCH_FULLNODE_URI,
		// 		SSL_CERT_PATH: XCH_SSL_CERT_PATH,
		// 		SSL_KEY_PATH: XCH_SSL_KEY_PATH,
		// 	},
		// },
		{
			name: "broker-payout-ach",
			script: "yarn",
			args: "start --service=payout",
			interpreter: "/bin/bash",
			cwd: "./packages/broker",
			autorestart: false,
			env: {
				LOG_LEVEL: "info",
				NODE_ENV: "production",
				CUR: "ach",
				POSTGRES: POSTGRES_BROKER,
				KEY_STORAGE_PATH: ACH_KEY_STORAGE_PATH,
				FULLNODE_URI: ACH_FULLNODE_URI,
				SSL_CERT_PATH: ACH_SSL_CERT_PATH,
				SSL_KEY_PATH: ACH_SSL_KEY_PATH,
			},
		},

		{
			name: "broker-payout-hdd",
			script: "yarn",
			args: "start --service=payout",
			interpreter: "/bin/bash",
			cwd: "./packages/broker",
			autorestart: false,
			env: {
				NODE_ENV: "production",
				LOG_LEVEL: "info",
				CUR: "hdd",
				POSTGRES: POSTGRES_BROKER,
				KEY_STORAGE_PATH: HDD_KEY_STORAGE_PATH,
				FULLNODE_URI: HDD_FULLNODE_URI,
				SSL_CERT_PATH: HDD_SSL_CERT_PATH,
				SSL_KEY_PATH: HDD_SSL_KEY_PATH,
			},
		},

		{
			name: "broker-match-1",
			script: "yarn",
			args: "start --service=match",
			interpreter: "/bin/bash",
			cwd: "./packages/broker",
			autorestart: false,
			env: {
				NODE_ENV: "production",
				LOG_LEVEL: "info",
				POSTGRES: POSTGRES_BROKER,
				STOCK_CONFIG_ID: stockBrokerAchHddId,
				CUR1_STOCK_HOLDER_ADDRESS: ACH_STOCK_HOLDER_ADDRESS,
				CUR2_STOCK_HOLDER_ADDRESS: HDD_STOCK_HOLDER_ADDRESS,
			},
		},

		// {
		// 	name: "broker-match-2",
		// 	script: "yarn",
		// 	args: "start --service=match",
		// 	interpreter: "/bin/bash",
		// 	cwd: "./packages/broker",
		// 	autorestart: false,
		// 	env: {
		// 		NODE_ENV: "production",
		// 		LOG_LEVEL: "info",
		// 		POSTGRES: POSTGRES_BROKER,
		// 		STOCK_CONFIG_ID: stockBrokerXchAchId,
		// 		CUR1_STOCK_HOLDER_ADDRESS: XCH_STOCK_HOLDER_ADDRESS,
		// 		CUR2_STOCK_HOLDER_ADDRESS: ACH_STOCK_HOLDER_ADDRESS,
		// 	},
		// },

		// {
		// 	name: "ctocks-collect-xch",
		// 	script: "yarn",
		// 	args: "start --service=collect",
		// 	interpreter: "/bin/bash",
		// 	cwd: "./packages/ctocks",
		// 	autorestart: false,
		// 	env: {
		// 		LOG_LEVEL: "info",
		// 		POSTGRES: POSTGRES_CTOCKS,
		// 		CUR: "xch",
		// 		FULLNODE_URI: XCH_FULLNODE_URI,
		// 		SSL_CERT_PATH: XCH_SSL_CERT_PATH,
		// 		SSL_KEY_PATH: XCH_SSL_KEY_PATH,
		// 		// STOCK_CONFIG_ADDRESS:
		// 		// 	"xch1arexn7zcus7axqs25ydzpyfdq4qz5jpeqapt6knjzq56fdpt7x3st93tf5",
		// 	},
		// },
		{
			name: "ctocks-collect-ach",
			script: "yarn",
			args: "start --service=collect",
			interpreter: "/bin/bash",
			cwd: "./packages/ctocks",
			autorestart: false,
			env: {
				NODE_ENV: "production",
				LOG_LEVEL: "info",
				POSTGRES: POSTGRES_CTOCKS,
				CUR: "ach",
				FULLNODE_URI: ACH_FULLNODE_URI,
				SSL_CERT_PATH: ACH_SSL_CERT_PATH,
				SSL_KEY_PATH: ACH_SSL_KEY_PATH,
			},
		},

		{
			name: "ctocks-collect-hdd",
			script: "yarn",
			args: "start --service=collect",
			interpreter: "/bin/bash",
			cwd: "./packages/ctocks",
			autorestart: false,
			env: {
				NODE_ENV: "production",
				LOG_LEVEL: "info",
				POSTGRES: POSTGRES_CTOCKS,
				CUR: "hdd",
				FULLNODE_URI: HDD_FULLNODE_URI,
				SSL_CERT_PATH: HDD_SSL_CERT_PATH,
				SSL_KEY_PATH: HDD_SSL_KEY_PATH,
				STOCK_CONFIG_ADDRESS:
					"hdd1arexn7zcus7axqs25ydzpyfdq4qz5jpeqapt6knjzq56fdpt7x3s4pfnw6",
			},
		},

		{
			name: "ctocks-match-1",
			script: "yarn",
			args: "start --service=match",
			interpreter: "/bin/bash",
			cwd: "./packages/ctocks",
			autorestart: false,
			env: {
				NODE_ENV: "production",
				LOG_LEVEL: "info",
				STOCK_CONFIG_ID: stockCtocksAchHddId,
				POSTGRES: POSTGRES_CTOCKS,
			},
		},

		// {
		// 	name: "ctocks-match-2",
		// 	script: "yarn",
		// 	args: "start --service=match",
		// 	interpreter: "/bin/bash",
		// 	cwd: "./packages/ctocks",
		// 	autorestart: false,
		// 	env: {
		// 		NODE_ENV: "production",
		// 		LOG_LEVEL: "info",
		// 		STOCK_CONFIG_ID: stockCtocksXchAchId,
		// 		POSTGRES: POSTGRES_CTOCKS
		// 	},
		// },

		{
			name: "ctocks-api",
			script: "yarn",
			args: "dev",
			interpreter: "/bin/bash",
			cwd: "./packages/web-api",
			autorestart: false,
			env: {
				NODE_ENV: "production",
				LOG_LEVEL: "debug",
				POSTGRES: POSTGRES_CTOCKS,
				HTTP_PORT: 4000,
				WEBSOCKET_PORT: 4050,
			},
		},
	],
};
