import { API_BASE_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({params}) {

    console.log("params", params);

    const req = await fetch(API_BASE_URL+"/api/playground/dir_list/"+params.id);

    const res = await req.json();

    const tree = res

    return json(tree)

};