import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';

import { supabase } from '../../lib/supabase';
import { useRef, useState, useEffect } from 'react';

interface EditorProps {
    content: string;
    onChange: (content: string) => void;
}

export function Editor({ content, onChange }: EditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
            }),
            Placeholder.configure({
                placeholder: 'Tell your story...',
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg prose-gray max-w-none focus:outline-none min-h-[300px] [&_p]:min-h-[1em] [&_p:empty]:min-h-[1em]',
            },
        },
    });

    // Sync content when it changes from outside (e.g. async fetch)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    const uploadImage = async (file: File) => {
        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('project-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('project-images')
                .getPublicUrl(filePath);

            if (data) {
                editor.chain().focus().setImage({ src: data.publicUrl }).run();
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            uploadImage(file);
        }
    };

    // Simple Toolbar
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="border-b border-gray-100 bg-gray-50 p-2 flex gap-2 overflow-x-auto">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={`px-2 py-1 rounded text-sm font-medium ${editor.isActive('bold') ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                    Bold
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={`px-2 py-1 rounded text-sm font-medium ${editor.isActive('italic') ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                    Italic
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`px-2 py-1 rounded text-sm font-medium ${editor.isActive('heading', { level: 2 }) ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                    H2
                </button>
                <button
                    onClick={() => {
                        const url = window.prompt('URL');
                        if (url) {
                            editor.chain().focus().setLink({ href: url }).run();
                        }
                    }}
                    className={`px-2 py-1 rounded text-sm font-medium ${editor.isActive('link') ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                    Link
                </button>
                <button
                    onClick={handleImageClick}
                    disabled={uploading}
                    className="px-2 py-1 rounded text-sm font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                >
                    {uploading ? 'Uploading...' : 'Image'}
                </button>
            </div>
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
            <div className="p-4">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
