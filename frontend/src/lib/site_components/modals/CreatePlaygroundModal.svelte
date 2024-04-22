<script>
	import { applyAction, enhance } from '$app/forms';
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { toast } from "svelte-sonner";
    import { goto, invalidateAll } from '$app/navigation';
    import { RefreshCw } from 'lucide-svelte';

    export let selected_image
    let open = false;

    $: image = selected_image

    let btn_load = false
    const handle_create = () => {
        btn_load = true
        return async ({ result }) => {
            console.log(result.data);
            
            if(result.type !== "redirect"){
                if(result.data.success){
                    await invalidateAll();
                    selected_image = null
                    toast.success(result.data.message)
                    open = false;

                    goto('/app/playground/'+result.data.data.id)
                }else{
                    toast.error(result.data.message)
                    
                }
            }

            await applyAction(result);

            btn_load = false
        };
        
    }



</script>

<Dialog.Root bind:open>
    <Dialog.Trigger>
        <slot name="trigger" />
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>
            <img src={image.icon} class="w-10 pb-3" alt="Iage Icon">
            Create Playground
        </Dialog.Title>
        <Dialog.Description>
          Create new Playground by adding few details below
        </Dialog.Description>
      </Dialog.Header>
      <form action="/app/playground?/create" method="post" use:enhance={handle_create}>
        <input type="hidden" name="image_id" value={image.id}>
        <div class="grid gap-4 py-4">
            <div>
              <Label for="name" class="text-right">Name <span class="text-red-300">*</span></Label>
              <Input id="name" type="text" name="name" class="" />
            </div>
            <div>
                <Label for="port" class="text-right">PORT <span class="text-red-300">*</span></Label>
                <Input id="port" type="number" name="port" min="3000" step="1" class="" />
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label class="text-xs text-accent-foreground">This will be dynamic in future</label>
              </div>
          </div>
          <Dialog.Footer>
            <Button disabled={btn_load} type="submit">
              {#if btn_load}
                  <RefreshCw class="mr-2 h-4 w-4 animate-spin" />
              {/if}
              Create
          </Button>
          </Dialog.Footer>
        </form>
    </Dialog.Content>
</Dialog.Root>