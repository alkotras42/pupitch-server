import { v4 as uuidv4 } from 'uuid'

import { TokenType, User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'

/**
 * Generates a new token for the given user and token type.
 *
 * If `isUUID` is true, the token will be a UUID. Otherwise, it will be a 6-digit random number.
 * The token will be stored in the database with an expiration time of 5 minutes from now.
 * If the user already has a token of the same type, the existing token will be deleted.
 *
 * @param prismaService - The Prisma service instance to interact with the database.
 * @param user - The user for whom the token should be generated.
 * @param type - The type of token to generate (e.g. "reset_password", "email_verification").
 * @param isUUID - Whether the token should be a UUID (true) or a 6-digit random number (false).
 * @returns The newly created token.
 */
export async function generateToken(
	prismaService: PrismaService,
	user: User,
	type: TokenType,
	isUUID: boolean = false
) {
	let token: string

	if (isUUID) {
		token = uuidv4()
	} else {
		token = Math.floor(
			Math.random() * (1000000 - 100000) + 100000
		).toString()
	}

	const expiresIn = new Date(new Date().getTime() + 300000)

	const existingToken = await prismaService.token.findFirst({
		where: {
			user: {
				id: user.id
			},
			type
		}
	})

	if (existingToken) {
		await prismaService.token.delete({
			where: {
				id: existingToken.id
			}
		})
	}

	const newToken = await prismaService.token.create({
		data: {
			token,
			expiresIn,
			user: {
				connect: {
					id: user.id
				}
			},
			type
		},
		include: {
			user: true
		}
	})

	return newToken
}
