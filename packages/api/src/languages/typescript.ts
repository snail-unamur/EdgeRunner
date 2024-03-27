import { spawn } from 'child_process';
import { JSONRPCClient, JSONRPCResponse } from 'json-rpc-2.0';
import EventEmitter from 'node:events';
import { JSONRPCTransform } from '../utils/JSONRPCTransform';

let currentID = 1;

export const typescriptEvents = new EventEmitter();

export const getTypeScriptServer = () => {
    const p = spawn('typescript-language-server', ['--stdio'], {
        shell: true,
        stdio: 'pipe',
    });

    const stream = JSONRPCTransform.createStream(p.stdout);

    const client = new JSONRPCClient<any>(
        (jsonRPCRequest) => {
            const jsonRPCRequestStr = JSON.stringify(jsonRPCRequest);
            console.log(jsonRPCRequest['method'], currentID);
            p.stdin.write(
                `Content-Length: ${jsonRPCRequestStr.length}\r\n\r\n${jsonRPCRequestStr}`
            );
        },
        () => currentID++
    );

    stream.on('data', (jsonRPCResponseOrRequest: string) => {
        const jsonrpc = JSON.parse(jsonRPCResponseOrRequest);
        if (Object.prototype.hasOwnProperty.call(jsonrpc, 'id')) {
            const jsonRPCResponse: JSONRPCResponse = jsonrpc as JSONRPCResponse;
            client.receive(jsonRPCResponse);
        } else {
            typescriptEvents.emit('notification', jsonrpc);
            if (jsonrpc.params?.message) {
                //console.log('notif', jsonrpc.params.message);
            }
        }
    });

    return { stream, client };
};
