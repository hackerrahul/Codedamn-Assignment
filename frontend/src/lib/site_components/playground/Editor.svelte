<script>
    import { onDestroy, onMount } from 'svelte';

    let editor
    let monaco
    let editorContainer

    onMount(async () => {
        // Import our 'monaco.ts' file here
        // (onMount() will only be executed in the browser, which is what we want)
        monaco = (await import('./moaco')).default;

        // Your monaco instance is ready, let's display some code!
        const editor = monaco.editor.create(editorContainer);
        const model = monaco.editor.createModel(
            "console.log('Hello from Monaco! (the editor, not the city...)')",
            'javascript'
        );
        editor.setModel(model);
    });

    onDestroy(() => {
        monaco?.editor.getModels().forEach((model) => model.dispose());
        editor?.dispose();
    });
</script>

<div>
    <div class="container" bind:this={editorContainer} />
</div>

<style>
    .container {
        width: 100%;
        height: 600px;
    }
</style>