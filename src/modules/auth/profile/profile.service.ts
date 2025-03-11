import { ConflictException, Injectable } from '@nestjs/common'
import * as Upload from 'graphql-upload/Upload.js'
import * as sharp from 'sharp'

import { User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'

import { StorageService } from '../../libs/storage/storage.service'

import { ChangeProfileInfoInput } from './inputs/change-profile-info.input'
import { SocialLinkInput } from './inputs/social-link.input'

@Injectable()
export class ProfileService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService
	) {}
	/**
	 * Updates the user's avatar with the provided file.
	 * If the user already has an avatar, it is first removed from storage.
	 * The file is then processed (resized and converted to WebP format) and uploaded to storage.
	 * Finally, the user's avatar field in the database is updated with the new file name.
	 * @param {User} user - The user whose avatar is being updated.
	 * @param {Upload} file - The file to be uploaded as the user's avatar.
	 */
	async changeAvatar(user: User, file: Upload) {
		if (user.avatar) {
			await this.storageService.remove(user.avatar)
		}

		const chunks: Buffer[] = []
		for await (const chunk of file.createReadStream()) {
			chunks.push(chunk)
		}

		const buffer = Buffer.concat(chunks)

		const fileName = `/channels/${user.id}.wepb`

		const isGif = file.filename && file.filename.endWith('.gif')

		const processedBuffer = await sharp(buffer, { animated: isGif })
			.resize(512, 512)
			.webp()
			.toBuffer()
		await this.storageService.upload(
			processedBuffer,
			fileName,
			'image/webp'
		)

		await this.prismaService.user.update({
			where: { id: user.id },
			data: { avatar: fileName }
		})

		return true
	}

	/**
	 * Removes the user's avatar from storage and database.
	 * @param {User} user - The user whose avatar is being removed.
	 */
	async removeAvatar(user: User) {
		if (!user.avatar) {
			return
		}

		await this.storageService.remove(user.avatar)

		await this.prismaService.user.update({
			where: { id: user.id },
			data: { avatar: null }
		})

		return true
	}

	/**
	 * Change info in user's profile
	 * @param user - The user whose profile is being updated.
	 * @param input - The input data for updating the user's profile.
	 */
	async changeInfo(user: User, input: ChangeProfileInfoInput) {
		const { displayName, username, bio } = input

		const isUsernameExist = await this.prismaService.user.findUnique({
			where: { username }
		})

		if (isUsernameExist && username !== user.username) {
			throw new ConflictException('Username is already taken')
		}

		await this.prismaService.user.update({
			where: { id: user.id },
			data: {
				displayName,
				username,
				bio
			}
		})

		return true
	}

	async createSocialLink(user: User, input: SocialLinkInput) {
		const { title, url } = input

		await this.prismaService.socialLink.create({
			data: {
				title,
				url,
				user: {
					connect: {
						id: user.id
					}
				}
			}
		})

		return true
	}

	async findSocialLinks(user: User) {
		const socialLinks = await this.prismaService.socialLink.findMany({
			where: {
				userId: user.id
			},
			orderBy: {
				createdAt: 'desc'
			}
		})

		return socialLinks
	}

	async updateSocialLink(id: string, input: SocialLinkInput) {
		const { title, url } = input

		await this.prismaService.socialLink.update({
			where: {
				id
			},
			data: {
				title,
				url
			}
		})

		return true
	}

	async deleteSocialLink(id: string) {
		await this.prismaService.socialLink.delete({
			where: {
				id
			}
		})

		return true
	}
}
