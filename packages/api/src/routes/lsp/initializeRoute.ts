import { publicProcedure } from '@/trpc';
import {
    initializeParamsSchema,
    initializeResultSchema,
} from '@/schemas/zodSchemas';
import { getClient, lspRouterInputSchema } from './clients';

export const initializeInputSchema = lspRouterInputSchema.extend({
    options: initializeParamsSchema,
});

export const initializeRoute = publicProcedure
    .input(initializeInputSchema)
    .output(initializeResultSchema)
    .mutation(async ({ input }) => {
        const client = getClient(input.language, input.workspaceID);
        return await client.sendRequest('initialize', input.options);
    });
