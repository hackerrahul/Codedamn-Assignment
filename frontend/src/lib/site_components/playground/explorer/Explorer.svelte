<script>
    import { File } from "lucide-svelte";
    import Folder from "./Folder.svelte";
    import { createEventDispatcher } from "svelte";
    import { opened_files, preview_file } from "$lib/stores/editor_file_tab";
    import { view_file } from "$lib/helper/common";
    import { page } from '$app/stores';


    const dispatch = createEventDispatcher();

    export let child;

    async function open_file(c){

        const alreadyExists = $opened_files.some(file => file.fullPath == c.fullPath);

        // If it does not exist, add the new file to the array
        if (!alreadyExists) {
            $opened_files = [...$opened_files, c];

        }

        $preview_file = null

        await view_file($page, c);
    }

    async function handle_preview_file(c){
        const alreadyExists = $opened_files.some(file => file.fullPath === c.fullPath);

        if (!alreadyExists) {
            $preview_file = c
        }

        await view_file($page, c);
    }

</script>

{#each child as c}
    {#if c.type == "file"}
        <button class="w-full flex-none p-1 hover:bg-accent" on:click={() => handle_preview_file(c)} on:dblclick={() => open_file(c)}>
            
            <div class=" flex items-center gap-2">
                    <File class="w-4 h-4 text-zinc-500 flex-none" />

                <p class="text-xs">{c.name}</p>
            </div>

        </button>

    {:else}
        <Folder child={c} />

    {/if}
{/each}
