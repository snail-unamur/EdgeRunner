import { publicProcedure } from '@/trpc';
import { getClient, lspRouterInputSchema } from '../clients';
import { declarationParamsSchema } from '@/schemas/exportedSchemas';

export const declarationInputSchema = lspRouterInputSchema.extend({
    options: declarationParamsSchema,
});
export const declarationRoute = publicProcedure
    .input(declarationInputSchema)
    .query(async ({ input }) => {
        const client = getClient(input.language);
        return await client.request(
            'textDocument/declaration',
            input.options,
            undefined
        );
    });