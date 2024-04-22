import { active_file, active_file_content } from '$lib/stores/editor_file_tab';

export const view_file = async (page, of) =>{
    const req = await fetch("/api/playground/files/"+page.params.id+"/content?p="+of.fullPath);

    const res = await req.text();

    active_file.set(of)

    active_file_content.set(res)
}



  // Function to get the language from the file extension
  export const detect_language = (extension) => {
    const languageMapping = {
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'py': 'python',
        'java': 'java',
        'c': 'c',
        'cpp': 'cpp',
        'cs': 'csharp',
        'php': 'php',
        'rb': 'ruby',
        'go': 'go',
        'rust': 'rust',
        'html': 'html',
        'htm': 'html',
        'css': 'css',
        'scss': 'scss',
        'sass': 'sass',
        'less': 'less',
        'json': 'json',
        'xml': 'xml',
        'md': 'markdown',
        'sh': 'shell',
        'bat': 'bat'
    };

    // Remove leading dot if present and convert to lowercase
    const normalizedExtension = extension.replace(/^\./, '').toLowerCase();
    
    return languageMapping[normalizedExtension] || 'plaintext';
}