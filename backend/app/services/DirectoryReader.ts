import * as fs from 'fs';
import * as path from 'path';

type FileInfo = {
    name: string;
    type: 'file' | 'folder';
    extension?: string;
    size?: number;
    children?: FileInfo[];
    fullPath: string;  // Added to store the full path of the file or folder
};

class DirectoryReader {
    public async readDirectory(dirPath: string): Promise<FileInfo> {
        const absolutePath = path.resolve(dirPath);
        return this.getFileInfo(absolutePath);
    }

    private async getFileInfo(filePath: string): Promise<FileInfo> {
        return new Promise((resolve, reject) => {
            fs.stat(filePath, async (err, stats) => {
                if (err) {
                    return reject(err);
                }

                const fileInfo: FileInfo = {
                    name: path.basename(filePath),
                    type: stats.isDirectory() ? 'folder' : 'file',
                    size: stats.size,
                    fullPath: filePath  // Assigning the full path
                };

                if (stats.isDirectory()) {
                    fileInfo.children = await this.readDirectoryContents(filePath);
                } else {
                    fileInfo.extension = path.extname(filePath);
                }

                resolve(fileInfo);
            });
        });
    }

    private async readDirectoryContents(dirPath: string): Promise<FileInfo[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(dirPath, async (err, files) => {
                if (err) {
                    return reject(err);
                }

                const promises = files.map(file => this.getFileInfo(path.join(dirPath, file)));
                resolve(await Promise.all(promises));
            });
        });
    }

    public async readFileContents(filePath: string): Promise<string> {
        return fs.promises.readFile(filePath, 'utf8');
    }

    public async writeFileContents(filePath: string, content: string): Promise<void> {
        await fs.promises.writeFile(filePath, content);
    }

    public async deletePath(pathToDelete: string): Promise<void> {
        const stats = await fs.promises.stat(pathToDelete);
        if (stats.isDirectory()) {
            await fs.promises.rmdir(pathToDelete, { recursive: true });
        } else {
            await fs.promises.unlink(pathToDelete);
        }
    }

    public async createFile(filePath: string, content: string = ''): Promise<void> {
      const dirPath = path.dirname(filePath);
      await fs.promises.mkdir(dirPath, { recursive: true }); // Ensure the directory exists
      await fs.promises.writeFile(filePath, content); // Create the file with content
    }

    public async createFolder(dirPath: string): Promise<void> {
        await fs.promises.mkdir(dirPath, { recursive: true });
    }
}

export default new DirectoryReader();
