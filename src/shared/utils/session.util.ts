import { InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Request } from 'express'

import type { User } from '@/prisma/generated'

import type { SessionMetadata } from '../types/session-metadata.types'

export function saveSession(
	req: Request,
	user: User,
	metadata: SessionMetadata
) {
	return new Promise((resolve, reject) => {
		req.session.userId = user.id
		req.session.createdAt = new Date()
		req.session.metadata = metadata

		req.session.save(err => {
			if (err) {
				return reject(new InternalServerErrorException(err))
			}

			resolve(user)
		})
	})
}

export function destroySession(req: Request, configService: ConfigService) {
	return new Promise((resolve, reject) => {
		req.session.destroy(err => {
			if (err) {
				return reject(new InternalServerErrorException(err))
			}
			req.res.clearCookie(
				configService.getOrThrow<string>('SESSION_NAME')
			)
			resolve(true)
		})
	})
}
