export interface PaginationOptions {
    terms?: string;
    page?: number; // Current page number (default: 1)
    limit?: number; // Items per page (default: 20)
}

interface PaginationResult<T> {
    data: T[]; // Fetched items
    totalDocs: number; // Total number of documents
    totalPages: number; // Total number of pages
    hasPrevPage: boolean; // Is there a previous page?
    hasNextPage: boolean; // Is there a next page?
    page: number; // Current page number
    limit: number; // Items per page
}

/**
 * A generic pagination function that supports any data source.
 * @param fetchData A function to fetch paginated data with offset and limit.
 * @param countData A function to count the total number of items.
 * @param options Pagination options (page, limit).
 * @returns A promise that resolves to paginated data with metadata.
 */
export default async function paginate<T>(
    fetchData: (offset: number, limit: number) => Promise<T[]>,
    countData: () => Promise<number>,
    options?: PaginationOptions
): Promise<PaginationResult<T>> {
    const page = Math.max(1, options?.page || 1); // Default to page 1
    const limit = Math.max(1, options?.limit || 20); // Default to 20 items per page
    const offset = (page - 1) * limit;

    // Fetch total document count and paginated data
    const [totalDocs, data] = await Promise.all([
        countData(),
        fetchData(offset, limit)
    ]);

    const totalPages = Math.ceil(totalDocs / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    return {
        data,
        totalDocs,
        totalPages,
        hasPrevPage,
        hasNextPage,
        page,
        limit,
    };
}

export async function parseQuery(query: any): Promise<PaginationOptions> {
    const page = query.page ? parseInt(query.page, 10) : undefined;
    const limit = query.limit ? parseInt(query.limit, 10) : undefined;
    const terms = query.terms ? query.terms : undefined;
    return { terms, page, limit };
}