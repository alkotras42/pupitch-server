const s = 1000
const m = s * 60
const h = m * 60
const d = h * 24
const w = d * 7
const y = d * 365.25

type Unit =
	| 'Years'
	| 'Year'
	| 'Yrs'
	| 'Yr'
	| 'Y'
	| 'Weeks'
	| 'Week'
	| 'W'
	| 'Days'
	| 'Day'
	| 'D'
	| 'Hours'
	| 'Hour'
	| 'Hrs'
	| 'Hr'
	| 'H'
	| 'Minutes'
	| 'Minute'
	| 'Mins'
	| 'Min'
	| 'M'
	| 'Seconds'
	| 'Second'
	| 'Secs'
	| 'Sec'
	| 's'
	| 'Milliseconds'
	| 'Millisecond'
	| 'Msecs'
	| 'Msec'
	| 'Ms'

type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>

export type StringValue =
	| `${number}`
	| `${number}${UnitAnyCase}`
	| `${number} ${UnitAnyCase}`

/**
 * Converts a string representation of a time duration to the equivalent number of milliseconds.
 *
 * The input string can be in the following formats:
 * - `"123"`: 123 milliseconds
 * - `"123ms"`: 123 milliseconds
 * - `"12s"`: 12 seconds (12 * 1000 milliseconds)
 * - `"5m"`: 5 minutes (5 * 60 * 1000 milliseconds)
 * - `"2h"`: 2 hours (2 * 60 * 60 * 1000 milliseconds)
 * - `"1d"`: 1 day (1 * 24 * 60 * 60 * 1000 milliseconds)
 * - `"1w"`: 1 week (1 * 7 * 24 * 60 * 60 * 1000 milliseconds)
 * - `"1y"`: 1 year (1 * 365.25 * 24 * 60 * 60 * 1000 milliseconds)
 *
 * @param str - The string representation of the time duration.
 * @returns The number of milliseconds represented by the input string.
 * @throws {Error} If the input string is not a valid time duration.
 */
export function ms(str: StringValue): number {
	if (typeof str !== 'string' || str.length === 0 || str.length > 100) {
		throw new Error(
			'Value provided to ms() must be a string with length between 1 and 99.'
		)
	}

	const match =
		/^(?<value>-?(?:\d+)?\.?\d+) *(?<type>milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
			str
		)

	const groups = match?.groups as { value: string; type?: string } | undefined
	if (!groups) {
		return NaN
	}
	const n = parseFloat(groups.value)
	const type = (groups.type || 'ms').toLowerCase() as Lowercase<Unit>

	switch (type) {
		case 'years':
		case 'year':
		case 'yrs':
		case 'yr':
		case 'y':
			return n * y
		case 'weeks':
		case 'week':
		case 'w':
			return n * w
		case 'days':
		case 'day':
		case 'd':
			return n * d
		case 'hours':
		case 'hour':
		case 'hrs':
		case 'hr':
		case 'h':
			return n * h
		case 'minutes':
		case 'minute':
		case 'mins':
		case 'min':
		case 'm':
			return n * m
		case 'seconds':
		case 'second':
		case 'secs':
		case 'sec':
		case 's':
			return n * s
		case 'milliseconds':
		case 'millisecond':
		case 'msecs':
		case 'msec':
		case 'ms':
			return n
		default:
			throw new Error(
				`Ошибка: единица времени ${type} была распознана, но не существует соответствующего случая. Пожалуйста, проверьте введенные данные.`
			)
	}
}
