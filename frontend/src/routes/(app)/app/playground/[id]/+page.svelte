<script>
	import { onMount, onDestroy } from 'svelte';
    import * as Resizable from "$lib/components/ui/resizable";
    import { page } from '$app/stores';
    import Explorer from '$lib/site_components/playground/explorer/Explorer.svelte';
    import { Button } from '$lib/components/ui/button';
    import { X } from 'lucide-svelte';
    import { active_file, active_file_content, opened_files, preview_file } from '$lib/stores/editor_file_tab';
    import Editor from '$lib/site_components/playground/Editor.svelte';
    import { view_file } from '$lib/helper/common';
    import { cn } from '$lib/utils';
    import Terminal from '$lib/site_components/playground/Terminal.svelte';


    export let data;

    let loaded_explorer = false
    let tree = {}

    let show_iframe = false;

    let ws;

    async function get_files(){
        loaded_explorer = false
        const req = await fetch("/api/playground/files/"+$page.params.id);

        const res = await req.json();

        tree = res

        loaded_explorer = true
    }

    async function handle_remove_file(of){
        $opened_files = $opened_files.filter(file => file.fullPath !== of.fullPath)

        $active_file_content = null;
        $active_file = null

    }

    onMount(async () => {

        await get_files();
    })

    function handle_run_app(){
        ws.send(JSON.stringify({
            type: 'command',
            playgroundId: data.playground.id,
            command: "\x03"
        }));

        show_iframe = false
        ws.send(JSON.stringify({
            type: 'command',
            playgroundId: data.playground.id,
            command: "cd /app"
        }));

        ws.send(JSON.stringify({
            type: 'command',
            playgroundId: data.playground.id,
            command: data.playground.image.startCommand
        }));

        show_iframe = true
    }

    onDestroy(() => {
        preview_file.set(null)
        active_file.set(null);
        active_file_content.set(null)
    })

</script>

    <Resizable.PaneGroup direction="horizontal" class="h-screen w-full lg:border">

        <!-- draggable items start -->
        <Resizable.Pane defaultSize={20} collapsible class="hidden lg:flex flex-col">
            <div class="w-full sticky bg-card top-0">
                <div class="border-b w-full p-2 flex justify-between items-center h-12">
                    <p class="font-inter-600 text-sm">Explorer</p>
                </div>
            </div>


            <div class="overflow-y-auto h-full md:max-h-screen p-3 w-full">
                <!-- File tree -->
                {#if loaded_explorer}
                    <Explorer child={tree.children} />
                {/if}

            </div>


        </Resizable.Pane>
        <Resizable.Handle withHandle  />
        <Resizable.Pane defaultSize={60} collapsible>
            <Resizable.PaneGroup direction="vertical">
                <Resizable.Pane defaultSize={90} collapsible class="h-full">
                    
                    <div class="w-full sticky bg-card top-0">
                        <div class="border-b w-full p-2 flex justify-between items-center h-12">
                            <p class="font-inter-600 text-sm">Editor</p>
                            <Button variant="outline" size="sm" on:click={handle_run_app}>Run App</Button>
                        </div>

                        {#if $opened_files.length > 0 || $preview_file}
                        <div class="border-b w-full flex gap-2 items-center p-1 overflow-x-auto">
                            {#each $opened_files as of}
                                <div class="flex items-center">
                                    <Button on:click={() => view_file($page, of)} variant="outline" class={cn(
                                        "group bg-card text-accent-foreground inline-flex items-center gap-2 rounded-none border-r"
                                    )} size="sm">
                                        {of.name}
                                        
                                    </Button>
                                    <Button on:click={() => handle_remove_file(of)} size="icon"  class="w-8 h-8 rounded-none" variant="outline">
                                        <X class="w-4 h-4" />
                                    </Button>
                                </div>
                            {/each}

                            {#if $preview_file}
                                <div class="flex items-center">
                                    <Button on:click={() => view_file($page, $preview_file)}  variant="outline" class="bg-card rounded-none border-r text-accent-foreground italic inline-flex items-center gap-2" size="sm">
                                        {$preview_file.name}
                                        
                                    </Button>
                                    <Button on:click={() => {
                                        $preview_file = null
                                        $active_file_content = null;
                                        $active_file = null
                                    }} size="icon" class="w-8 h-8 rounded-none" variant="outline">
                                        <X class="w-4 h-4" />
                                    </Button>
                                </div>
                            {/if}
                        </div>

                        {/if}
                    </div>

                    <div class="overflow-y-auto h-full flex-1 md:max-h-screen w-full">
                        {#key $active_file_content}
                            <Editor content={$active_file_content} />
                        {/key}
                    </div>

                    
                </Resizable.Pane>
                <Resizable.Handle withHandle  />
                <Resizable.Pane defaultSize={10} collapsible class="w-full h-full">
                    
                    <Terminal bind:ws playground={$page.params.id} />

                </Resizable.Pane>
              </Resizable.PaneGroup>
        </Resizable.Pane>
        <Resizable.Handle withHandle  />
        <Resizable.Pane defaultSize={20} collapsible>
        
            <div class="w-full sticky bg-card top-0">
                <div class="border-b w-full p-2 flex justify-between items-center h-12">
                    <p class="font-inter-600 text-sm">Preview</p>
                </div>
            </div>


            <div class="overflow-y-auto h-full md:max-h-screen p-3 w-full">
                <!-- File tree -->
                <!-- svelte-ignore a11y-missing-attribute -->
                {#if show_iframe}
                    <iframe class="h-full w-full" src={`http://localhost:${data.playground.port}`}></iframe>
                {/if}

            </div>

        </Resizable.Pane>
    </Resizable.PaneGroup>

    