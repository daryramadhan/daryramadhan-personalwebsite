import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import { Bold, Italic, Link as LinkIcon, Heading1, Heading2, Quote, Image as ImageIcon, List, ListTodo } from 'lucide-react';

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
            BubbleMenuExtension,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
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
                class: 'prose prose-lg prose-gray max-w-none focus:outline-none min-h-[300px] [&_p]:min-h-[1em] [&_p:empty]:min-h-[1em] leading-loose',
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
            <div className="border-b border-gray-100 bg-gray-50 p-2 flex gap-2 overflow-x-auto items-center">
                <button
                    onClick={handleImageClick}
                    disabled={uploading}
                    title="Upload Image"
                    className="p-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-50 flex items-center gap-2"
                >
                    <ImageIcon className="w-4 h-4" />
                    {uploading ? 'Uploading...' : 'Insert Image'}
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

            {editor && (
                <BubbleMenu
                    editor={editor}
                    className="flex bg-gray-900 text-white rounded-lg shadow-xl overflow-hidden py-1 px-1 gap-1 border border-gray-800"
                >
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-2 rounded hover:bg-gray-800 transition-colors ${editor.isActive('bold') ? 'bg-gray-800 text-green-400' : ''}`}
                        title="Bold"
                    >
                        <Bold className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-2 rounded hover:bg-gray-800 transition-colors ${editor.isActive('italic') ? 'bg-gray-800 text-green-400' : ''}`}
                        title="Italic"
                    >
                        <Italic className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-700 my-auto mx-1"></div>

                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`p-2 rounded hover:bg-gray-800 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-800 text-green-400' : ''}`}
                        title="Heading 1"
                    >
                        <Heading1 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`p-2 rounded hover:bg-gray-800 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-800 text-green-400' : ''}`}
                        title="Heading 2"
                    >
                        <Heading2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`p-2 rounded hover:bg-gray-800 transition-colors ${editor.isActive('blockquote') ? 'bg-gray-800 text-green-400' : ''}`}
                        title="Quote"
                    >
                        <Quote className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-700 my-auto mx-1"></div>

                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-2 rounded hover:bg-gray-800 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-800 text-green-400' : ''}`}
                        title="Bullet List"
                    >
                        <List className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleTaskList().run()}
                        className={`p-2 rounded hover:bg-gray-800 transition-colors ${editor.isActive('taskList') ? 'bg-gray-800 text-green-400' : ''}`}
                        title="Task List"
                    >
                        <ListTodo className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-700 my-auto mx-1"></div>

                    <button
                        onClick={() => {
                            if (editor.isActive('link')) {
                                editor.chain().focus().unsetLink().run();
                                return;
                            }
                            const url = window.prompt('URL');
                            if (url) {
                                editor.chain().focus().setLink({ href: url }).run();
                            }
                        }}
                        className={`p-2 rounded hover:bg-gray-800 transition-colors ${editor.isActive('link') ? 'bg-gray-800 text-green-400' : ''}`}
                        title="Link"
                    >
                        <LinkIcon className="w-4 h-4" />
                    </button>
                </BubbleMenu>
            )}

            <div className="p-4">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
