'use client';

import { GlowEffect, GlowEffectProps } from '@/components/ui/glow-effect';
import { ArrowRight } from 'lucide-react';
import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, 
  Pick<GlowEffectProps, 'colors' | 'mode' | 'blur' | 'scale' | 'duration'> {
  children: React.ReactNode;
  showArrow?: boolean;
}

export function GlowButton({
  children,
  className,
  colors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F'],
  mode = 'colorShift',
  blur = 'soft',
  scale = 0.9,
  duration = 3,
  showArrow = true,
  ...props
}: GlowButtonProps) {
  return (
    <div className='relative inline-block'>
      <GlowEffect
        colors={colors}
        mode={mode}
        blur={blur}
        duration={duration}
        scale={scale}
      />
      <button
        className={cn(
          'relative inline-flex items-center gap-1 rounded-md bg-zinc-950/80 px-4 py-2 text-sm text-zinc-50 outline outline-1 outline-[#fff2f21f] backdrop-blur-sm transition-colors hover:bg-zinc-900/90',
          className
        )}
        {...props}
      >
        {children}
        {showArrow && <ArrowRight className='h-4 w-4' />}
      </button>
    </div>
  );
} 