import { UnknownOutputParams, useGlobalSearchParams, usePathname } from 'expo-router'
import { useEffect } from 'react'

// Hook to track the location for analytics
export function useTrackLocations(onChange: (pathname: string, params: UnknownOutputParams) => void) {
  const pathname = usePathname()
  const params = useGlobalSearchParams()
  useEffect(() => {
    // TODO: Add your own analytics tracking here
    onChange(pathname, params)
  }, [onChange, pathname, params]);
}
