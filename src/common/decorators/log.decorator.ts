import {
    createParamDecorator,
    ExecutionContext,
} from '@nestjs/common';
import { Color } from '../enums/colors.enum';
import { LogC } from '../utils/logc';

/**
 * Decorator with parameters
 * ex: default value
 */
export const Log = createParamDecorator(
    (defaultValue: string, ctx: ExecutionContext) => {
        LogC.log(`\nMethods ${ defaultValue } called`, Color.FgGreen);
        return '';
    },
);