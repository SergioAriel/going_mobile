import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { ClusterProvider } from './cluster/cluster-provider';
import { SolanaProvider } from '@/components/solana/solana-provider';
import { AppTheme } from '@/components/app-theme';
import { PrivyProvider } from '@privy-io/expo';
import { UserProvider, CurrenciesProvider, AlertProvider, CartProvider } from '@/context';
import { router } from 'expo-router';

const queryClient = new QueryClient();

export function AppProviders({ children }: PropsWithChildren) {

  console.log(process.env.EXPO_PUBLIC_PRIVY_APP_ID, process.env.EXPO_PUBLIC_PRIVY_CLIENT);
  return (
    <AppTheme>
      <QueryClientProvider client={queryClient}>
        <ClusterProvider>
          <SolanaProvider>
            <PrivyProvider
              appId={process.env.EXPO_PUBLIC_PRIVY_APP_ID as string}
              clientId={process.env.EXPO_PUBLIC_PRIVY_CLIENT as string}
              
            >
              <UserProvider>
                <CurrenciesProvider>
                  <AlertProvider>
                    <CartProvider>
                      {children}
                    </CartProvider>
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
