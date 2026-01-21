// Simple Markdown to HTML converter
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
    
    // Paragraphs - split by double newline
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

// Load individual blog post
async function loadBlogPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (!postId) {
        document.getElementById('blog-post-content').innerHTML = '<p>Post not found.</p>';
        return;
    }
    
    try {
        // Load metadata
        const metaResponse = await fetch('/content/blog-posts.json');
        const posts = await metaResponse.json();
        const postMeta = posts.find(p => p.id === postId);
        
        if (!postMeta) {
            document.getElementById('blog-post-content').innerHTML = '<p>Post not found.</p>';
            return;
        }
        
        // Update page title
        document.title = postMeta.title + ' - Serhet Gokdemir';
        
        // Load markdown content
        const contentResponse = await fetch(`/${postMeta.filename}`);
        const markdown = await contentResponse.text();
        const html = markdownToHTML(markdown);
        
        // Display post
        const container = document.getElementById('blog-post-content');
        container.innerHTML = `
            <div class="blog-post">
                <p class="blog-date">${formatDate(postMeta.date)}</p>
                <div class="blog-content">${html}</div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading blog post:', error);
        document.getElementById('blog-post-content').innerHTML = '<p>Error loading post.</p>';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Load post when DOM is ready
document.addEventListener('DOMContentLoaded', loadBlogPost);
