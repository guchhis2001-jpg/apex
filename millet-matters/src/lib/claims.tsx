import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { claimsApproved } from './products';

/**
 * Health claims are only rendered when CLAIMS_APPROVED[claim] is true in products.json.
 * `?claims=preview` shows unapproved claims with a "pending" marker, for client review only.
 */
type Mode = { preview: boolean };
const Ctx = createContext<Mode>({ preview: false });

export function ClaimsProvider({ children }: { children: ReactNode }) {
  const [preview, setPreview] = useState(false);
  useEffect(() => {
    setPreview(new URLSearchParams(window.location.search).get('claims') === 'preview');
  }, []);
  return <Ctx.Provider value={{ preview }}>{children}</Ctx.Provider>;
}

export type ClaimState = 'approved' | 'pending' | 'hidden';

export function useClaim(claim: string | undefined): ClaimState {
  const { preview } = useContext(Ctx);
  if (!claim) return 'approved';
  if (claimsApproved[claim]) return 'approved';
  return preview ? 'pending' : 'hidden';
}

export function useClaimsPreview() {
  return useContext(Ctx).preview;
}

export const CLAIM_LABEL: Record<string, string> = {
  'gluten-free': 'Gluten-free',
  'high-in-protein': 'High in protein',
  'diabetic-friendly': 'Diabetic-friendly',
};

/** For resolving several claims in one render (e.g. a list). */
export function useClaimResolver() {
  const { preview } = useContext(Ctx);
  return (claim?: string): ClaimState => (!claim || claimsApproved[claim] ? 'approved' : preview ? 'pending' : 'hidden');
}
