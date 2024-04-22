<script>
    import { detect_language } from './../../helper/common.js';
    import { get } from 'svelte/store';
    import { active_file } from '$lib/stores/editor_file_tab';
    import { onDestroy, onMount } from 'svelte';
    import { page } from '$app/stores';
    import { invalidateAll } from '$app/navigation';
    import { toast } from 'svelte-sonner';

    export let content;

    let editor;
    let monaco;
    let editorContainer;


    async function edit_file() {
        // Retrieve the current content from the editor
        content = editor.getModel().getValue();

        const req = await fetch("/api/playground/files/" + $page.params.id + "/content/edit?p="+$active_file.fullPath, {
            method: "PUT",
            headers: {
                "Content-Type": "text/plain"
            },
            body: content
        });

        const res = await req.json();
        await invalidateAll();

        toast.success("File Saved Successfully")
    }

    onMount(async () => {
        monaco = (await import('./monaco')).default;

        const language = get(active_file) ? detect_language(get(active_file).extension) : "plaintext";

        monaco.editor.setTheme('vs-dark');

        const model = monaco.editor.createModel(content, language, monaco.Uri.file(get(active_file)?.name));
        editor = monaco.editor.create(editorContainer, {
            model: model,
            automaticLayout: true,
        });
    });

    function handleKeyDown(event) {
        // Check if Ctrl+S or Cmd+S is pressed
        if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault(); // Prevent the default save dialog
            edit_file(); // Call your save function
        }
    }

    onDestroy(() => {
        monaco?.editor.getModels().forEach((model) => model.dispose());
        editor?.dispose();
    });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="w-full h-full" on:keydown={handleKeyDown}>
    <div class="w-full h-full" bind:this={editorContainer} />
</div>
