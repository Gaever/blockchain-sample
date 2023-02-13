import blockchainConfigModel from '@ctocker/lib/build/main/src/models/blockchain-config.model';
import { currency } from '@ctocker/lib/build/main/src/types/stock';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
});

async function prompt<PromptOption>(message: string, options: PromptOption[], skipOnUnknownAnswer: boolean = false): Promise<PromptOption> {
  process.stdout.write(`${message} \n`);
  return new Promise(resolve => {
    rl.question(message, async (data: any) => {
      if (!options.includes(data) && !skipOnUnknownAnswer) {
        resolve(await prompt(`Avaliable options are: ${options}`, options));
      } else {
        resolve(data as unknown as PromptOption);
      }
    });
  });
}

async function bcSetHeight(args: { [key: string]: string }) {
  try {
    const newHeight = args.bc_set_height;
    const newServiceStartHeight = args.bc_set_service_start_height;
    const cur = args.bc_cur as currency;
    if (!cur) throw new Error('cur unspecified');

    const answer1 = await prompt<'y'>(
      'Are you sure what are you doing? Manual change of last known height may cause lost of incomes or double payouts! "y" to continue',
      ['y'],
    );
    if (answer1 !== 'y') {
      console.log('Nothing changed.');
      process.exit(0);
    }
    const answer2 = await prompt<'y'>('Sure? Really? "y" to confirm.', ['y'], true);
    if (answer2 !== 'y') {
      console.log('Nothing changed.');
      process.exit(0);
    }
    const answer3 = await prompt<'y'>('Last warning. There is no way back. "y" to confirm.', ['y'], true);
    if (answer3 !== 'y') {
      console.log('Nothing changed.');
      process.exit(0);
    }

    if (newHeight) {
      await blockchainConfigModel.updateLastKnownHeight(cur, +newHeight, null, true);
      console.log('Last known height for', cur, 'is set to', newHeight);
    } else if (newServiceStartHeight) {
      await blockchainConfigModel.updateServiceStartHeight(cur, +newHeight);
      console.log('Service start height for', cur, 'is set to', newServiceStartHeight);
    }
  } finally {
    rl.close();
  }
}

export default bcSetHeight;
