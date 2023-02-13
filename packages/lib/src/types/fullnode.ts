export interface SubSlot {
  challenge_chain: {
    challenge_chain_end_of_slot_vdf: Vdf;
    infused_challenge_chain_sub_slot_hash: string;
    new_difficulty: string | null;
    new_sub_slot_iters: string | null;
    subepoch_summary_hash: string | null;
  };
  infused_challenge_chain: {
    infused_challenge_chain_end_of_slot_vdf: Vdf;
  };
  proofs: {
    challenge_chain_slot_proof: Proof;
    infused_challenge_chain_slot_proof: Proof;
    reward_chain_slot_proof: Proof;
  };
  reward_chain: {
    challenge_chain_sub_slot_hash: string;
    deficit: number;
    end_of_slot_vdf: Vdf;
    infused_challenge_chain_sub_slot_hash: string;
  };
}

export interface ProofOfSpace {
  challenge: string;
  plot_public_key: string;
  pool_contract_puzzle_hash: string | null;
  pool_public_key: string;
  proof: string;
  size: number;
}

export interface RewardChainBlock {
  challenge_chain_ip_vdf: Vdf;
  challenge_chain_sp_signature: string;
  challenge_chain_sp_vdf: Vdf;
  height: number;
  infused_challenge_chain_ip_vdf: Vdf;
  is_transaction_block: boolean;
  pos_ss_cc_challenge_hash: string;
  proof_of_space: ProofOfSpace;
  reward_chain_ip_vdf: Vdf;
  reward_chain_sp_signature: string;
  reward_chain_sp_vdf: Vdf;
  signage_point_index: number;
  total_iters: string;
  weight: string;
}

export interface Proof {
  witness: string;
  witness_type: number;
}

export interface FoliageBlock {
  foliage_block_data: {
    extension_data: string;
    farmer_reward_puzzle_hash: string;
    pool_signature: string;
    pool_target: {
      max_height: number;
      puzzle_hash: string;
    };
    unfinished_reward_block_hash: string;
  };
  foliage_block_data_signature: string | null;
  foliage_transaction_block_hash: string | null;
  foliage_transaction_block_signature: string;
  prev_block_hash: string;
  reward_block_hash: string;
}

export interface FoliageTransactionBlock {
  additions_root: string;
  filter_hash: string;
  prev_transaction_block_hash: string;
  removals_root: string;
  timestamp: string;
  transactions_info_hash: string;
}

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

export interface TransactionsInfo {
  aggregated_signature: string;
  cost: string;
  fees: string;
  generator_root: string;
  previous_generators_root: string;
  reward_claims_incorporated: RewardClaim[];
}

export interface RewardClaim {
  amount: string;
  parent_coin_info: string;
  puzzle_hash: string;
}

export interface VdfOutput {
  data: string;
}
export interface Vdf {
  challenge: string;
  number_of_iterations: string;
  output: VdfOutput;
}

export interface BlockRecord {
  challenge_block_info_hash: string;
  challenge_vdf_output: VdfOutput;
  deficit: number;
  farmer_puzzle_hash: string;
  fees: string | null;
  finished_challenge_slot_hashes: string[] | null;
  finished_infused_challenge_slot_hashes: string[] | null;
  finished_reward_slot_hashes: string[] | null;
  header_hash: string;
  height: number;
  infused_challenge_vdf_output: VdfOutput;
  overflow: boolean;
  pool_puzzle_hash: string;
  prev_transaction_block_hash: string | null;
  prev_transaction_block_height: number;
  prev_hash: string;
  required_iters: string;
  reward_claims_incorporated: RewardClaim[] | null;
  reward_infusion_new_challenge: string;
  signage_point_index: number;
  sub_epoch_summary_included: null;
  sub_slot_iters: string;
  timestamp: string | null;
  total_iters: string;
  weight: string;
}

export interface BlockchainState {
  difficulty: number;
  peak: BlockRecord;
  space: number;
  mempool_size: number;
  sub_slot_iters: number;
  sync: {
    sync_mode: boolean;
    sync_progress_height: number;
    sync_tip_height: number;
    synced: boolean;
  };
}
export interface CoinRecord {
  coin: {
    amount: string;
    parent_coin_info: string;
    puzzle_hash: string;
  };
  coinbase: boolean;
  confirmed_block_index: number;
  spent: boolean;
  spent_block_index: number;
  timestamp: string;
}
