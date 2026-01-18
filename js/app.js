// Load navbar component
async function loadNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    if (!navbarContainer) return;
    
    // Determine the correct path to components based on current location
    const path = window.location.pathname;
    let navbarPath = '/components/navbar.html';
    
    if (path.includes('/pages/')) {
        if (path.includes('/ds-projects/') || path.includes('/swe-projects/') || path.includes('/writings/')) {
            navbarPath = '../../components/navbar.html';
        } else {
            navbarPath = '../components/navbar.html';
        }
    }
    
    try {
        const response = await fetch(navbarPath);
        const html = await response.text();
        navbarContainer.innerHTML = html;
        
        // Fix links based on current directory level
        fixNavbarLinks();
        
        // Update active link based on current page
        updateActiveLink();
    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}

function fixNavbarLinks() {
    const path = window.location.pathname;
    const nav = document.querySelector('#navbar-container nav');
    if (!nav) return;
    
    const links = nav.querySelectorAll('a');
    links.forEach(link => {
        let href = link.getAttribute('href');
        
        // Adjust links based on current directory level
        if (path.includes('/pages/')) {
            if (path.includes('/ds-projects/') || path.includes('/swe-projects/') || path.includes('/writings/')) {
                // Two levels deep
                if (href.startsWith('pages/')) {
                    href = '../' + href;
                } else if (href === 'index.html') {
                    href = '../../index.html';
                }
            } else {
                // One level deep  
                if (href.startsWith('pages/')) {
                    href = href.replace('pages/', '');
                } else if (href === 'index.html') {
                    href = '../index.html';
                }
            }
            link.setAttribute('href', href);
        }
    });
}

function updateActiveLink() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('nav a');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (currentPath.endsWith(href) || 
            (href === 'index.html' && currentPath === '/'))) {
            link.style.fontWeight = '600';
        }
    });
}

// Load navbar when DOM is ready
document.addEventListener('DOMContentLoaded', loadNavbar);
