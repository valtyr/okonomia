import React from 'react';
import * as RadixAvatar from '@radix-ui/react-avatar';

const Avatar: React.FC<{ name: string; imageSrc: string }> = ({
  name,
  imageSrc,
}) => (
  <RadixAvatar.Root
    as="div"
    className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-100"
  >
    <RadixAvatar.Image className="w-full" src={imageSrc} />
    <RadixAvatar.Fallback>
      <div
        className="
        w-full h-full flex items-center justify-center
        text-sm font-semibold text-gray-400"
      >
        {name
          .trim()
          .split(' ')
          .slice(0, 3)
          .map((s) => s[0]?.toUpperCase() || '')}
      </div>
    </RadixAvatar.Fallback>
  </RadixAvatar.Root>
);

export default Avatar;
