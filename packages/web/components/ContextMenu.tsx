import React, { PropsWithChildren } from 'react';

import {
  Item as VanillaItem,
  Root as VanillaRoot,
  Trigger as VanillaTrigger,
  Content as VanillaContent,
  Separator as VanillaSeparator,
  Arrow as VanillaArrow,
  TriggerItem as VanillaTriggerItem,
} from '@radix-ui/react-context-menu';

const Content: React.FC<React.ComponentProps<typeof VanillaContent>> = (
  props,
) => (
  <VanillaContent
    {...props}
    className="inline-block min-w-[130px] bg-white border
    border-gray-100 rounded-md p-1 shadow-md text-sm focus-within:border-black"
  />
);

const Item: React.FC<React.ComponentProps<typeof VanillaItem>> = (props) => (
  <VanillaItem
    {...props}
    className="flex items-center justify-between
    cursor-default select-none whitespace-nowrap h-6
    py-2 text-black rounded-sm"
  />
);

const ContextMenu: React.FC = ({ children }) => (
  <VanillaRoot>
    <VanillaTrigger>{children}</VanillaTrigger>

    <Content>
      <Item>…</Item>
      <Item>…</Item>
      <VanillaSeparator />
      <VanillaRoot>
        <VanillaTriggerItem>Sub menu →</VanillaTriggerItem>
        <Content>
          <Item>Sub menu item</Item>
          <Item>Sub menu item</Item>
          <VanillaArrow />
        </Content>
      </VanillaRoot>
      <VanillaSeparator />
      <Item>Hello!</Item>
    </Content>
  </VanillaRoot>
);

export default ContextMenu;
