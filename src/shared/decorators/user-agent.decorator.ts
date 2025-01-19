import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { type Request } from 'express'

/**
 * A parameter decorator that extracts the user agent string from the incoming request.
 * 
 * This decorator can be used on a controller method parameter to automatically extract the user agent string from the request.
 * 
 * If the request is an HTTP request, the user agent string is extracted from the `user-agent` header.
 * If the request is a GraphQL request, the user agent string is extracted from the `req.headers['user-agent']` property.
 */
export const UserAgent = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		if (ctx.getType() === 'http') {
			const request = ctx.switchToHttp().getRequest() as Request
			return request.headers['user-agent']
		} else {
			const context = GqlExecutionContext.create(ctx)

			return context.getContext().req.headers['user-agent']
		}
	}
)
