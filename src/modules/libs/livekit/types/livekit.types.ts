import type { FactoryProvider, ModuleMetadata } from '@nestjs/common'

export const LivekitOptionsSymbol = Symbol('LivekitOptionsSymbol')

export type TypeLivekitOptions = {
	apiKey: string
	apiSecret: string
	apiUrl: string
}

export type TypeLivekitAsyncOptions = Pick<ModuleMetadata, 'imports'> &
	Pick<FactoryProvider<TypeLivekitOptions>, 'useFactory' | 'inject'>
