import { log } from '@ctocker/lib/build/main/src/log';
import stockConfigModel from '@ctocker/lib/build/main/src/models/stock-config.model';
import Blockchain from '@ctocker/lib/build/main/src/services/blockchain/blockchain';
import { TxRecord } from '@ctocker/lib/build/main/src/types/blockchain';
import { currency, ExchangeConfig } from '@ctocker/lib/build/main/src/types/stock';
import autoBind from 'auto-bind';
import readline from 'readline';

type walkDesision = 'in' | 'out' | 'config' | 'change';

interface BcDebugArgs {
  from: number;
  to: number;
  cur: currency;
}

class BcDebug {
  private args: BcDebugArgs;
  private bc: Blockchain;
  private rl = readline.createInterface({
    input: process.stdin,
  });

  constructor(args: { [key: string]: string }, glassConfigs: ExchangeConfig[]) {
    autoBind(this);

    this.args = {
      cur: args.bc_cur as currency,
      from: Number(args.bc_from),
      to: Number(args.bc_to),
    };

    this.bc = new Blockchain(this.args.cur, glassConfigs);
  }

  public async run() {
    const [desision, txs] = await this.walk();
    switch (desision) {
      case 'in':
        this.analizeIn(txs);
        break;
    }
    log.info('done.');
    this.closeRl();
  }

  private async analizeIn(_txs: TxRecord[]) {
    // TODO
  }

  private async walk(): Promise<[walkDesision, TxRecord[]]> {
    const result = await this.bc.getTransactions(this.args.from, this.args.to);
    log.info('In transactions');
    log.info('', result, result?.inTxs);
    log.info('Out transactions');
    log.info('', result, result?.outTxs);
    log.info('Change coins');
    log.info('', result, result?.changeTxs);
    log.info('Config transactions');
    log.info('', result, result?.configTxs);

    const dToRes: { [P in walkDesision]: TxRecord[] } = {
      in: result?.inTxs || [],
      out: result?.outTxs || [],
      change: result?.changeTxs || [],
      config: result?.configTxs || [],
    };

    const opts = Object.keys(dToRes).filter(key => dToRes[key].length > 0) as walkDesision[];
    if (!opts.length) return [null, []];

    const d = await this.prompt<walkDesision>(`What to analyze?:\n  ${opts.join(',\n  ')}`, opts);
    return [d, dToRes[d]];
  }

  private async prompt<PromptOption>(message: string, options: PromptOption[]): Promise<PromptOption> {
    process.stdout.write(`${message} \n`);
    return new Promise(resolve => {
      this.rl.question(message, async (data: any) => {
        if (!options.includes(data)) {
          resolve(await this.prompt(`Avaliable options are: ${options}`, options));
        } else {
          resolve(data as unknown as PromptOption);
        }
      });
    });
  }

  private closeRl() {
    this.rl.close();
  }
}

async function bcDebug(args: { [key: string]: string }) {
  const config = (await stockConfigModel.getConfigs()).find(item => String(item.id) === String(args.id));
  const d = new BcDebug(args, [config.config_json.exchangeConfig]);
  await d.run();
}

export default bcDebug;
