<script>
    import { onMount } from 'svelte';
    import '@xterm/xterm/css/xterm.css';
    import * as xterm from '@xterm/xterm';

    export let playground;

    let terminalElement;
    let terminalController;
    export let ws;
    let commandBuffer = ''; // Buffer to accumulate command input

    function initializeXterm() {
        terminalController = new xterm.Terminal({
            cursorBlink: true,
        });

        terminalController.open(terminalElement);
        terminalController.write('Terminal ready...\r\n');

        terminalController.onData(handleInput);
    }

    function handleInput(data) {
        if (data === '\x7f') {  // Handle backspace
            if (commandBuffer.length > 0) {
                commandBuffer = commandBuffer.slice(0, -1); // Remove last character
                terminalController.write('\b \b'); // Move cursor back and erase
            }
        } else if (data === '\r') {  // Handle enter key
            ws.send(JSON.stringify({
                type: 'command',
                playgroundId: playground,
                command: commandBuffer
            }));
            terminalController.write('\r\n');  // New line in terminal
            commandBuffer = ''; // Clear buffer
        } else {
            commandBuffer += data; // Add input to buffer
            terminalController.write(data); // Echo input to terminal
        }
    }

    onMount(() => {
        initializeXterm();
        ws = new WebSocket('ws://37.27.86.131:8081');

        ws.onopen = () => {
            console.log('WebSocket connection established.');
            ws.send(JSON.stringify({ type: 'start', playgroundId: playground }));
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.action === "output") {
                terminalController.write(message.data.replace(/\n/g, '\r\n'));  // Normalize newlines for xterm
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            terminalController.write('\r\nConnection error\r\n');
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed.');
            terminalController.write('\r\nConnection closed\r\n');
        };
    });
</script>

<div id="terminal" class="w-full h-full" bind:this={terminalElement}></div>
