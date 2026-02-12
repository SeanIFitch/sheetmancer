import { useState, useEffect } from 'react';

interface Props {
  splitId: string;
  direction: 'horizontal' | 'vertical';
  ratio: number;
  bounds: { left: number; top: number; width: number; height: number };
  onRatioChange: (splitId: string, newRatio: number) => void;
}

export function ResizableSplit({ splitId, direction, ratio, bounds, onRatioChange }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  
  useEffect(() => {
    if (!isDragging) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      let newRatio: number;
      
      if (direction === 'horizontal') {
        const relativeX = e.clientX - bounds.left;
        newRatio = relativeX / bounds.width;
      } else {
        const relativeY = e.clientY - bounds.top;
        newRatio = relativeY / bounds.height;
      }
      
      // Clamp between 0.1 and 0.9
      const clampedRatio = Math.max(0.1, Math.min(0.9, newRatio));
      onRatioChange(splitId, clampedRatio);
    };
    
    const handleMouseUp = () => setIsDragging(false);
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, splitId, direction, bounds, onRatioChange]);
  
  // Calculate divider position based on ratio
  const dividerStyle = direction === 'horizontal'
    ? { left: bounds.left + bounds.width * ratio, width: 4, height: bounds.height, top: bounds.top }
    : { top: bounds.top + bounds.height * ratio, height: 4, width: bounds.width, left: bounds.left };
  
  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'absolute',
        ...dividerStyle,
        backgroundColor: isDragging ? 'blue' : (isHovering ? '#999' : '#ccc'),
        cursor: direction === 'horizontal' ? 'col-resize' : 'row-resize',
        zIndex: isDragging ? 100 : 10,
        pointerEvents: 'auto',
      }}
    />
  );
}
