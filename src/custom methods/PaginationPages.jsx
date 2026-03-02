export const getPaginationPages = (currentPage, totalPages) => {
    const pages = [];

    if (totalPages <= 5) {
        // agar pages kam hain
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    }

    // Always show first page
    pages.push(1);

    // Left dots
    if (currentPage > 3) {
        pages.push("...");
    }

    // Middle pages
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    // Right dots
    if (currentPage < totalPages - 2) {
        pages.push("...");
    }

    // Always show last page
    pages.push(totalPages);

    return pages;
};
