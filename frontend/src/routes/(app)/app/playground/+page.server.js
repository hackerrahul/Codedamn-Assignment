import { API_BASE_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load() {

    const req = await fetch(API_BASE_URL+"/api/playground/images/list");

    const res = await req.json();

    const playground_req = await fetch(API_BASE_URL+"/api/playground/list");

    const playground_res = await playground_req.json();

    console.log(playground_res);

    return {
        images: res.data,
        playgrounds: playground_res.data
    }
};

export const actions = {
	create: async ({request, cookies}) => {


		const body = await request.formData();

        const name = body.get('name').trim();
        const port = body.get('port').trim();
        const image_id = body.get('image_id')

        if(!name){
            
            return fail(402, {
                name,
                name_missing: true,
                message: "Name is required"
            })
        }

        if(!port){
            
            return fail(402, {
                port,
                port_missing: true,
                message: "PORT is required"
            })
        }

        const req = await fetch(API_BASE_URL+"/api/playground/create", {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                port,
                image_id
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const res = await req.json();
        
        return res
    }
};