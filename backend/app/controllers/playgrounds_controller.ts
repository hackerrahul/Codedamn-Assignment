import Image from '#models/image'
import type { HttpContext } from '@adonisjs/core/http'
import DockerAdapter from '../containers/DockerAdapter.js';
import Playground from '#models/playground';
import path from 'path';
import DirectoryReader from '#services/DirectoryReader';

export default class PlaygroundsController {

  async list_images({}: HttpContext){

    const list = await Image.query().where('is_active', 1).select()

    return {
      success: true,
      message: "All Available Images",
      data: list
    }

  }

  async get_playground_by_id({params}: HttpContext){

    const { playground } = params;

    const details = await Playground.query().preload('image').where('id', playground).first();

    return {
      success: true,
      data: details
    }
  }

  async create_image_playground({request}: HttpContext){
    const body = request.body();

    const {image_id, port, name} = body

    if(image_id && port && name){

      // insert into db
      const create_container = await DockerAdapter.create_image_container(image_id, port);

      if(create_container.success){
        const create_playground = await Playground.create({
          volume_name: create_container.volume?.name,
          image_id_fk: image_id,
          container_id: create_container.container?.id,
          name: name,
          volume_path: create_container.volume?.path,
          port
        })

        return {
          success: true,
          message: "Playground Created Successfully",
          data: create_playground
        }
      }else{
        return create_container
      }


    }else{
      return {
        success: false,
        message: "Missing Required Parameters"
      }
    }

  }

  async list_playgrounds(){
    // const containers = await DockerAdapter.list_containers();
    const list = await Playground.query().preload('image')

    return {
      success: true,
      message: "All active playgrounds",
      data: list
    }
  }



  async list_dir_of_playground({params}: HttpContext){

    const { playground } = params;

    const details = await Playground.query().preload('image').where('id', playground).first();

    const mount = path.resolve(details!.volume_path);

    console.log(details);

    const tree= await DirectoryReader.readDirectory(mount)

    return tree
  }

  async get_file_contents_of_playground({params, request}: HttpContext){

    const { playground } = params;
    const file_path = request.input('path');

    const details = await Playground.query().preload('image').where('id', playground).first();

    const file = path.resolve(file_path);

    const content = await DirectoryReader.readFileContents(file)

    return content

  }

  async edit_file({params, request}: HttpContext){

    const { playground } = params;
    const file_path = request.input('path');

    const file = path.resolve(file_path);

    const body = request.raw();

    console.log(file);


    const write = await DirectoryReader.writeFileContents(file, body!)

    return {
      success: true
    }


  }

}
