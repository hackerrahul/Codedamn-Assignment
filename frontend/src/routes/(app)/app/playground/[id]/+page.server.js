import { API_BASE_URL } from '$env/static/private';

export async function load({params}) {

    const playground = params.id

    const req = await fetch(API_BASE_URL+"/api/playground/"+playground);

    const res = await req.json();

    return {
        playground: res.data
    }
};