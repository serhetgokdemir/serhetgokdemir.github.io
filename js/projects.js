// Load and display projects
async function loadProjects() {
    try {
        // Dil tespiti
        const isTr = window.location.pathname.includes('/tr/');
        const jsonPath = isTr ? '/content/projects.json' : '/content/projects.json';
        
        const response = await fetch(jsonPath);
        const projects = await response.json();
        
        const container = document.getElementById('projects-container');
        if (!container) return;
        
        for (const project of projects) {
            const projectElement = createProjectElement(project, isTr);
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

    // Dil tespiti
    const isTr = window.location.pathname.includes('/tr/');
    const tryItText = isTr ? 'dene' : 'try it';
    const sourceCodeText = isTr ? 'kaynak kod' : 'source code';
    const readMoreText = isTr ? 'devamını oku →' : 'read more →';

    // Collect link HTMLs in an array for ordering and separator
    const linkHtmls = [];
    if (project.links && project.links.live) {
        linkHtmls.push(`<a href="${project.links.live}" target="_blank">${tryItText}</a>`);
    }
    if (project.links && project.links.github) {
        linkHtmls.push(`<a href="${project.links.github}" target="_blank">${sourceCodeText}</a>`);
    }
    if (project.hasDetail) {
        linkHtmls.push(`<a href="/content/projects/project.html?id=${project.id}">${readMoreText}</a>`);
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
