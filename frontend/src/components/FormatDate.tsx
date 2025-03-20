export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata"
    }).format(date);
}
