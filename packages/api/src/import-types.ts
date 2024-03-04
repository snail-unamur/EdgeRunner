import * as cheerio from 'cheerio';
import * as fs from 'fs';

void (async () => {
    const page =
        'https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/';
    const lspSpec = await fetch(page);
    const lspSpecText = await lspSpec.text();
    const $ = cheerio.load(lspSpecText);
    const items = $('.language-typescript.highlighter-rouge');
    const lspSpecItems = items.toArray().map((item) => $(item).text());
    fs.writeFileSync(
        __dirname + '/schemas/models.ts',

        'export type array = any[];\n' +
            lspSpecItems
                .map((x) => {
                    x = x.trim();
                    if (x[0] === '{') return '';
                    if (x[0] === '[') return '';
                    return x;
                })
                .join('\n')
    );
    console.log(lspSpecItems);
})();
