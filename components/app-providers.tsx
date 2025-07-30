import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { ClusterProvider } from './cluster/cluster-provider';
import { SolanaProvider } from '@/components/solana/solana-provider';
import { AppTheme } from '@/components/app-theme';
import { AuthProvider } from '@/components/auth/auth-provider';
import { PrivyProvider } from '@privy-io/expo';
import { AlertProvider } from '../context/AlertContext';
import { UserProvider } from '../context/UserContext';
import { CurrenciesProvider } from '../context/CurrenciesContext';
import { CartProvider } from '../context/CartContext';

const queryClient = new QueryClient();

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AppTheme>
      <QueryClientProvider client={queryClient}>
        <ClusterProvider>
          <SolanaProvider>
            <PrivyProvider appId="cm98xfs1400p8jr0ko4qbl24q">
                <UserProvider>
                  <CurrenciesProvider>
                    <AlertProvider>
                      <CartProvider>{children}</CartProvider>
                    </AlertProvider>
                  </CurrenciesProvider>
                </UserProvider>
              </PrivyProvider>
          </SolanaProvider>
        </ClusterProvider>
      </QueryClientProvider>
    </AppTheme>
  );
}
