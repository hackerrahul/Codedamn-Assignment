<script>
    import AppSidebar from "$lib/site_components/AppSidebar.svelte";
    import "../app.pcss";
</script>


<div class="h-screen lg:overflow-hidden">

    <div class="lg:flex h-full">

        <!-- Sidebar -->
        <AppSidebar />


        <div class="w-full h-full">
            <slot />
        </div>
    </div>

</div>