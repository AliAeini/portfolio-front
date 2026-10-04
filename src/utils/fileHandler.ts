export const fileHandler = ({ url }: { url?: string | null }): string | null => {
    if (!url) return null;

    if (url.startsWith('http://') || url.startsWith('https://')) return url;

    if (url.startsWith('data:')) return url;

    if (url.startsWith('blob:')) return url;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}