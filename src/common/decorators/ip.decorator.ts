import {
    createParamDecorator,
    ExecutionContext,
} from '@nestjs/common';

/**
 * IP decorator allows o retrieve IP of the Request automatically
 */
export const IP = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        // const request = ctx.switchToHttp().getRequest();
        // return request.he.remoteAddress;
        const request = ctx.switchToHttp().getRequest();
        return request?.headers['x-forwarded-for']?.split(',')[0] || request.connection.remoteAddress;
    },
);