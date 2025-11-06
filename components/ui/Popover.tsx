import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { cn } from '../../lib/utils';

interface PopoverContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

export const usePopoverContext = () => {
    const context = useContext(PopoverContext);
    if (!context) {
        throw new Error("usePopoverContext must be used within a Popover provider");
    }
    return context;
};

export const Popover: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [open, setOpen] = useState(false);
    return (
        <PopoverContext.Provider value={{ open, setOpen }}>
            <div className="relative">{children}</div>
        </PopoverContext.Provider>
    );
};

export const PopoverTrigger: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const { open, setOpen } = usePopoverContext();
    const child = React.Children.only(children) as React.ReactElement;
    
    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        setOpen(!open);
        if (child.props.onClick) {
            child.props.onClick(e);
        }
    };

    return React.cloneElement(child, { onClick: handleClick });
};


export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { open, setOpen } = usePopoverContext();
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (popoverRef.current) {
        triggerRef.current = popoverRef.current.closest('.relative')?.querySelector('button');
    }
    
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={popoverRef}
      className={cn(
        "absolute z-50 w-auto rounded-md border bg-card text-card-foreground shadow-md outline-none mt-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
PopoverContent.displayName = 'PopoverContent';