/**
 * Validates if the content is meaningful (not null, not "null", not empty after trim)
 */
export function isValidContent(val) {
    if (val === null || val === undefined) return false;
    const str = String(val).trim();
    return str !== "" && str.toLowerCase() !== "null";
}

/**
 * Gets multilingual content from an object with a fallback chain.
 * Default chain: Current Lang -> Thai (Th) -> English (En) -> Chinese (Cn) -> original field
 * 
 * @param {Object} item - The data object (Article, Category, etc.)
 * @param {string} field - The base field name (e.g., 'title', 'content')
 * @param {string} currentLang - The preferred language suffix (e.g., 'Th', 'En', 'Cn')
 * @returns {string} - The first valid content found in the chain
 */
export function getMultilingualContent(item, field, currentLang = "Th") {
    if (!item) return "";

    // Normalize currentLang to capitalized suffix (th -> Th, th-TH -> Th)
    const normalized = String(currentLang || "Th").split('-')[0].toLowerCase();
    const langSuffix = normalized.charAt(0).toUpperCase() + normalized.slice(1);

    // Helper to validate content
    const isValid = (val) => val !== null && val !== undefined && String(val).trim() !== "" && String(val).toLowerCase() !== "null";

    // 1. Try Primary (Preferred) Language
    const primaryKey = `${field}${langSuffix}`;
    if (isValid(item[primaryKey])) return item[primaryKey];

    // 2. Fallback Chain: Th -> En -> Cn
    const fallbacks = ["Th", "En", "Cn"];
    for (const suffix of fallbacks) {
        // Skip if it's the same as primary (already checked)
        if (suffix === langSuffix) continue;

        const val = item[`${field}${suffix}`];
        if (isValid(val)) return val;
    }

    // 3. Last resort: base field (if it exists and is valid)
    if (isValid(item[field])) return item[field];

    return "";
}
