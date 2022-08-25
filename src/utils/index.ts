import { getAddress } from "@ethersproject/address";

export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export function shortenAddress(address: string | undefined, chars = 4): string {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

export function shortenBech32Address(address: string | undefined): string {
  if (!address) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${address.substring(0, 12)}...${address.substring(42 - 7)}`;
}
