import React, { memo, useCallback } from 'react';
import { BubbleMenu } from '../../BubbleMenu';
import { Toolbar, ToolbarDivider } from '../../ui/Toolbar';
import { useTiptapContext } from '../../Provider';
import MenuButton from '../../MenuButton';
import { useEditorState } from '@tiptap/react';
import CodeDropdown from './CodeDropdown';
import useCopyToClipboard from '../../../hooks/useCopyToClipboard';
import { getNodeContainer } from '../../../utils/getNodeContainer';

export const CodeBlockMenu = () => {
  const { editor } = useTiptapContext();
  const { isCopied, copy } = useCopyToClipboard();

  const language = useEditorState({
    editor,
    selector: (ctx) => {
      if (ctx.editor.isActive('codeBlock'))
        return ctx.editor.getAttributes('codeBlock').language;
      return null;
    }
  });

  const shouldShow = useCallback(({ editor }: any) => {
    return editor.isActive('codeBlock');
  }, []);

  const handleSelect = useCallback(
    (value: string) =>
      editor.commands.updateAttributes('codeBlock', { language: value }),
    [editor]
  );

  const handleCopy = useCallback(() => {
    const node = getNodeContainer(editor, 'pre');
    if (node?.textContent) {
      copy(node.textContent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  const handleDelete = useCallback(() => {
    editor.chain().focus().deleteNode('codeBlock').run();
  }, [editor]);

  return (
    <BubbleMenu
      editor={editor}
      pluginKey={'code-block-bubble'}
      shouldShow={shouldShow}
      updateDelay={100}
    >
      <Toolbar>
        <CodeDropdown value={language} onSelect={handleSelect} />
        <ToolbarDivider />
        <MenuButton
          icon={isCopied ? 'Check' : 'Clipboard'}
          tooltip='Copy code'
          onClick={handleCopy}
        />
        <MenuButton icon='Trash' tooltip='Delete code' onClick={handleDelete} />
      </Toolbar>
    </BubbleMenu>
  );
};

export default memo(CodeBlockMenu);
