import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as Upload from 'graphql-upload/Upload.js'
import { AccessToken } from 'livekit-server-sdk'
import * as sharp from 'sharp'

import type { Prisma, User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'

import { StorageService } from '../libs/storage/storage.service'

import { ChangeStreamInfoInput } from './input/change-stream-info.inputs'
import { FiltresInput } from './input/filters.input'
import { GenerateStreamTokenInput } from './input/generate-stream-token.input'

@Injectable()
export class StreamService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService,
		private readonly configService: ConfigService
	) {}

	async findAll(input: FiltresInput = {}) {
		const { take, skip, searchTeam } = input

		const whereClause = searchTeam
			? this.findBySeartTeamFilter(searchTeam)
			: undefined

		const streams = await this.prismaService.stream.findMany({
			skip: skip ?? 0,
			take: take ?? 12,
			where: {
				user: {
					isDeactivated: false
				},
				...whereClause
			},
			include: {
				user: true,
				category: true
			},
			orderBy: {
				isLive: 'desc'
			}
		})

		return streams
	}

	async findRandom() {
		const total = await this.prismaService.stream.count({
			where: {
				isLive: true,
				user: {
					isDeactivated: false
				}
			}
		})

		const skip = Math.floor(Math.random() * total)

		const streams = await this.prismaService.stream.findMany({
			skip,
			take: 4,
			where: {
				isLive: true,
				user: {
					isDeactivated: false
				}
			},
			include: {
				user: true,
				category: true
			}
		})

		return streams
	}

	async updateInfo(user: User, input: ChangeStreamInfoInput) {
		const { title, categoryId } = input

		await this.prismaService.stream.update({
			where: {
				userId: user.id
			},
			data: {
				title,
				category: {
					connect: {
						id: categoryId
					}
				}
			}
		})

		return true
	}

	async changeThumbnail(user: User, file: Upload) {
		const stream = await this.findStreamByUserId(user)

		if (stream.thumbnailUrl) {
			await this.storageService.remove(stream.thumbnailUrl)
		}

		const chunks: Buffer[] = []
		for await (const chunk of file.createReadStream()) {
			chunks.push(chunk)
		}

		const buffer = Buffer.concat(chunks)

		const fileName = `/streams/${user.id}.wepb`

		const isGif = file.filename && file.filename.endWith('.gif')

		const processedBuffer = await sharp(buffer, { animated: isGif })
			.resize(1280, 720)
			.webp()
			.toBuffer()
		await this.storageService.upload(
			processedBuffer,
			fileName,
			'image/webp'
		)

		await this.prismaService.stream.update({
			where: { userId: user.id },
			data: { thumbnailUrl: fileName }
		})

		return true
	}

	async removeThumbnail(user: User) {
		const stream = await this.findStreamByUserId(user)

		if (!stream.thumbnailUrl) {
			return
		}

		await this.storageService.remove(stream.thumbnailUrl)

		await this.prismaService.stream.update({
			where: { userId: user.id },
			data: { thumbnailUrl: null }
		})

		return true
	}

	async generateStreamToken(input: GenerateStreamTokenInput) {
		const { userId, channelId } = input

		let self: { id: string; username: string }

		const user = await this.prismaService.user.findUnique({
			where: {
				id: userId
			}
		})

		if (user) {
			self = {
				id: user.id,
				username: user.username
			}
		} else {
			self = {
				id: userId,
				username: `User ${Math.floor(Math.random() * 1000000)}`
			}
		}

		const channel = await this.prismaService.stream.findUnique({
			where: {
				id: channelId
			}
		})

		if (!channel) {
			throw new NotFoundException('Channel not found')
		}

		const isStreamer = self.id === channel.id

		const token = new AccessToken(
			this.configService.getOrThrow<string>('LIVEKIT_API_KEY'),
			this.configService.getOrThrow<string>('LIVEKIT_API_SECRET'),
			{
				identity: isStreamer ? `Host-${self.id}` : self.id.toString(),
				name: self.username
			}
		)

		token.addGrant({
			room: channel.id,
			roomJoin: true,
			canPublish: false
		})

		return { token: token.toJwt() }
	}

	private async findStreamByUserId(user: User) {
		return await this.prismaService.stream.findUnique({
			where: {
				userId: user.id
			}
		})
	}

	private findBySeartTeamFilter(searchTeam: string): Prisma.StreamWhereInput {
		return {
			OR: [
				{
					title: {
						contains: searchTeam,
						mode: 'insensitive'
					},
					user: {
						username: {
							contains: searchTeam,
							mode: 'insensitive'
						}
					}
				}
			]
		}
	}
}
