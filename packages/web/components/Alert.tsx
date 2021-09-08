import React, { Fragment } from 'react';
import Button, { ButtonStyle } from './Button';
import { Dialog } from '@headlessui/react';

const AlertDialog: React.FC<{
  onConfirm: () => void;
  onClose: () => void;
  open?: boolean;
  title: string;
  description: string | React.ReactElement;
  confirmText: string;
  cancelText: string;
  confirmStyle?: ButtonStyle;
}> = ({
  open,
  onConfirm,
  onClose,
  confirmText,
  cancelText,
  title,
  description,
  confirmStyle = 'primary',
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    className="fixed z-10 inset-0 overflow-y-auto"
  >
    <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />

    <div
      className="
      bg-white fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2
      w-[90vw] max-w-md p-5 rounded-lg focus:outline-none"
    >
      <Dialog.Title className="mb-5 text-gray-700 font-semibold">
        {title}
      </Dialog.Title>
      <Dialog.Description className="mb-5 text-sm">
        {description}
      </Dialog.Description>

      <div className="flex flex-row justify-end space-x-3">
        <Button buttonStyle="secondary" onPress={onClose}>
          {cancelText}
        </Button>
        <Button
          buttonStyle={confirmStyle}
          onPress={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmText}
        </Button>
      </div>
    </div>
  </Dialog>
);
// open ? (
//   <RadixAlertDialog.Root
//     open={open}
//     onOpenChange={(open: boolean) => {
//       !open && onClose();
//       return open;
//     }}
//   >
//     <RadixAlertDialog.Trigger>{children}</RadixAlertDialog.Trigger>
//     {open && (
//       <RadixAlertDialog.Overlay
//         forceMount
//         className="fixed inset-0 bg-black bg-opacity-30"
//       />
//     )}
//     <RadixAlertDialog.Content
//       className="
//     bg-white fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2
//     w-[90vw] max-w-md p-5 rounded-lg focus:outline-none"
//     >
//       <RadixAlertDialog.Title className="mb-5 text-gray-700 font-semibold">
//         {title}
//       </RadixAlertDialog.Title>
//       <RadixAlertDialog.Description className="mb-5 text-sm">
//         {description}
//       </RadixAlertDialog.Description>
//       <div className="flex flex-row justify-end space-x-3">
//         <RadixAlertDialog.Cancel asChild>
//           <Button buttonStyle="secondary">{cancelText}</Button>
//         </RadixAlertDialog.Cancel>
//         <RadixAlertDialog.Action asChild>
//           <Button buttonStyle={confirmStyle} onPress={onConfirm}>
//             {confirmText}
//           </Button>
//         </RadixAlertDialog.Action>
//       </div>
//     </RadixAlertDialog.Content>
//   </RadixAlertDialog.Root>
// ) : null;

export default AlertDialog;
