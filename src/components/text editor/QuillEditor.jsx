import React, { useEffect, useRef } from 'react'
import Quill from "quill";

const modules = {
    toolbar: [
        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
    ],
};

const formats = [
    "size",
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
];

function QuillEditor({ value = "", setValue }) {
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    useEffect(() => {
        const quill = new Quill(editorRef?.current, {
            theme: "snow",
            formats,
            modules
        });

        quillRef.current = quill;

        quill.on("text-change", () => {
            let html = quill.root.innerHTML;
            setValue(html)
        })
    }, [setValue]);

    useEffect(() => {
        if (!quillRef.current) return;
        const currentHtml = quillRef.current.root.innerHTML;
        if (value !== undefined && value !== null && currentHtml !== value) {
            quillRef.current.clipboard.dangerouslyPasteHTML(value || "");
        }
    }, [value]);

    return (
        <div ref={editorRef}></div>
    )
}

export default QuillEditor
