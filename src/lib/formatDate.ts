export function formatDate(date: Date) {
    const timeStr = date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
    });
    return `${date.toLocaleDateString()} ${timeStr.replace("AM", "am").replace("PM", "pm")}`;
}
