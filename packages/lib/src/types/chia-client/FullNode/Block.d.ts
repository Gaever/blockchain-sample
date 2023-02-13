import { FoliageTransactionBlock } from './FoliageTransactionBlock';
import { FoliageBlock } from './FoliageBlock';
import { Proof } from './Proof';
import { RewardChainBlock } from './RewardChainBlock';
import { SubSlot } from './SubSlot';
import { TransactionsInfo } from './TransactionsInfo';
export interface Block {
    challenge_chain_ip_proof: Proof;
    challenge_chain_sp_proof: Proof;
    finished_sub_slots: SubSlot[];
    foliage: FoliageBlock;
    reward_chain_block: RewardChainBlock;
    infused_challenge_chain_ip_proof: Proof;
    reward_chain_ip_proof: Proof;
    reward_chain_sp_proof: Proof;
    transactions_generator: null;
    foliage_transaction_block?: FoliageTransactionBlock;
    transactions_info: TransactionsInfo | null;
    header_hash?: string;
}
