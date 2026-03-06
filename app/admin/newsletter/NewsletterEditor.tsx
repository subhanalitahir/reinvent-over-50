'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { useCallback, useEffect, useState } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Quote, Minus, Undo2, Redo2,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Link2Off, Image as ImageIcon,
  Heading1, Heading2, Heading3, Pilcrow, Code,
  Palette,
} from 'lucide-react';

/* ── Toolbar button ───────────────────────────────────────────── */
function Btn({
  onClick, active, disabled, title, children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`p-1.5 rounded-lg text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed
        ${active
          ? 'bg-purple-100 text-purple-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
    >
      {children}
    </button>
  );
}

/* ── Divider ──────────────────────────────────────────────────── */
function Sep() {
  return <span className="w-px h-5 bg-gray-200 mx-1 shrink-0" />;
}

/* ── Toolbar ─────────────────────────────────────────────────── */
function Toolbar({ editor }: { editor: Editor }) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showColor, setShowColor] = useState(false);

  const COLORS = [
    '#111827', '#7c3aed', '#db2777', '#ea580c', '#16a34a',
    '#2563eb', '#dc2626', '#9333ea', '#0891b2', '#65a30d',
    '#6b7280', '#f59e0b',
  ];

  const applyLink = useCallback(() => {
    if (!linkUrl.trim()) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }
    setLinkUrl('');
    setShowLinkInput(false);
  }, [editor, linkUrl]);

  const insertImage = useCallback(() => {
    if (imageUrl.trim()) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
    }
    setImageUrl('');
    setShowImageInput(false);
  }, [editor, imageUrl]);

  return (
    <div className="border-b border-gray-200 bg-gray-50 rounded-t-xl">
      {/* Main toolbar row */}
      <div className="flex flex-wrap items-center gap-0.5 p-2">
        {/* History */}
        <Btn title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo2 className="w-4 h-4" />
        </Btn>
        <Btn title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo2 className="w-4 h-4" />
        </Btn>
        <Sep />

        {/* Block type */}
        <Btn title="Paragraph" active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()}>
          <Pilcrow className="w-4 h-4" />
        </Btn>
        <Btn title="Heading 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <Heading1 className="w-4 h-4" />
        </Btn>
        <Btn title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="w-4 h-4" />
        </Btn>
        <Btn title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="w-4 h-4" />
        </Btn>
        <Sep />

        {/* Inline formatting */}
        <Btn title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="w-4 h-4" />
        </Btn>
        <Btn title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="w-4 h-4" />
        </Btn>
        <Btn title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="w-4 h-4" />
        </Btn>
        <Btn title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className="w-4 h-4" />
        </Btn>
        <Btn title="Inline code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code className="w-4 h-4" />
        </Btn>
        <Sep />

        {/* Text color */}
        <div className="relative">
          <Btn title="Text colour" active={showColor} onClick={() => setShowColor(v => !v)}>
            <Palette className="w-4 h-4" />
          </Btn>
          {showColor && (
            <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg p-2 grid grid-cols-6 gap-1 w-40">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  title={c}
                  onClick={() => { editor.chain().focus().setColor(c).run(); setShowColor(false); }}
                  className="w-6 h-6 rounded-md border border-gray-200 hover:scale-110 transition-transform"
                  style={{ background: c }}
                />
              ))}
              <button
                type="button"
                title="Remove colour"
                onClick={() => { editor.chain().focus().unsetColor().run(); setShowColor(false); }}
                className="col-span-6 text-xs text-gray-500 hover:text-red-500 mt-1 py-1 border-t border-gray-100"
              >
                Remove colour
              </button>
            </div>
          )}
        </div>
        <Sep />

        {/* Alignment */}
        <Btn title="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
          <AlignLeft className="w-4 h-4" />
        </Btn>
        <Btn title="Align centre" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
          <AlignCenter className="w-4 h-4" />
        </Btn>
        <Btn title="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
          <AlignRight className="w-4 h-4" />
        </Btn>
        <Btn title="Justify" active={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
          <AlignJustify className="w-4 h-4" />
        </Btn>
        <Sep />

        {/* Lists */}
        <Btn title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="w-4 h-4" />
        </Btn>
        <Btn title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="w-4 h-4" />
        </Btn>
        <Btn title="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="w-4 h-4" />
        </Btn>
        <Btn title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="w-4 h-4" />
        </Btn>
        <Sep />

        {/* Link */}
        <Btn title="Insert link" active={editor.isActive('link') || showLinkInput} onClick={() => { setShowLinkInput(v => !v); setLinkUrl(editor.getAttributes('link').href ?? ''); }}>
          <LinkIcon className="w-4 h-4" />
        </Btn>
        {editor.isActive('link') && (
          <Btn title="Remove link" onClick={() => editor.chain().focus().unsetLink().run()}>
            <Link2Off className="w-4 h-4" />
          </Btn>
        )}
        <Btn title="Insert image" active={showImageInput} onClick={() => setShowImageInput(v => !v)}>
          <ImageIcon className="w-4 h-4" />
        </Btn>
      </div>

      {/* Link input row */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-200 bg-blue-50">
          <LinkIcon className="w-4 h-4 text-blue-500 shrink-0" />
          <input
            autoFocus
            type="url"
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') applyLink(); if (e.key === 'Escape') setShowLinkInput(false); }}
            placeholder="https://example.com"
            className="flex-1 text-sm px-2 py-1 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
          <button type="button" onClick={applyLink} className="text-xs font-semibold px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Apply
          </button>
          <button type="button" onClick={() => setShowLinkInput(false)} className="text-xs text-gray-500 hover:text-gray-700">
            Cancel
          </button>
        </div>
      )}

      {/* Image input row */}
      {showImageInput && (
        <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-200 bg-indigo-50">
          <ImageIcon className="w-4 h-4 text-indigo-500 shrink-0" />
          <input
            autoFocus
            type="url"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') insertImage(); if (e.key === 'Escape') setShowImageInput(false); }}
            placeholder="https://example.com/image.jpg"
            className="flex-1 text-sm px-2 py-1 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />
          <button type="button" onClick={insertImage} className="text-xs font-semibold px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Insert
          </button>
          <button type="button" onClick={() => setShowImageInput(false)} className="text-xs text-gray-500 hover:text-gray-700">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Editor component (exported) ─────────────────────────────── */
interface NewsletterEditorProps {
  onChange: (html: string) => void;
  initialContent?: string;
}

export function NewsletterEditor({ onChange, initialContent = '' }: NewsletterEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-purple-600 underline' } }),
      Image.configure({ inline: false, HTMLAttributes: { class: 'max-w-full rounded-lg my-3' } }),
      Placeholder.configure({ placeholder: 'Start writing your newsletter…' }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[320px] prose prose-purple max-w-none text-sm leading-relaxed p-4',
      },
    },
    immediatelyRender: false,
  });

  // Re-init if initialContent prop changes externally (e.g. on reset)
  useEffect(() => {
    if (editor && initialContent === '' && editor.getText() !== '') {
      editor.commands.clearContent();
    }
  }, [initialContent, editor]);

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-all">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
