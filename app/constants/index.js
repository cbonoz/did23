import { polygonMumbai } from "viem/chains";

export const APP_NAME = 'Blockreach'
export const APP_DESC = 'A modern Yellowpages for verified web3 businesses and individuals.'

export const CHAIN_OPTIONS = [
    polygonMumbai
]

export const ACTIVE_CHAIN = CHAIN_OPTIONS[0]

export const BLOCKREACH_ADDRESS = process.env.NEXT_PUBLIC_BLOCKREACH_ADDRESS

export const IPFS_BASE_URL = 'https://ipfs.filebase.io/ipfs'

export const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS

export const PRIMARY_COLOR = '#674ea7'

export const GITHUB_URL = 'https://github.com/cbonoz/did23'