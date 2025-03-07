import {
	type ArgumentMetadata,
	BadRequestException,
	Injectable,
	type PipeTransform
} from '@nestjs/common'
import { ReadStream } from 'fs'

import { validateFileFormat, validateFileSize } from '../utils/file.util'

@Injectable()
/**
 * A pipe that validates the file uploaded in a request, ensuring it meets the required format and size constraints.
 * This pipe is used to validate file uploads in the application.
 */
export class FileValidationPipe implements PipeTransform {
	async transform(value: any, metadata: ArgumentMetadata) {
		if (!value.filename) throw new BadRequestException('File is required')

		const { filename, createReadStream } = value

		const fileStream = createReadStream() as ReadStream

		const allowFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp']

		const isFileFormatValid = validateFileFormat(filename, allowFormats)

		if (!isFileFormatValid)
			throw new BadRequestException('File format is not valid')

		const isFileSizeValid = await validateFileSize(
			fileStream,
			10 * 1024 * 1024
		)

		if (!isFileSizeValid)
			throw new BadRequestException('File size is too large')

		return value
	}
}
