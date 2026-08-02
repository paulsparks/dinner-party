export function formatDate(date: Date) {
    const monthStr = date.toLocaleDateString(undefined, { month: "long" });
    const dateStr = `${monthStr} ${date.getDate()}`;
    const timeStr = date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
    });
    return `${dateStr}, ${timeStr.replace("AM", "am").replace("PM", "pm")}`;
}
