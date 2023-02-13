import { log } from '@/log';
import { FullnodeEnv } from '@/types/blockchain';
import autoBind from 'auto-bind';
import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import fs from 'fs';
import { Agent } from 'https';

class FullNodeRequest {
  private fullnodeAxiosInstance: AxiosInstance = null;
  private walletAxiosInstance: AxiosInstance = null;

  constructor(enviroment: FullnodeEnv) {
    autoBind(this);

    this.fullnodeAxiosInstance = this.createFullnodeAxios(enviroment);
    if (process.env[`${enviroment.currency.toUpperCase()}_WALLET_URI`]) {
      this.walletAxiosInstance = this.createWalletAxios(enviroment);
    }
  }

  private createFullnodeAxios(fullnodeEnv: FullnodeEnv): AxiosInstance {
    const cert = (fullnodeEnv.SSL_CERT_PATH && fs.readFileSync(fullnodeEnv.SSL_CERT_PATH)) || '';
    const key = (fullnodeEnv.SSL_KEY_PATH && fs.readFileSync(fullnodeEnv.SSL_KEY_PATH)) || '';
    const instance = axios.create({
      baseURL: `${fullnodeEnv.FULLNODE_URI}`,
      httpsAgent: new Agent({
        cert,
        key,
        rejectUnauthorized: false,
      }),
      timeout: 60000,
    });

    // @ts-ignore
    axiosRetry(instance, { retries: 3 });

    return instance;
  }

  private createWalletAxios(fullnodeEnv: FullnodeEnv): AxiosInstance {
    const cert = (fullnodeEnv.SSL_CERT_PATH && fs.readFileSync(fullnodeEnv.SSL_CERT_PATH)) || '';
    const key = (fullnodeEnv.SSL_KEY_PATH && fs.readFileSync(fullnodeEnv.SSL_KEY_PATH)) || '';

    return axios.create({
      baseURL: process.env[`${fullnodeEnv.currency.toUpperCase()}_WALLET_URI`],
      httpsAgent: new Agent({
        cert,
        key,
        rejectUnauthorized: false,
      }),
      timeout: 5000,
    });
  }

  public async http(route: string, body: any) {
    log.silly('REQ: route %s body %O', route, body);
    const { data } = await this.fullnodeAxiosInstance.post(route, body);
    if (data?.error || data?.success !== true) {
      log.silly('RES: [ERROR] route %s data %O', route, data);
      throw new Error(JSON.stringify(data) || `request to ${route} with params ${JSON.stringify(body)} failed. ${JSON.stringify(data)}`);
    }
    log.silly('RES: [SUCCESS] route %s data %O', route, data);
    return data;
  }

  public async walletHttp(route: string, body: any) {
    const { data } = await this.walletAxiosInstance.post(route, body);
    if (data?.error || data?.success !== true) {
      throw new Error(JSON.stringify(data) || `request to ${route} with params ${JSON.stringify(body)} failed. ${JSON.stringify(data)}`);
    }
    return data;
  }
}

export default FullNodeRequest;
