import React, {
  ChangeEvent,
  Fragment,
  useCallback,
  useRef,
  useState
} from 'react';
import MenuButton from '../MenuButton';
import { useEditorState } from '@tiptap/react';
import { useTiptapContext } from '../Provider';
import Dialog from '@/components/TiptapEditor/components/ui/Dialog';
import useModal from '@/components/TiptapEditor/hooks/useModal';
import MediaLibrary from '../MediaLibrary';

const ImageButton = () => {
  const { editor } = useTiptapContext();
  const state = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        active: ctx.editor.isActive('image'),
        disabled: !ctx.editor.isEditable
      };
    }
  });

  const { open, handleOpen, handleClose } = useModal();

  return (
    <>
      <MenuButton
        icon='Image'
        tooltip='Imagen'
        {...state}
        onClick={handleOpen}
      />
      <Dialog open={open} onOpenChange={handleClose}>
        <MediaLibrary
          onClose={handleClose}
          onInsert={(image) => {
            editor
              .chain()
              .focus()
              .insertImage({
                src: image.url,
                width: image.width,
                height: image.height
              })
              .run();
            handleClose();
          }}
        />
      </Dialog>
    </>
  );
};

export default ImageButton;
