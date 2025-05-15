import { BadRequestException, Logger } from '@nestjs/common'
import { hash } from 'argon2'
import { connect } from 'http2'

import { Prisma, PrismaClient } from '../../../prisma/generated'

import { CATEGORIES } from './data/categories.data'
import { STREAMS } from './data/streams.data'
import { USERNAMES } from './data/users.data'

const prisma = new PrismaClient({
	transactionOptions: {
		maxWait: 5000,
		timeout: 10000,
		isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
	}
})

async function main() {
	try {
		Logger.log('Connected to database')
		await prisma.$transaction([
			prisma.user.deleteMany(),
			prisma.category.deleteMany(),
			prisma.stream.deleteMany(),
			prisma.socialLink.deleteMany()
		])

		await prisma.category.createMany({
			data: CATEGORIES
		})

		const categories = await prisma.category.findMany()

		const categoriesBysSlug = Object.fromEntries(
			categories.map(category => [category.slug, category])
		)

		await prisma.$transaction(async tx => {
			for (const username of USERNAMES) {
				const randomCategory =
					categoriesBysSlug[
						Object.keys(categoriesBysSlug)[
							Math.floor(
								Math.random() *
									Object.keys(categoriesBysSlug).length
							)
						]
					]

				const isUserExist = await tx.user.findUnique({
					where: {
						username
					}
				})

				if (!isUserExist) {
					const createdUser = await tx.user.create({
						data: {
							email: `${username}@mail.ru`,
							username,
							password: await hash('12345678'),
							displayName: username,
							avatar: `/channels/${username}.webp`,
							isEmailVerified: true,
							socialLinks: {
								createMany: {
									data: [
										{
											title: 'YouTube',
											url: `https://www.youtube.com/channel/${username}`
										},
										{
											title: 'Telegram',
											url: `https://t.me/${username}`
										}
									]
								}
							}
						}
					})

					const randomTitles = STREAMS[randomCategory.slug]
					const randomTitle =
						randomTitles[
							Math.floor(Math.random() * randomTitles.length)
						]

					await tx.stream.create({
						data: {
							title: randomTitle,
							thumbnailUrl: `streams/${createdUser.username}.webp`,
							user: { connect: { id: createdUser.id } },
							category: { connect: { id: randomCategory.id } }
						}
					})

					Logger.log(
						`User ${username} and his stream succsessfully created`
					)
				}
			}
		})
		Logger.log('Seeding succsessfully completed')
	} catch (error) {
		Logger.error(error)
		throw new BadRequestException('Error while writing in database')
	} finally {
		Logger.log('Disconnected from database')
		await prisma.$disconnect()
		Logger.log('Connection to database succsesfully closed')
	}
}

main()
