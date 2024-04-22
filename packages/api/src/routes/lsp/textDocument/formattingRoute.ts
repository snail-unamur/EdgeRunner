import { publicProcedure } from '@/trpc';
import { documentFormattingParamsSchema } from '@/schemas/zodSchemas';
import { getClient, lspRouterInputSchema } from '../clients';
import { TextEdit } from '@/schemas/models';
import fs from 'node:fs';
import { applyTextEdits } from '@/utils';
import { z } from 'zod';

export const documentFormattingInputSchema = lspRouterInputSchema.extend({
    options: documentFormattingParamsSchema,
});

export const documentFormattingRoute = publicProcedure
    .input(documentFormattingInputSchema)
    .output(z.string())
    .query(async ({ input }) => {
        const client = getClient(input.language, input.workspaceID);
        const response = (await client.sendRequest(
            'textDocument/formatting',
            input.options
        )) as TextEdit[] | null;

        const file = input.options.textDocument.uri.replace('file://', '');
        const content = fs.readFileSync(file, 'utf-8');
        const newContent = applyTextEdits(content, response ?? []);

        fs.writeFileSync(file, newContent, 'utf-8');

        return newContent;
    });