// Simple Markdown to HTML converter (reused from blog)
function markdownToHTML(markdown) {
    let html = markdown;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^# (.*$)/gim, '<h2>$1</h2>');
    
    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, function(match, lang, code) {
        return '<pre><code>' + code.trim() + '</code></pre>';
    });
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Lists
    html = html.replace(/^\- (.+)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Paragraphs
    const paragraphs = html.split('\n\n');
    html = paragraphs.map(para => {
        para = para.trim();
        if (!para) return '';
        if (para.match(/^<(h2|h3|ul|pre|li)/)) {
            return para;
        }
        return '<p>' + para.replace(/\n/g, '<br>') + '</p>';
    }).join('\n\n');
    
    return html;
}

// Load individual project detail
async function loadProjectDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    
    if (!projectId) {
        document.getElementById('project-content').innerHTML = '<p>Project not found.</p>';
        return;
    }
    
    try {
        // Load metadata
        const metaResponse = await fetch('/content/projects.json');
        const projects = await metaResponse.json();
        const projectMeta = projects.find(p => p.id === projectId);
        
        if (!projectMeta || !projectMeta.hasDetail) {
            document.getElementById('project-content').innerHTML = '<p>Project not found.</p>';
            return;
        }
        
        // Update page title
        document.title = projectMeta.title + ' - Serhet Gokdemir';
        
        // Load markdown content
        const contentResponse = await fetch(`/${projectMeta.filename}`);
        const markdown = await contentResponse.text();
        const html = markdownToHTML(markdown);
        
        // Display project
        const container = document.getElementById('project-content');
        container.innerHTML = `
            <div class="blog-post">
                <div class="project-tech" style="margin-bottom: 20px;">
                    ${projectMeta.technologies.map(tech => `<span>${tech}</span>`).join('')}
                </div>
                <div class="blog-content">${html}</div>
                ${projectMeta.links && projectMeta.links.github ? 
                    `<div class="project-links" style="margin-top: 30px;">
                        <a href="${projectMeta.links.github}" target="_blank">view on github →</a>
                    </div>` : ''}
            </div>
        `;
    } catch (error) {
        console.error('Error loading project:', error);
        document.getElementById('project-content').innerHTML = '<p>Error loading project.</p>';
    }
}

// Load project when DOM is ready
document.addEventListener('DOMContentLoaded', loadProjectDetail);
