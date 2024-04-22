<script>
    import * as Card from "$lib/components/ui/card/index.js";
    import CreatePlaygroundModal from "$lib/site_components/modals/CreatePlaygroundModal.svelte";
    import * as Table from "$lib/components/ui/table/index.js";
    import { Button } from "$lib/components/ui/button";

    export let data;

    let selected_image = null

    function select_image(image){
        selected_image = image
    }

</script>

<div class="max-w-7xl mx-auto px-2 py-4">

    <div>
        <p class="text-xl font-mono font-semibold">Create playgrounds</p>
        <p class="font-mono text-sm">All avaiable images to choose from</p>
    </div>

    <div class="grid grid-col-1 lg:grid-cols-3 py-8 gap-4">
        <!-- Images available -->
        {#each data.images as image}
            <CreatePlaygroundModal bind:selected_image >
                <Card.Root slot="trigger" on:click={() => select_image(image)} class="hover:border-white transition-all ease-in-out cursor-pointer select-none">
                    <Card.Content class="grid gap-8 py-4">
                        <div class="flex items-center gap-4">
                            <img src={image.icon} class="w-10" alt="">
                            <div class="grid gap-1">
                                <p class="text-sm font-medium leading-none text-left">{image.name}</p>
                                <p class="text-sm text-muted-foreground text-left">{image.description}</p>
                            </div>
                        </div>
                    </Card.Content>
                </Card.Root>
            </CreatePlaygroundModal>

        {/each}

    </div>

</div>

<div class="max-w-7xl mx-auto px-2 py-4">

    <div>
        <p class="text-xl font-mono font-semibold">My playgrounds ({data.playgrounds.length})</p>
    </div>

    <div>
        <!-- Images available -->
        <Table.Root>
            <Table.Caption>All active Playground.</Table.Caption>
            <Table.Header>
                <Table.Row>
                <Table.Head>Image</Table.Head>
                <Table.Head>Name</Table.Head>
                <Table.Head>PORT</Table.Head>
                <Table.Head class="text-right">Action</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each data.playgrounds as p, i (i)}
                <Table.Row>
                    <Table.Cell>
                        <img src={p.image.icon} class="w-10" alt={p.image.name}>
                    </Table.Cell>
                    <Table.Cell class="font-medium">{p.name}</Table.Cell>
                    <Table.Cell>{p.port}</Table.Cell>
                    <Table.Cell class="text-right">
                        <Button href={`/app/playground/${p.id}`}>
                            Enter Playground
                        </Button>
                    </Table.Cell>
                </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>

    </div>

</div>