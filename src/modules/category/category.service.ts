import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '@/src/core/prisma/prisma.service'

@Injectable()
export class CategoryService {
	constructor(private readonly prismaService: PrismaService) {}

	async findAll() {
		return this.prismaService.category.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				streams: {
					include: {
						user: true,
						category: true
					}
				}
			}
		})
	}

	async findRandom() {
		const total = await this.prismaService.category.count()

		const skip = Math.floor(Math.random() * total)

		const categories = await this.prismaService.category.findMany({
			skip,
			take: 7,
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				streams: {
					include: {
						user: true,
						category: true
					}
				}
			}
		})

		return categories
	}

	async findBySlug(slug: string) {
		const categoty = this.prismaService.category.findUnique({
			where: {
				slug
			},
			include: {
				streams: {
					include: {
						user: true,
						category: true
					}
				}
			}
		})

		if (!categoty) throw new NotFoundException('Category not found')

		return categoty
	}
}
