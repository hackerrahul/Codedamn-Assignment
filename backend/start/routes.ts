/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import PlaygroundsController from '#controllers/playgrounds_controller'
import router from '@adonisjs/core/services/router'

// router.on('/').render('pages/home')


router.group(() => {

  router.get('/images/list', [PlaygroundsController, 'list_images'])

  router.post('/create/:image_id?', [PlaygroundsController, 'create_image_playground'])

  router.get('/list', [PlaygroundsController, 'list_playgrounds']);
  router.get('/dir_list/:playground?', [PlaygroundsController, 'list_dir_of_playground']);
  router.get('/file_content/:playground?', [PlaygroundsController, 'get_file_contents_of_playground']);

  router.get('/:playground?', [PlaygroundsController, 'get_playground_by_id'])

  router.put('/file_edit/:playground?', [PlaygroundsController, 'edit_file'])

}).prefix('/api/playground')
