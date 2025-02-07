import { Module } from '@nestjs/common'

import { SessionResolver } from './session.resolver'
import { SessionService } from './session.service'
import { VerificationService } from '../verification/verification.service'

@Module({
	providers: [SessionResolver, SessionService, VerificationService]
})
export class SessionModule {}
