import { API_BASE_URL } from '$env/static/private';

/** @type {import('./$types').RequestHandler} */
export async function GET({params, url}) {

    console.log("from content", params);

    const path = url.searchParams.get("p")

    const req = await fetch(API_BASE_URL+"/api/playground/file_content/"+params.id+"?path="+path);

    const res = await req.text();


    return new Response(res)

};