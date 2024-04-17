<script>
    import { Button } from "$lib/components/ui/button";
    import { Home, SquareTerminal } from 'lucide-svelte';

</script>
<div class="w-14 h-full border-r">
    
    <div class="h-full flex flex-col items-center ">
        <div class="border-b py-1 flex justify-center">
            <img class="w-10" src="https://wsrv.nl/?url=https%3A%2F%2Fcodedamn.com%2Fassets%2Fimages%2Ffavicons%2Ffavicon-96x96.png&w=60&q=81&output=webp" alt="">
        </div>
        <div class="flex flex-col gap-2 py-2">
            <Button href="/" variant="outline" size="icon">
                <Home class="size-5" />
            </Button>
            <Button href="/playground" variant="outline" size="icon">
                <SquareTerminal class="size-5" />
            </Button>
        </div>
    </div>

</div>