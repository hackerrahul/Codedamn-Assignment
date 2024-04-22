import { exec as execCallback, spawn, SpawnOptionsWithoutStdio } from 'child_process';
import { promisify } from 'util';
import Image from '#models/image';
import path from 'path';
import Playground from '#models/playground';

class DockerAdapter{
  private github_templates_url = "https://github.com/hackerrahul/codedamn_playground_templates.git"
  private exec = promisify(execCallback);

  public async create_image_container(image_id: string, port: number){

    try {
      // fetch image details
      const image = await Image.findOrFail(image_id);

      const create_container = await this.start_container(image.docker_image_name, this.github_templates_url, image.template_branch, port)

      return create_container

    } catch (error) {
      return {
        success: false,
        message: error,
        container: undefined,
        volume: undefined
      }
    }
  }

  private async start_container(imageName: string, githubRepoUrl: string, branch: string, port: number) {
    try {
        const randomHash = await this.generateValidString(10);
        const containerName = `app_${randomHash}`;
        const __dirname = path.resolve(path.dirname(''));
        const volumePath = path.resolve(__dirname, `docker_volumes/${randomHash}/`).replace(/\\/g, '/');  // Ensure correct path format for Docker

        // Clone the repository
        const repoName = githubRepoUrl.split('/').pop()?.replace('.git', '');
        if (!repoName) {
            throw new Error('Invalid GitHub repository URL');
        }
        await this.exec(`git clone -b ${branch} ${githubRepoUrl} "${volumePath}"`);
        console.log(`Branch ${branch} of repository ${repoName} cloned successfully`);

        // Docker command to create and run the container
        const dockerCreateCommand = `docker run --name ${containerName} ` +
                                    `-v "${volumePath}:/app" ` +
                                    `-p ${port}:80 ` +
                                    `--restart=no ` +
                                    `-d ${imageName} ` +
                                    `tail -f /dev/null`;

        const { stdout } = await this.exec(dockerCreateCommand);
        const containerId = stdout.trim(); // Docker returns the container ID on stdout
        console.log(`Container ${containerName} started successfully with ID ${containerId}. Port ${port} is exposed for the application.`);

        return {
            success: true,
            container: {
              name: containerName,
              id: containerId
            },
            volume: {
              name: randomHash,
              path: volumePath
            }
        };
    } catch (error) {
        console.error('Error in container operation:', error);
        return {
            success: false,
            message: "Error in container startup",
            error: error.message
        };
    }
  }



  private async generateValidString(length: number) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.-';
    let validString = '';
    for (let i = 0; i < length; i++) {
      validString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return validString;
  }

  public async list_docker_containers() {
    try {
      // Using backticks and proper spacing around the JSON format to ensure proper command interpretation
      const { stdout } = await this.exec(`docker ps --format "{{json .}}"`);
      const containers = stdout.trim().split('\n').map(line => JSON.parse(line));
      return {
        success: true,
        containers: containers
      };
    } catch (error) {
      console.error('Error listing containers:', error);
      return {
        success: false,
        message: "Failed to list containers",
        error: error.message
      };
    }
  }

  // public async executeCommandInsideContainer(playground_id: number, command: string) {


  //   const details = await Playground.query().preload('image').where('id', playground_id).first();

  //     const dockerProcess = spawn('docker', ['exec', '-i', `app_${details?.volume_name}`, ...command]);

  //     let output = '';

  //     dockerProcess.stdout.on('data', (data) => {
  //       output += data.toString();
  //     });

  //     dockerProcess.stderr.on('data', (data) => {
  //       output += data.toString();  // Collecting stderr as output as well.
  //     });

  //     dockerProcess.on('error', (error) => {
  //       reject(error);
  //     });

  //     dockerProcess.on('close', (code) => {
  //       if (code === 0) {
  //         resolve(output);
  //       } else {
  //         reject(new Error(`Command exited with code ${code}: ${output}`));
  //       }
  //     });
  // }

  public async findPlayground(playground_id: number) {
    // return new Promise(async (resolve, reject) => {

      const details = await Playground.query().preload('image').where('id', playground_id).first();

      return details
    //     // Assume the Docker container name is derived from the playground_id
    //     const containerName = `app_${details?.volume_name}`;
    //     const commandParts = command.split(' ');

    //     // Setup options for spawning the Docker process
    //     const options: SpawnOptionsWithoutStdio = {
    //         shell: true // Using shell to interpret the command correctly
    //     };

    //     // Start the Docker exec command
    //     const dockerProcess = spawn('docker', ['exec', '-i', containerName, ...commandParts], options);

    //     let output = '';

    //     dockerProcess.stdout.on('data', (data) => {
    //         output += data.toString();
    //     });

    //     dockerProcess.stderr.on('data', (data) => {
    //         output += data.toString(); // Collecting stderr as output as well.
    //     });

    //     dockerProcess.on('error', (error) => {
    //         reject(error);
    //     });

    //     dockerProcess.on('close', (code) => {
    //         if (code === 0) {
    //             resolve(output);
    //         } else {
    //             reject(new Error(`Command exited with code ${code}: ${output}`));
    //         }
    //     });
    // });


}

}

export default new DockerAdapter();
