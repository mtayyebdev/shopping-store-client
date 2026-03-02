export function getPlainHTML(text) {
    return (
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: text }}></div>
    )
}