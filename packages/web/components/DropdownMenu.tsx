import React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import classNames from '../lib/classNames';
import FocusRing from './FocusRing';

import styles from './DropdownMenu.module.scss';

export const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  Parameters<typeof DropdownMenuPrimitive.Item>[0]
>(({ className, ...props }, ref) => (
  <FocusRing>
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={classNames(styles.item, className)}
      {...props}
    />
  </FocusRing>
));
DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuContent: React.FC<
  Parameters<typeof DropdownMenuPrimitive.Content>[0]
> = ({ className, ...props }) => (
  <DropdownMenuPrimitive.Content
    className={classNames(styles.content, className)}
    {...props}
  />
);

export const DropdownMenuArrow: React.FC<
  Parameters<typeof DropdownMenuPrimitive.Arrow>[0]
> = (props) => (
  <DropdownMenuPrimitive.Arrow className={styles.arrow} {...props} />
);

export const DropdownMenuSeparator: React.FC<
  Parameters<typeof DropdownMenuPrimitive.Separator>[0]
> = (props) => (
  <DropdownMenuPrimitive.Separator className={styles.separator} {...props} />
);

export const DropdownMenuRadioItem: React.FC<
  Parameters<typeof DropdownMenuPrimitive.RadioItem>[0]
> = (props) => (
  <DropdownMenuPrimitive.RadioItem className={styles.item} {...props} />
);

export const DropdownMenuItemIndicator: React.FC<
  Parameters<typeof DropdownMenuPrimitive.ItemIndicator>[0]
> = (props) => (
  <DropdownMenuPrimitive.ItemIndicator
    className={styles.itemIndicator}
    {...props}
  />
);

export const DropdownMenuTrigger: React.FC<
  Parameters<typeof DropdownMenuPrimitive.Trigger>[0]
> = ({ className, ...props }) => (
  <FocusRing>
    <DropdownMenuPrimitive.Trigger
      className={classNames(styles.triggerItem, className)}
      {...props}
    />
  </FocusRing>
);

export const RightSlot: React.FC = ({ children }) => (
  <div className={styles.rightSlot}>{children}</div>
);

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
