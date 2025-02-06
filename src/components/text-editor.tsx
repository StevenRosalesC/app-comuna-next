'use client'

import { Editor } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Heading from '@tiptap/extension-heading'
import Text from '@tiptap/extension-text'
import { EditorContent } from '@tiptap/react';



const TextEditor = () => {
  const editor = new Editor({
    // bind Tiptap to the `.element`
    // register extensions
    extensions: [Document, Paragraph, Text, Heading.configure({
      levels: [1, 2, 3],
    })],
    // set the initial content
    content: '<p>Example Text</p>',
    // place the cursor in the editor after initialization
    autofocus: true,
    // make the text editable (default is true)
    editable: true,
    // prevent loading the default CSS (which isn't much anyway)
    injectCSS: false,
  })

  return <EditorContent editor={editor} />
}

export default TextEditor
