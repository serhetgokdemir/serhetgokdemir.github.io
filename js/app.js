// Load navbar component
async function loadNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    if (!navbarContainer) return;
    
    // Calculate relative path based on current file location
    const path = window.location.pathname;
    
    // Remove filename and count directory levels
    const pathParts = path.split('/').filter(part => part && !part.includes('.html'));
    
    // Calculate how many levels deep we are from root
    let levelsDeep = 0;
    if (pathParts.length > 0) {
        // If we're in a folder (not root), count the depth
        levelsDeep = pathParts.length;
    }
    
    // Build the relative path to components
    let navbarPath;
    if (levelsDeep === 0) {
        navbarPath = 'components/navbar.html';
    } else {
        navbarPath = '../'.repeat(levelsDeep) + 'components/navbar.html';
    }
    
    try {
        const response = await fetch(navbarPath);
        const html = await response.text();
        navbarContainer.innerHTML = html;
        
        // Fix links based on current directory level
        fixNavbarLinks(levelsDeep);
        
        // Update active link based on current page
        updateActiveLink();
    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}

function fixNavbarLinks(levelsDeep) {
    const nav = document.querySelector('#navbar-container nav');
    if (!nav) return;
    
    const links = nav.querySelectorAll('a');
    links.forEach(link => {
        let href = link.getAttribute('href');
        
        // Build correct path based on depth
        if (levelsDeep === 0) {
            // We're at root, links are correct
            return;
        } else {
            // Adjust all links to go back to root first
            const rootPath = '../'.repeat(levelsDeep);
            
            if (href.startsWith('pages/')) {
                // Convert pages/about.html -> ../pages/about.html (or more ../)
                link.setAttribute('href', rootPath + href);
            } else if (href === 'index.html') {
                link.setAttribute('href', rootPath + href);
            }
        }
    });
}

function updateActiveLink() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('nav a');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        // Extract just the filename from href
        const hrefPage = href.split('/').pop();
        
        // Check if this link matches current page
        if (hrefPage === currentPage || 
            (currentPage === '' && hrefPage === 'index.html') ||
            (currentPath === '/' && hrefPage === 'index.html')) {
            link.style.fontWeight = '600';
        }
    });
}

// Load navbar when DOM is ready
document.addEventListener('DOMContentLoaded', loadNavbar);
