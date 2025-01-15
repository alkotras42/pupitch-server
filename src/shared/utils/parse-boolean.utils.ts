/**
 * Parses a string value to a boolean.
 *
 * @param value - The string value to parse.
 * @returns The parsed boolean value.
 * @throws {Error} If the input value cannot be parsed to a boolean.
 */
export function parseBoolean(value: string): boolean {
    if (typeof value === 'boolean') {
        return value
    }

    if (typeof value === 'string') {
        const lowerValue = value.trim().toLowerCase()
        if (lowerValue === 'true') {
            return true
        }
        if (lowerValue === 'false') {
            return false
        }
    }

    throw new Error(`
        Не удалось преобразовать значение ${value} в логическое значеиен`)
}