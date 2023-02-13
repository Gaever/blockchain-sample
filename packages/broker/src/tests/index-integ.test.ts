// organize-imports-ignore
require('dotenv').config({ path: '.test.env' });

import _set from 'lodash/set';
import fullnodeEnviroment from '@ctocker/lib/build/main/src/services/blockchain/fullnode-enviroment';

_set(fullnodeEnviroment, `xch.FULLNODE_URI`, process.env.XCH_FULLNODE_URI);
_set(fullnodeEnviroment, `xch.SSL_CERT_PATH`, process.env.XCH_SSL_CERT_PATH);
_set(fullnodeEnviroment, `xch.SSL_KEY_PATH`, process.env.XCH_SSL_KEY_PATH);
_set(fullnodeEnviroment, `xch.STOCK_HOLDER_ADDRESS`, process.env.CUR1_STOCK_HOLDER_ADDRESS);
_set(fullnodeEnviroment, `xch.KEY_STORAGE_PATH`, process.env.XCH_KEY_STORAGE_PATH);

_set(fullnodeEnviroment, `ach.FULLNODE_URI`, process.env.ACH_FULLNODE_URI);
_set(fullnodeEnviroment, `ach.SSL_CERT_PATH`, process.env.ACH_SSL_CERT_PATH);
_set(fullnodeEnviroment, `ach.SSL_KEY_PATH`, process.env.ACH_SSL_KEY_PATH);
_set(fullnodeEnviroment, `ach.STOCK_HOLDER_ADDRESS`, process.env.CUR2_STOCK_HOLDER_ADDRESS);
_set(fullnodeEnviroment, `ach.KEY_STORAGE_PATH`, process.env.ACH_KEY_STORAGE_PATH);

// import './integration/broker.integ.test.ts.bak';
