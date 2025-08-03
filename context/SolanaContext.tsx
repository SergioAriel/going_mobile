
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Account, transact, Web3MobileWallet } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { useAlert } from './AlertContext';
import bs58 from 'bs58';
import { Buffer } from 'buffer';
import { PublicKey } from '@solana/web3.js';
import { toByteArray } from "react-native-quick-base64";

interface SolanaContextType {
  accounts: Account[];
  authorizeSession: () => Promise<void>;
  deauthorizeSession: () => Promise<void>;
  selectedAccount: Account | null;
}

const SolanaContext = createContext<SolanaContextType | undefined>(undefined);

export const SolanaProvider = ({ children }: { children: ReactNode }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const { handleAlert } = useAlert();

  const authorizeSession = useCallback(async () => {
    try {
      await transact(async (wallet: Web3MobileWallet) => {
        const authorizationResult = await wallet.authorize({
          cluster: 'devnet',
          identity: {
            name: 'Going',
            uri: 'https://going.website/',
            icon: 'favicon.ico'
          }
        });
        const accountsWithBase58 = authorizationResult.accounts.map(account => ({
          ...account,
          address: bs58.encode(Buffer.from(account.address, 'base64'))
        }));
        console.log(authorizationResult.accounts[0].address)
        const authorizedPubkey = new PublicKey(
          toByteArray(authorizationResult.accounts[0].address)
        );
        console.log("authorizedPubkey", authorizedPubkey);
        setAccounts(accountsWithBase58);
        setSelectedAccount(accountsWithBase58[0] || null);
      });
    } catch (error: any) {
      console.error("Authorization failed", error);
      handleAlert({ isError: true, message: `Authorization failed: ${error.message}` });
    }
  }, [handleAlert]);

  const deauthorizeSession = useCallback(async () => {
    try {
      await transact(async (wallet: Web3MobileWallet) => {
        await wallet.deauthorize();
        setAccounts([]);
        setSelectedAccount(null);
      });
    } catch (error: any) {
      console.error("Deauthorization failed", error);
      handleAlert({ isError: true, message: `Deauthorization failed: ${error.message}` });
    }
  }, [handleAlert]);

  return (
    <SolanaContext.Provider value={{ accounts, authorizeSession, deauthorizeSession, selectedAccount }}>
      {children}
    </SolanaContext.Provider>
  );
};

export const useSolana = () => {
  const context = useContext(SolanaContext);
  if (context === undefined) {
    throw new Error('useSolana must be used within a SolanaProvider');
  }
  return context;
};
