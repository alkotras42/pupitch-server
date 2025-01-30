import type { Request } from 'express'
import { lookup } from 'geoip-lite'
import * as countries from 'i18n-iso-countries'

import type { SessionMetadata } from '../types/session-metadata.types'

import { IS_DEV_ENV } from './is-dev.util'

import DeviceDetector = require('device-detector-js')

countries.registerLocale(require('i18n-iso-countries/langs/en.json'))

export function getSessionMetadata(
	req: Request,
	userAgent: string
): SessionMetadata {
	// 	Determines the IP address of the client making the request, using various headers and fallbacks.

	//  If the application is running in a development environment, a hardcoded IP address is returned. Otherwise, the following logic is used:
	//  - If the `cf-connecting-ip` header is present and an array, the first value is used.
	//  - If the `cf-connecting-ip` header is present and a string, it is used.
	//  - If the `x-forwarded-for` header is present and a string, the first value (before the first comma) is used.
	//  - As a final fallback, the `req.ip` value is used.
	const ip = IS_DEV_ENV
		? '173.166.164.121'
		: Array.isArray(req.headers['cf-connecting-ip'])
			? req.headers['cf-connecting-ip'][0]
			: req.headers['cf-connecting-ip'] ||
				(typeof req.headers['x-forwarded-for'] === 'string'
					? req.headers['x-forwarded-for'].split(',')[0]
					: req.ip)

	const location = lookup(ip)
	const device = new DeviceDetector().parse(userAgent)

	return {
		location: {
			country: countries.getName(location?.country, 'en', {
				select: 'official'
			}),
			city: location?.city,
			latidute: location?.ll[0],
			longitude: location?.ll[1]
		},
		device: {
			browser: device?.client?.name,
			os: device?.os?.name,
			type: device?.device?.type
		},
		ip
	}
}
