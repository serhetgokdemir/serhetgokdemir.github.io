// Load and display projects
async function loadProjects() {
    try {
        const response = await fetch('/content/projects.json');
        const projects = await response.json();
        
        const container = document.getElementById('projects-container');
        if (!container) return;
        
        for (const project of projects) {
            const projectElement = createProjectElement(project);
            container.appendChild(projectElement);
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function createProjectElement(project) {
    const container = document.createElement('div');
    container.className = 'project-container';
    
    const title = document.createElement('h4');
    title.className = 'project-title';
    title.textContent = project.title;
    
    const box = document.createElement('div');
    box.className = 'project-box';
    
    const description = document.createElement('p');
    description.textContent = project.description;
    
    const techTags = document.createElement('div');
    techTags.className = 'project-tech';
    project.technologies.forEach(tech => {
        const tag = document.createElement('span');
        tag.textContent = tech;
        techTags.appendChild(tag);
    });
    
    const links = document.createElement('div');
    links.className = 'project-links';

    // Collect link HTMLs in an array for ordering and separator
    const linkHtmls = [];
    if (project.links && project.links.live) {
        linkHtmls.push(`<a href="${project.links.live}" target="_blank">try it</a>`);
    }
    if (project.links && project.links.github) {
        linkHtmls.push(`<a href="${project.links.github}" target="_blank">source code</a>`);
    }
    if (project.hasDetail) {
        linkHtmls.push(`<a href="/content/projects/project.html?id=${project.id}">read more →</a>`);
    }
    // Join with black vertical bar
    links.innerHTML = linkHtmls.join('<span style="color:#111;margin:0 8px;">|</span>');

    box.appendChild(description);
    box.appendChild(techTags);
    box.appendChild(links);
    
    container.appendChild(title);
    container.appendChild(box);
    
    return container;
}

// Load projects when DOM is ready
if (document.getElementById('projects-container')) {
    document.addEventListener('DOMContentLoaded', loadProjects);
}
