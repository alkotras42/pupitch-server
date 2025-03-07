import { rejects } from 'assert'
import { ReadStream } from 'fs'

/**
 * Validates the file format of a given filename against a list of allowed formats.
 *
 * @param filename - The filename to validate.
 * @param Allowedformats - An array of allowed file formats.
 * @returns `true` if the file format is allowed, `false` otherwise.
 */
export function validateFileFormat(filename: string, Allowedformats: string[]) {
	const fileParts = filename.split('.')
	const extantion = fileParts[fileParts.length - 1]
	return Allowedformats.includes(extantion)
}

/**
 * Validates the size of a file stream against an allowed file size.
 *
 * @param fileStream - The file stream to validate.
 * @param allowedFileSize - The maximum allowed file size in bytes.
 * @returns A Promise that resolves to `true` if the file size is within the allowed limit, `false` otherwise.
 */
export async function validateFileSize(
	fileStream: ReadStream,
	allowedFileSize: number
) {
	return new Promise((resolve, reject) => {
		let fileSizeInBytes = 0

		fileStream
			.on('data', (data: Buffer) => {
				fileSizeInBytes = data.byteLength
			})
			.on('end', () => {
				resolve(fileSizeInBytes <= allowedFileSize)
			})
			.on('error', error => {
				reject(error)
			})
	})
}
