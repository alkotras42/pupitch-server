import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from 'class-validator'

import { NewPasswordInput } from '@/src/modules/auth/password-recovery/inputs/new-password.input'

@ValidatorConstraint({ name: 'isPasswordMatching', async: false })
export class IsPasswordMatching implements ValidatorConstraintInterface {
	validate(
		passwordRepeat: string,
		validationArguments?: ValidationArguments
	): Promise<boolean> | boolean {
		const object = validationArguments.object as NewPasswordInput

		return object.password === passwordRepeat
	}

	defaultMessage(validationArguments?: ValidationArguments): string {
		return 'Passwords do not match'
	}
}
