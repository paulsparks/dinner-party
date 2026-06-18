export function formatDate(date: Date) {
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString().replace("AM", "am").replace("PM", "pm")}`;
}
