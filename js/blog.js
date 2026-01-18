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
    
    // Paragraphs
    html = html.split('\n\n').map(para => {
        if (!para.match(/^<(h2|h3|ul|pre|code)/)) {
            return '<p>' + para.replace(/\n/g, '<br>') + '</p>';
        }
        return para;
    }).join('\n');
    
    return html;
}

// Load and display blog posts
async function loadBlogPosts() {
    try {
        const response = await fetch('/blog-posts.json');
        const posts = await response.json();
        
        const container = document.getElementById('blog-posts-container');
        if (!container) return;
        
        // Sort posts by date (newest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        for (const post of posts) {
            const postElement = createBlogPostElement(post);
            container.appendChild(postElement);
        }
    } catch (error) {
        console.error('Error loading blog posts:', error);
    }
}

function createBlogPostElement(post) {
    const container = document.createElement('div');
    container.className = 'project-container';
    
    const title = document.createElement('h4');
    title.className = 'project-title';
    title.textContent = post.title;
    
    const box = document.createElement('div');
    box.className = 'project-box';
    
    const date = document.createElement('p');
    date.className = 'blog-date';
    date.textContent = formatDate(post.date);
    
    const summary = document.createElement('p');
    summary.textContent = post.summary;
    
    const readMore = document.createElement('div');
    readMore.className = 'project-links';
    readMore.innerHTML = `<a href="blog/post.html?id=${post.id}">read more →</a>`;
    
    box.appendChild(date);
    box.appendChild(summary);
    box.appendChild(readMore);
    
    container.appendChild(title);
    container.appendChild(box);
    
    return container;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Load blog posts when DOM is ready
if (document.getElementById('blog-posts-container')) {
    document.addEventListener('DOMContentLoaded', loadBlogPosts);
}
