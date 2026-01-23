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
    // Dil tespit
    const currentPath = window.location.pathname;
    const isTr = currentPath.includes('/tr/') || currentPath.includes('index.tr.html');
    const nav = document.querySelector('#navbar-container nav');
    const trNav = document.querySelector('#navbar-container #tr-nav');
    const siteLang = localStorage.getItem('site-lang') || 'en';
    
    if (isTr && trNav) {
        nav.style.display = 'none';
        trNav.style.display = '';
        // Türkçe navbar linklerini düzelt
        const links = trNav.querySelectorAll('a');
        links.forEach(link => {
            let href = link.getAttribute('href');
            if (levelsDeep === 0) {
                // Root seviyede, linkler zaten doğru
                return;
            } else if (levelsDeep === 2) {
                // pages/tr/ içindeyiz, linkleri düzelt
                if (href.startsWith('index.tr.html')) {
                    link.setAttribute('href', '../../index.tr.html');
                } else if (href.startsWith('pages/tr/')) {
                    // pages/tr/about.html -> about.html
                    link.setAttribute('href', href.replace('pages/tr/', ''));
                }
            }
        });
    } else if (nav) {
        if (trNav) trNav.style.display = 'none';
        nav.style.display = '';
        const links = nav.querySelectorAll('a');
        links.forEach(link => {
            let href = link.getAttribute('href');
            if (levelsDeep === 0) {
                return;
            } else {
                const rootPath = '../'.repeat(levelsDeep);
                if (href.startsWith('pages/')) {
                    link.setAttribute('href', rootPath + href);
                } else if (href === 'index.html') {
                    link.setAttribute('href', rootPath + href);
                }
            }
        });
    }
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

function setLanguageSwitcher(levelsDeep) {
    const langSwitch = document.getElementById('lang-switch');
    if (!langSwitch) return;
    const currentPath = window.location.pathname;
    const isTr = currentPath.includes('/tr/') || currentPath.includes('index.tr.html');

    function getTrPath(path) {
        if (path.endsWith('index.html') || path.endsWith('/')) return 'index.tr.html';
        if (path.endsWith('about.html')) return path.replace('about.html', 'tr/about.html');
        if (path.endsWith('blog.html')) return path.replace('blog.html', 'tr/blog.html');
        if (path.endsWith('projects.html')) return path.replace('projects.html', 'tr/projects.html');
        if (path.endsWith('contact.html')) return path.replace('contact.html', 'tr/contact.html');
        if (path.endsWith('project-detail.html')) return path.replace('project-detail.html', 'tr/project-detail.html');
        return null;
    }
    function getEnPath(path) {
        if (path.endsWith('index.tr.html')) return 'index.html';
        if (path.endsWith('tr/about.html')) return path.replace('tr/about.html', 'about.html');
        if (path.endsWith('tr/blog.html')) return path.replace('tr/blog.html', 'blog.html');
        if (path.endsWith('tr/projects.html')) return path.replace('tr/projects.html', 'projects.html');
        if (path.endsWith('tr/contact.html')) return path.replace('tr/contact.html', 'contact.html');
        if (path.endsWith('tr/project-detail.html')) return path.replace('tr/project-detail.html', 'project-detail.html');
        return null;
    }

    // Başlangıçta doğru metin
    if (isTr) {
        langSwitch.textContent = 'english';
    } else {
        langSwitch.textContent = 'türkçe';
    }
    langSwitch.style.color = '#d32f2f';

    langSwitch.onclick = function() {
        if (!isTr) {
            // Türkçeye geç
            const trPath = getTrPath(currentPath);
            if (trPath) {
                localStorage.setItem('site-lang', 'tr');
                window.location.href = trPath;
            }
        } else {
            // İngilizceye geç
            const enPath = getEnPath(currentPath);
            if (enPath) {
                localStorage.setItem('site-lang', 'en');
                window.location.href = enPath;
            }
        }
    };
}

document.addEventListener('DOMContentLoaded', async function() {
    await loadNavbar();
    const path = window.location.pathname;
    const pathParts = path.split('/').filter(part => part && !part.includes('.html'));
    let levelsDeep = 0;
    if (pathParts.length > 0) levelsDeep = pathParts.length;
    setLanguageSwitcher(levelsDeep);
});
