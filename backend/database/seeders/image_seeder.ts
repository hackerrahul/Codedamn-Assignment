import Image from '#models/image'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    const unique_key = "slug";

    const seed_images = await Image.updateOrCreateMany(unique_key, [
      {
        name: "PHP",
        slug: "php",
        description: "PHP playground",
        icon: "https://wsrv.nl/?url=https%3A%2F%2Fcodedamn.com%2Fassets%2Fcolored-tech-icons%2Fphp.svg&w=80&q=81&output=webp",
        docker_image_name: "php:latest",
        start_command: "php -S 0.0.0.0:80 -t /app",
        template_branch: "php",

      },
      {
        name: "HTML/CSS",
        slug: "html_css",
        description: "Vanilla HTML/CSS/JS playground",
        icon: "https://wsrv.nl/?url=https%3A%2F%2Fcodedamn.com%2Fassets%2Fimages%2Fsvg%2Fhtml5.svg&w=80&q=81&output=webp",
        docker_image_name: "nginx:latest",
        start_command: "",
        template_branch: "html_css"
      },
      {
        name: "Node.js",
        slug:"node_js",
        description: "Node.js playground",
        icon: "https://wsrv.nl/?url=https%3A%2F%2Fcodedamn.com%2Fassets%2Fimages%2Fsvg%2Fnode.svg&w=80&q=81&output=webp",
        docker_image_name: "node:latest",
        start_command: "node index.js",
        template_branch: "node_js"
      },
    ])

  }
}
