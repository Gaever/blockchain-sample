// https://github.com/CMEONE/chia-utils/blob/f7a1f7bea19164f994fb213d97fef461a04e4d58/chia-utils.js

const CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';

function ord(str) {
  return str.charCodeAt(0);
}

function bech32_hrp_expand(hrp) {
  let arr = [];
  for (let x in hrp) {
    x = hrp[x];
    arr.push(ord(x) >> 5);
  }
  arr.push(0);
  for (let x in hrp) {
    x = hrp[x];
    arr.push(ord(x) & 31);
  }
  return arr;
}

function bech32_polymod(values) {
  let generator = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
  let chk = 1;
  for (let value in values) {
    value = values[value];
    let top = chk >> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ value;
    for (let i = 0; i < 5; i++) {
      if ((top >> i) & 1) {
        chk ^= generator[i];
      } else {
        chk ^= 0;
      }
    }
  }
  return chk;
}

function bech32_create_checksum(hrp, data) {
  let values = bech32_hrp_expand(hrp).concat(data);
  let polymod = bech32_polymod(values.concat([0, 0, 0, 0, 0, 0])) ^ M;
  let arr = [];
  for (let i = 0; i < 6; i++) {
    arr.push((polymod >> (5 * (5 - i))) & 31);
  }
  return arr;
}

function bech32_encode(hrp, data) {
  let combined = data.concat(bech32_create_checksum(hrp, data));
  let arr = [hrp, '1'];
  for (let d in combined) {
    d = combined[d];
    arr.push(CHARSET[d]);
  }
  return arr.join('');
}

function convertbits(data, frombits, tobits, pad = true) {
  let acc = 0;
  let bits = 0;
  let ret = [];
  let maxv = (1 << tobits) - 1;
  let max_acc = (1 << (frombits + tobits - 1)) - 1;
  for (let value in data) {
    value = data[value];
    if (value < 0 || value >> frombits) {
      throw 'Invalid Value';
    }
    acc = ((acc << frombits) | value) & max_acc;
    bits += frombits;
    while (bits >= tobits) {
      bits -= tobits;
      ret.push((acc >> bits) & maxv);
    }
  }
  if (pad) {
    if (bits) {
      ret.push((acc << (tobits - bits)) & maxv);
    }
  } else if (bits >= frombits || (acc << (tobits - bits)) & maxv) {
    throw 'Invalid bits';
  }
  return ret;
}

function encode_puzzle_hash(puzzle_hash, prefix) {
  const encoded = bech32_encode(prefix, convertbits(puzzle_hash, 8, 5));
  return encoded;
}

function hex_to_bytes(hex) {
  if (hex == null) {
    throw 'Argument hex of method hex_to_bytes is required and does not have a default value.';
  }
  let bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function bytes_to_hex(bytes) {
  if (bytes == null) {
    throw 'Argument bytes of method bytes_to_hex is required and does not have a default value.';
  }
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    if (bytes[i].toString(16).length == 0) {
      hex += '00';
    } else if (bytes[i].toString(16).length == 1) {
      hex += '0' + bytes[i].toString(16);
    } else {
      hex += bytes[i].toString(16);
    }
  }
  return hex;
}

function any(iterable) {
  for (let i = 0; i < iterable.length; i++) {
    if (iterable[i]) {
      return true;
    }
  }
  return false;
}

function all(iterable) {
  for (let i = 0; i < iterable.length; i++) {
    if (!iterable[i]) {
      return false;
    }
  }
  return true;
}

const M = 0x2bc830a3;

function bech32_verify_checksum(hrp, data) {
  return bech32_polymod(bech32_hrp_expand(hrp).concat(data)) == M;
}

function bech32_decode(bech) {
  let arr = [];
  for (let x in bech) {
    x = bech[x];
    arr.push(ord(x) < 33 || ord(x) > 126);
  }
  if (any(arr) || bech.toLowerCase() != bech) {
    return [null, null];
  }
  bech = bech.toLowerCase();
  let pos = bech.lastIndexOf('1');
  if (pos < 1 || pos + 7 > bech.length || bech.length > 90) {
    return [null, null];
  }
  arr = [];
  for (let x in bech.slice(pos + 1)) {
    x = bech.slice(pos + 1)[x];
    arr.push(CHARSET.includes(x));
  }
  if (!all(arr)) {
    return [null, null];
  }
  let hrp = bech.slice(0, pos);
  let data = [];
  for (let x in bech.slice(pos + 1)) {
    x = bech.slice(pos + 1)[x];
    data.push(CHARSET.indexOf(x));
  }
  if (!bech32_verify_checksum(hrp, data)) {
    return [null, null];
  }
  return [hrp, data.slice(0, data.length - 6)];
}

function decode_puzzle_hash(address) {
  let d = bech32_decode(address);
  let hrpgot = d[0];
  let data = d[1];
  if (data == null) {
    throw 'Invalid Address';
  }
  let decoded = convertbits(data, 5, 8, false);
  return decoded;
}

export function puzzle_hash_to_address(puzzle_hash, prefix) {
  if (puzzle_hash.indexOf('0x') == 0) {
    puzzle_hash = puzzle_hash.substring(2);
  }
  return encode_puzzle_hash(hex_to_bytes(puzzle_hash), prefix);
}

export function address_to_puzzle_hash(address) {
  return '0x' + bytes_to_hex(decode_puzzle_hash(address));
}
