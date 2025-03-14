import { Injectable } from '@nestjs/common'

import type { Prisma, User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'

import { ChangeStreamInfoInput } from './input/change-stream-info.inputs'
import { FiltresInput } from './input/filters.input'

@Injectable()
export class StreamService {
	constructor(private readonly prismaService: PrismaService) {}

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
				user: true
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
				user: true
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
				title
			}
		})

		return true
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
