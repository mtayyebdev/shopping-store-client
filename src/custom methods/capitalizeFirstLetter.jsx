function capitalizeFirstLetter(str) {
    if (typeof str !== "string" || str?.length === 0) return null;
    return str.split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

export { capitalizeFirstLetter }