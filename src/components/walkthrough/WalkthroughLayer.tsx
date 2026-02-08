import { WalkthroughOverlay } from './WalkthroughOverlay';
import { DemoLaunchButton } from './DemoLaunchButton';
import { useWalkthroughKeyboard } from '@/hooks/useWalkthroughKeyboard';

export function WalkthroughLayer() {
  useWalkthroughKeyboard();

  return (
    <>
      <DemoLaunchButton />
      <WalkthroughOverlay />
    </>
  );
}
