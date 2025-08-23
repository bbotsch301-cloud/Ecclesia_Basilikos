import { useCallback } from 'react';

interface RippleOptions {
  disabled?: boolean;
  color?: string;
  duration?: number;
}

export const useRipple = (options: RippleOptions = {}) => {
  const { disabled = false, color = 'rgba(255, 255, 255, 0.3)', duration = 600 } = options;

  const createRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;

    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background-color: ${color};
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      animation: ripple ${duration}ms ease-out;
      pointer-events: none;
      z-index: 1;
    `;

    // Add ripple animation keyframes if not already added
    if (!document.querySelector('#ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Ensure the element has relative positioning for the ripple
    const originalPosition = element.style.position;
    if (!originalPosition || originalPosition === 'static') {
      element.style.position = 'relative';
    }
    element.style.overflow = 'hidden';

    element.appendChild(ripple);

    // Remove the ripple after animation completes
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, duration);
  }, [disabled, color, duration]);

  return createRipple;
};