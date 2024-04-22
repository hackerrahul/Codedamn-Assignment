<script>
    import { FolderClosed, FolderOpen } from "lucide-svelte";
    import Explorer from './Explorer.svelte';
    import { onMount } from "svelte";

    export let child

    let show = false
</script>

<button class="none w-full flex none p-1 hover:bg-accent" on:click={() => {
    show = !show
    
}}>
    
    <div class="flex items-center gap-2">
        {#if show}
            <FolderOpen class="w-4 h-4 text-zinc-500" />
        {:else}
            <FolderClosed class="w-4 h-4 text-zinc-500" />

        {/if}
        <p class="text-xs">{child.name}</p>
    </div>

</button>

{#if show}
    {#if child.children}
        
        <div class="px-4 border-l">
            <Explorer child={child.children} />
        </div>
    {/if}

{/if}