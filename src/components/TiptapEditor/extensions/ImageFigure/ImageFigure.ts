import { JSONContent } from '@tiptap/core';

import Figure from '../Figure';
import ImageCaption from './ImageCaption';
import Image from '../Image/Image';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageFigure: {
      setImageFigure: (options: {
        src: string;
        caption?: string;
      }) => ReturnType;
      imageToFigure: () => ReturnType;
      figureToImage: () => ReturnType;
      removeImage: () => ReturnType;
    };
  }
}

export const ImageFigure = Figure.extend({
  name: 'imageFigure',
  content: 'image imageCaption?',
  //   atom: true,

  addExtensions() {
    return [ImageCaption];
  },

  addCommands() {
    return {
      /**
       * Insert an imageFigure node with an image and optional caption.
       */
      setImageFigure:
        ({ src, caption }) =>
        ({ chain }) => {
          const content: JSONContent[] = [
            { type: Image.name, attrs: { src } },
            caption === null || caption === undefined
              ? {}
              : {
                  type: ImageCaption.name,
                  content:
                    caption === ''
                      ? undefined
                      : [{ type: 'text', text: caption }]
                }
          ];
          return chain().insertContent({ type: this.name, content }).run();
        },

      /**
       * Convert a standalone image into an imageFigure node.
       */
      imageToFigure:
        () =>
        ({ state, chain }) => {
          const { selection } = state;
          const { $anchor } = selection;

          const imagePos = $anchor.pos;
          const imageNode = state.doc.nodeAt(imagePos);

          if (!imageNode || imageNode.type.name !== Image.name) {
            return false;
          }

          const range = {
            from: imagePos,
            to: imagePos + imageNode.nodeSize
          };

          const content: JSONContent[] = [
            { type: Image.name, attrs: imageNode.attrs },
            { type: ImageCaption.name, content: undefined }
          ];

          return chain()
            .insertContentAt(range, {
              type: this.name,
              content
            })
            .setTextSelection(range.to + content.length)
            .run();
        },

      /**
       * Convert an imageFigure node back to a standalone image.
       */
      figureToImage:
        () =>
        ({ state, commands }) => {
          const { selection } = state;
          const { $anchor } = selection;

          let depth = $anchor.depth;
          let pos = $anchor.pos;

          while (depth > 0) {
            pos = $anchor.before(depth);
            depth--;
          }

          const figureNode = state.doc.nodeAt(pos);

          if (!figureNode || figureNode.type.name !== this.name) {
            return false;
          }

          const range = {
            from: pos,
            to: pos + figureNode.nodeSize
          };

          const content = figureNode.firstChild;

          return commands.insertContentAt(range, content);
        },

      /**
       * Remove an image or imageFigure node.
       */
      removeImage:
        () =>
        ({ state, tr, dispatch }) => {
          const { selection } = state;
          const { $anchor } = selection;

          let depth = $anchor.depth;
          let pos = $anchor.pos;

          while (depth > 0) {
            pos = $anchor.before(depth);
            depth--;
          }

          const node = state.doc.nodeAt(pos);

          if (
            !node ||
            (node.type.name !== this.name && node.type.name !== Image.name)
          ) {
            return false;
          }

          if (dispatch) {
            tr.deleteRange(pos, pos + node.nodeSize);
            dispatch(tr);
          }

          return true;
        }
    };
  },
});

export default ImageFigure;
