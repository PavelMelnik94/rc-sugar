import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { isBrowser } from '../../../shared/utils'

/**
 * Target audience for Gate component
 */
export type GateTarget = 'bot' | 'human' | 'mobile' | 'desktop' | 'dev' | 'prod'


export interface GateProps {
  /**
   * Target audience
   */
  for: GateTarget | GateTarget[]
  /**
   * Content to render for target audience
   */
  children: ReactNode
  /**
   * Fallback content for non-target audience
   */
  fallback?: ReactNode
  /**
   * Custom detection function
   */
  detect?: () => boolean
}


function isBot(): boolean {
  if (!isBrowser()) return true // SSR is considered bot

  const userAgent = navigator.userAgent.toLowerCase()
  const botPatterns = [
    'googlebot',
    'bingbot',
    'slurp',
    'duckduckbot',
    'baiduspider',
    'yandexbot',
    'facebookexternalhit',
    'twitterbot',
    'rogerbot',
    'linkedinbot',
    'embedly',
    'quora link preview',
    'showyoubot',
    'outbrain',
    'pinterest',
    'developers.google.com/+/web/snippet',
    'slackbot',
    'vkshare',
    'w3c_validator',
    'redditbot',
    'applebot',
    'whatsapp',
    'flipboard',
    'tumblr',
    'bitlybot',
    'skypeuripreview',
    'nuzzel',
    'discordbot',
    'google page speed',
    'qwantify',
    'bitrix link preview',
    'xing-contenttabreceiver',
    'chrome-lighthouse',
    'telegrambot',
  ]

  return botPatterns.some((pattern) => userAgent.includes(pattern))
}


function isMobile(): boolean {
  if (!isBrowser()) return false

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Gate component - conditional rendering for different audiences
 *
 * @example
 * ```tsx
 * <Gate for="bot">
 *   <StructuredData schema={pageSchema} />
 * </Gate>
 *
 * <Gate for="human" fallback={<StaticContent />}>
 *   <InteractiveComponent />
 * </Gate>
 *
 * <Gate for={['mobile', 'dev']}>
 *   <MobileDebugPanel />
 * </Gate>
 *
 * <Gate for="desktop" detect={() => window.innerWidth > 1024}>
 *   <DesktopSidebar />
 * </Gate>
 * ```
 */
export function Gate({ for: target, children, fallback = null, detect }: GateProps): React.JSX.Element {
  const [shouldRender, setShouldRender] = useState<boolean | null>(null)

  useEffect(() => {
    if (detect) {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setShouldRender(detect())
      return
    }

    const targets = Array.isArray(target) ? target : [target]
    let matches = false

    for (const t of targets) {
      switch (t) {
        case 'bot':
          if (isBot()) matches = true
          break
        case 'human':
          if (!isBot()) matches = true
          break
        case 'mobile':
          if (isMobile()) matches = true
          break
        case 'desktop':
          if (!isMobile()) matches = true
          break
      }

      if (matches) break
    }

    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setShouldRender(matches)
  }, [target, detect])

  // During SSR or initial load, assume bot for SEO
  if (shouldRender === null) {
    const targets = Array.isArray(target) ? target : [target]
    if (targets.includes('bot')) {
      return <>{children}</>
    }
    return <>{fallback}</>
  }

  return shouldRender ? <>{children}</> : <>{fallback}</>
}

Gate.displayName = 'Gate'
