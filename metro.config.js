const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// --- START ROBUST CONFIGURATION ---

// 1. Add the project's `node_modules` folder to the resolver.
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];

// 2. Explicitly resolve the problematic Solana dependency.
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  util: require.resolve('util'),
  '@solana/codecs-numbers': path.resolve(__dirname, 'node_modules/@solana/codecs-numbers'),
};

// 3. Custom resolver to handle Privy's package exports and other incompatibilities.
const resolveRequestWithPackageExports = (context, moduleName, platform) => {
  // Workaround for `isows` (a `viem` dependency)
  if (moduleName === "isows") {
    const ctx = { ...context, unstable_enablePackageExports: false };
    return ctx.resolveRequest(ctx, moduleName, platform);
  }

  // Workaround for `zustand@4`
  if (moduleName.startsWith("zustand")) {
    const ctx = { ...context, unstable_enablePackageExports: false };
    return ctx.resolveRequest(ctx, moduleName, platform);
  }

  // Workaround for `jose`
  if (moduleName === "jose") {
    const ctx = { ...context, unstable_conditionNames: ["browser"] };
    return ctx.resolveRequest(ctx, moduleName, platform);
  }

  // Enable package exports for Privy
  if (moduleName.startsWith('@privy-io')) {
    const ctx = { ...context, unstable_enablePackageExports: true };
    return ctx.resolveRequest(ctx, moduleName, platform);
  }

  // Fallback to the default resolver
  return context.resolveRequest(context, moduleName, platform);
};

config.resolver.resolveRequest = resolveRequestWithPackageExports;

// --- END ROBUST CONFIGURATION ---

module.exports = config;