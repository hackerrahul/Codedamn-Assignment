import app from '@adonisjs/core/services/app'
import { WebSocketServer } from 'ws';
import DockerAdapter from '../app/containers/DockerAdapter.js';
import * as pty from 'node-pty';

app.ready(() => {
  const wss = new WebSocketServer({ port: 8081 });

  wss.on('connection', (ws, req) => {
    let terminal: any;

    ws.on('message', async (message) => {
      const body = JSON.parse(message.toString());

      if (body.type === 'start') {
        // Start a new terminal using node-pty
        const details = await DockerAdapter.findPlayground(body.playgroundId);

        if (terminal) {
          terminal.kill(); // Ensure old terminals are closed
        }

        terminal = pty.spawn('docker', ['exec', '-it', `app_${details?.volume_name}`, 'bash'], {
          name: 'xterm-color',
          cols: 80,
          rows: 30,
          cwd: process.env.HOME,
          env: process.env,
        });

        terminal.on('data', (data:any) => {
          ws.send(JSON.stringify({ action: 'output', data }));
        });

        terminal.on('exit', (code: any, signal: any) => {
          ws.send(JSON.stringify({ action: 'exit', code, signal }));
          terminal = null;
        });


      } else if (body.type === 'command' && terminal) {
        // Send command to the terminal
        terminal.write(body.command + '\n');
      }
    });

    ws.on('close', () => {
      if (terminal) {
        terminal.kill();
        terminal = null;
      }
    });
  });
});
