// organize-imports-ignore
require('dotenv').config({ path: '.test.env' });

import _set from 'lodash/set';
import fullnodeEnviroment from '@ctocker/lib/build/main/src/services/blockchain/fullnode-enviroment';

_set(process.env, 'LOG_LEVEL', 'silent');
_set(fullnodeEnviroment, `hdd.FULLNODE_URI`, process.env.HDD_FULLNODE_URI);
_set(fullnodeEnviroment, `hdd.SSL_CERT_PATH`, process.env.HDD_SSL_CERT_PATH);
_set(fullnodeEnviroment, `hdd.SSL_KEY_PATH`, process.env.HDD_SSL_KEY_PATH);
_set(fullnodeEnviroment, `hdd.STOCK_HOLDER_ADDRESS`, process.env.CUR1_STOCK_HOLDER_ADDRESS);
_set(fullnodeEnviroment, `hdd.KEY_STORAGE_PATH`, process.env.HDD_KEY_STORAGE_PATH);

_set(fullnodeEnviroment, `ach.FULLNODE_URI`, process.env.ACH_FULLNODE_URI);
_set(fullnodeEnviroment, `ach.SSL_CERT_PATH`, process.env.ACH_SSL_CERT_PATH);
_set(fullnodeEnviroment, `ach.SSL_KEY_PATH`, process.env.ACH_SSL_KEY_PATH);
_set(fullnodeEnviroment, `ach.STOCK_HOLDER_ADDRESS`, process.env.CUR2_STOCK_HOLDER_ADDRESS);
_set(fullnodeEnviroment, `ach.KEY_STORAGE_PATH`, process.env.ACH_KEY_STORAGE_PATH);

import './functional/broker.func.test';
