'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Upload, X } from 'lucide-react';

const Editor = dynamic(() => import('@/components/editor'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>
});

export default function Page() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [preview, setPreview] = useState(null);
    const [tags, setTags] = useState([]);
    const [inputTag, setInputTag] = useState('')
    const [selectedCategory, setSelectedCategory] = useState(null)

    const addTag = () => {
        const trimmed = inputTag.trim()
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed])
        }

        setInputTag('')
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setPreview(URL.createObjectURL(file)); // แสดง preview ทันที
        }
    };


    const handleSave = async (status = 'draft') => {
        if (!title || !content || !selectedCategory) {
            alert('Please fill in title, content, and category.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('slug', title.toLowerCase().replace(/\s+/g, '-')); // simple slug
        formData.append('content', JSON.stringify(content));
        formData.append('categoryId', selectedCategory); // หรือ ID จริง
        formData.append('authorId', '1'); // ใส่ authorId ตามระบบ
        formData.append('status', status);
        formData.append('tags', JSON.stringify(tags));

        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        try {
            const res = await fetch('/api/articles', {
                method: 'POST',
                body: formData, // ไม่ต้อง set Content-Type เอง
            });

            const data = await res.json();
            if (res.ok) {
                alert('Content saved!');
                console.log(data);
            } else {
                alert('Error saving content: ' + data.error);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to save content.');
        }
    };


    return (
        <div className="max-w-[1250px] mx-auto min-h-screen p-8 space-y-4">
            <div className="w-full h-[400px] rounded-2xl border border-gray-300 bg-gray-200 flex items-center justify-center relative">
                {preview ? (
                    <img
                        src={preview}
                        alt="thumbnail preview"
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className='flex items-center justify-center flex-col gap-4 text-gray-500 font-bold'>
                        <Upload />
                        <span>Choose Your thumbnail</span>
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleThumbnailChange}
                />
            </div>
            <div>
                <textarea type="text" className='text-7xl font-bold w-full outline-none' placeholder='Title...' value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
                <Editor
                    data={content}
                    onChange={setContent}
                />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className='col-span-2 border rounded-2xl p-4'>
                    <div className='font-bold text-xl '>
                        Category:
                    </div>
                    <select defaultValue={selectedCategory} className="select border-1 w-full mt-4" onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option disabled>Select a Category</option>
                        <option value={'1'}>Crimson</option>
                        <option value={'1'}>Amber</option>
                        <option value={'1'}>Velvet</option>
                    </select>
                </div>
                <div className="border row-span-2 flex flex-col gap-2 p-4 rounded-2xl">
                    <div className='font-bold text-xl'>
                        Actions:
                    </div>
                    <button
                        onClick={() => handleSave('draft')}
                        className="btn bg-[#F06FAA] text-white rounded-xl border-[#F06FAA]"
                    >
                        Save as Draft
                    </button>

                    <button
                        onClick={() => handleSave('published')}
                        className="btn bg-[#3F458D] text-white rounded-xl border-[#3F458D]"
                    >
                        Save Content
                    </button>
                    <button
                        onClick={handleSave}
                        className="btn bg-white rounded-xl "
                    >
                        preview
                    </button>
                </div>
                <div className="col-span-2 border rounded-2xl p-4">
                    <div className="font-bold text-xl">Tags:</div>

                    <div className="flex mt-4 gap-2">
                        <input
                            type="text"
                            className="w-full input border-1"
                            placeholder="Type for tags"
                            value={inputTag}
                            onChange={(e) => setInputTag(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            type="button"
                            onClick={addTag}
                            className="btn px-4 py-2 rounded"
                        >
                            Add
                        </button>
                    </div>

                    {/* แสดง tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag, index) => (
                                    <div
                                        key={index}
                                        className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-full"
                                    >
                                        <span>#{tag}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <X className='h-4' />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* <pre className="mt-8 bg-gray-100 p-4 rounded">
                {JSON.stringify(content, null, 2)}
            </pre> */}
        </div>
    );
}