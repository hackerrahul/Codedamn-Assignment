import { API_BASE_URL } from '$env/static/private';

/** @type {import('./$types').RequestHandler} */
export async function PUT({params, url, request}) {

    console.log("from content", params);

    const p = url.searchParams.get("p")

    const body = await request.text();

    const req = await fetch(API_BASE_URL+"/api/playground/file_edit/"+params.id+"?path="+p, {
        method: "PUT",
        headers: {
            "Content-Type": "text/plain"
        },
        body: body
    });

    const res = await req.text();


    return new Response(res)

};