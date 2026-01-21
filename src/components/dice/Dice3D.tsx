import { lazy, Suspense } from 'react';
import { cn } from '@/lib/utils';
import type { Dice3DRollerProps } from './Dice3DScene';
import './Dice3D.css';

const Dice3DScene = lazy(() =>
  import('./Dice3DScene').then((module) => ({
    default: module.Dice3DRoller,
  }))
);

const Dice3DLoader = ({ className }: { className?: string }) => (
  <div className={cn('dice-3d-roller', className)}>
    <div className="dice-3d-loading">Loading 3D dice...</div>
  </div>
);

export function Dice3DRoller(props: Dice3DRollerProps) {
  return (
    <Suspense fallback={<Dice3DLoader className={props.className} />}>
      <Dice3DScene {...props} />
    </Suspense>
  );
}
