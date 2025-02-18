import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { MailService } from '../libs/mail/mail.service'

@Injectable()
export class CronService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService
	) {}
	/**
	 * Deletes accounts that have been deactivated for more than 7 days.
	 */
	@Cron('0 0 * * *')
	async deleteDeactivatedAccount() {
		const sevenDaysAgo = new Date()

		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

		const deacrivatedAccount = await this.prismaService.user.findMany({
			where: {
				isDeactivated: true,
				createdAt: {
					lte: sevenDaysAgo
				}
			}
		})

		console.log('Deactivated Account', deacrivatedAccount)

		for (const user of deacrivatedAccount) {
			try {
                await this.mailService.sendDeletionMessage(user.email)
            } catch  {
                console.log('Error sending email')
            }
		}

		await this.prismaService.user.deleteMany({
			where: {
				isDeactivated: true,
				createdAt: {
					lte: sevenDaysAgo
				}
			}
		})
	}
}
