# отправить конфиг в hdd

POSTGRES="postgres://ctocker:password@localhost:15432/ctocker_broker" \
CUR="hdd" \
FULLNODE_URI="https://localhost:28555" \
SSL_CERT_PATH="/Users/gaever/Documents/chia-stock/certs/HDD_SSL_CERT.crt" \
SSL_KEY_PATH="/Users/gaever/Documents/chia-stock/certs/HDD_SSL_CERT.key" \
yarn dev \
 --tx-cur hdd \
 --tx-from hdd1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hshd0gh0 \
 --tx-to hdd1arexn7zcus7axqs25ydzpyfdq4qz5jpeqapt6knjzq56fdpt7x3s4pfnw6 \
 --tx-amount 1 \
 --tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a \
 --tx-stock-config-url http://localhost:8000/stock-1

POSTGRES="postgres://ctocker:password@localhost:15432/ctocker_broker" \
CUR="hdd" \
FULLNODE_URI="https://localhost:28555" \
SSL_CERT_PATH="/Users/gaever/Documents/chia-stock/certs/HDD_SSL_CERT.crt" \
SSL_KEY_PATH="/Users/gaever/Documents/chia-stock/certs/HDD_SSL_CERT.key" \
yarn dev \
 --tx-cur hdd \
 --tx-from hdd1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hshd0gh0 \
 --tx-to hdd1arexn7zcus7axqs25ydzpyfdq4qz5jpeqapt6knjzq56fdpt7x3s4pfnw6 \
 --tx-amount 1 \
 --tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a \
 --tx-stock-config-url http://localhost:8000/stock-2

<!-- - От какой суммы считается комисия? От начальной суммы ордера или от суммы сделки в новой валюте? -->

yarn dev \
 --tx-cur xch \
 --tx-from xch1arexn7zcus7axqs25ydzpyfdq4qz5jpeqapt6knjzq56fdpt7x3st93tf5 \
 --tx-to xch128lswtaq5wz85ray5k2f5ys57kup9cr68utgy7vcd302rjdks3aq0u4p03 \
 --tx-amount 15 \
 --tx-sk 36a0d8e35584a37faa0aee2b0710bd7b9b65a34986805a7cd9b35c361b8f9d68 \
 --tx-pk a0df82ade6a363f2d8ca38929f8e2162c84da6fa826daa000c1954b29db141424707691461fde15aef7b6799c2c9b66d

<!-- Client addr -->

xch1arexn7zcus7axqs25ydzpyfdq4qz5jpeqapt6knjzq56fdpt7x3st93tf5

<!-- Stock addr -->

xch128lswtaq5wz85ray5k2f5ys57kup9cr68utgy7vcd302rjdks3aq0u4p03

 <!-- from stock to client -->

--tx-sk 39062119b7b84760f61157fd70a98aef6b26d231ae68dbb28cc66a52c1a29146 \
 --tx-pk 83199b1a369d3ecb5c186a34ba8448a215aba6c68e2ef70069f72ab217b75e16202a274c8268a696537ea330fb2091fb

 <!-- from client to stock -->

--tx-sk 36a0d8e35584a37faa0aee2b0710bd7b9b65a34986805a7cd9b35c361b8f9d68 \
 --tx-pk a0df82ade6a363f2d8ca38929f8e2162c84da6fa826daa000c1954b29db141424707691461fde15aef7b6799c2c9b66d

yarn dev \
 --tx-cur ach \
 --tx-to ach1menckx5a77k2e4ekw9c4jh52ery9c0a8qzffrden4cyfuw4za49qdmyerm \
 --tx-from ach1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hss7xfna \
 --tx-amount 10 \
--tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a

 <!-- Client addr -->

ach1menckx5a77k2e4ekw9c4jh52ery9c0a8qzffrden4cyfuw4za49qdmyerm

 <!-- Stock addr -->

ach1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hss7xfna

 <!-- from stock to client -->

--tx-sk 0ac4aed8c24abaca4a0eb9575ed078d529b1c1a6adfc1b5e67f2929f51d476ec \
 --tx-pk b20a470699623f880786e09bfe240f909574ad8a8d1877d23ce83b4d7593690048266071bd379d5bcfa6b9e7fd34ba58

 <!-- from client to ctock -->

--tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a

yarn dev \
 --tx-cur xch \
 --tx-from xch1dpgd2u8yzstwd9jg6ddskzqxjclgcknyghs0pynhll9nv8aajsysxyutdv \
 --tx-to xch17303lsfldj2ar7t6ex24dmyjwkxxd2prv0yalpep0ux0x3k0m4vss5pyce \
 --tx-amount 3 \
 --tx-sk 2cfbc161ddef0baf53c65ecd065f4dd484d41843e0652cd9d39557fc88addcc4 \
 --tx-pk 8b99ae413c1a91335c8c5298a1be18f46684f22882fbea0842cbeeb8680874d1a15c7ccbe84f37c07f70add44f6c7d1c
