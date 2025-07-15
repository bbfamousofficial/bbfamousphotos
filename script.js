// Sample data for demonstration
let items = [
    {
        id: 1,
        title: "Beautiful Sunset Landscape",
        description: "A stunning sunset over mountains with vibrant colors",
        type: "photo",
        size: "2.3 MB",
        downloads: 1250,
        url: "https://images.pexels.com/photos/589840/pexels-photo-589840.jpeg?auto=compress&cs=tinysrgb&w=800",
        fullUrl: "https://images.pexels.com/photos/589840/pexels-photo-589840.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },
    {
        id: 2,
        title: "Modern Architecture",
        description: "Clean lines and geometric patterns in modern building design",
        type: "photo",
        size: "3.1 MB",
        downloads: 892,
        url: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800",
        fullUrl: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },
    {
        id: 3,
        title: "Business Strategy Guide",
        description: "Comprehensive guide to modern business strategies and practices",
        type: "pdf",
        size: "5.2 MB",
        downloads: 456,
        url: null,
        fullUrl: null
    },
    {
        id: 4,
        title: "Ocean Waves",
        description: "Peaceful ocean waves crashing on a pristine beach",
        type: "photo",
        size: "2.8 MB",
        downloads: 1834,
        url: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800",
        fullUrl: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },
    {
        id: 5,
        title: "Marketing Templates",
        description: "Professional marketing templates for businesses",
        type: "pdf",
        size: "3.7 MB",
        downloads: 723,
        url: null,
        fullUrl: null
    },
    {
        id: 6,
        title: "Forest Path",
        description: "A serene path through a lush green forest",
        type: "photo",
        size: "4.1 MB",
        downloads: 967,
        url: "https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&w=800",
        fullUrl: "https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&w=1200"
    }
];

let currentFilter = 'all';
let currentPreviewItem = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadItems();
    updateStats();
});

// Load items from localStorage or use sample data
function loadItems() {
    const stored = localStorage.getItem('bbfamous_items');
    if (stored) {
        items = JSON.parse(stored);
    }
    displayItems();
}

// Save items to localStorage
function saveItems() {
    localStorage.setItem('bbfamous_items', JSON.stringify(items));
}

// Display items in grid
function displayItems() {
    const grid = document.getElementById('itemsGrid');
    const filteredItems = filterItemsByType(currentFilter);
    
    grid.innerHTML = '';
    
    filteredItems.forEach(item => {
        const itemCard = createItemCard(item);
        grid.appendChild(itemCard);
    });
    
    updateResultsCount(filteredItems.length);
}

// Create item card element
function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.onclick = () => openPreview(item.id);
    
    let imageContent;
    if (item.type === 'photo' && item.url) {
        imageContent = `<img src="${item.url}" alt="${item.title}" class="item-image">`;
    } else {
        imageContent = `
            <div class="pdf-placeholder">
                <div>📄</div>
                <div style="font-size: 14px; margin-top: 8px;">PDF</div>
            </div>
        `;
    }
    
    card.innerHTML = `
        ${imageContent}
        <div class="item-info">
            <h3 class="item-title">${item.title}</h3>
            <div class="item-meta">
                <span>${item.type.toUpperCase()}</span>
                <span>${item.size}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Filter items by type
function filterItemsByType(type) {
    if (type === 'all') {
        return items;
    }
    return items.filter(item => item.type === type);
}

// Filter items function
function filterItems(type) {
    currentFilter = type;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-filter="${type}"]`).classList.add('active');
    
    displayItems();
}

// Search items
function searchItems() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const grid = document.getElementById('itemsGrid');
    
    let filteredItems = filterItemsByType(currentFilter);
    
    if (query) {
        filteredItems = filteredItems.filter(item => 
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        );
    }
    
    grid.innerHTML = '';
    
    filteredItems.forEach(item => {
        const itemCard = createItemCard(item);
        grid.appendChild(itemCard);
    });
    
    updateResultsCount(filteredItems.length);
}

// Update results count
function updateResultsCount(count) {
    document.getElementById('resultsCount').textContent = `${count} items found`;
}

// Open preview modal
function openPreview(itemId) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    currentPreviewItem = item;
    
    const modal = document.getElementById('previewModal');
    const previewImage = document.getElementById('previewImage');
    const pdfPreview = document.getElementById('pdfPreview');
    
    // Update modal content
    document.getElementById('previewTitle').textContent = item.title;
    document.getElementById('previewDescription').textContent = item.description;
    document.getElementById('previewType').textContent = item.type.toUpperCase();
    document.getElementById('previewSize').textContent = item.size;
    
    // Show appropriate preview
    if (item.type === 'photo' && item.fullUrl) {
        previewImage.src = item.fullUrl;
        previewImage.style.display = 'block';
        pdfPreview.style.display = 'none';
    } else {
        previewImage.style.display = 'none';
        pdfPreview.style.display = 'flex';
    }
    
    modal.style.display = 'block';
}

// Close preview modal
function closePreview() {
    document.getElementById('previewModal').style.display = 'none';
    currentPreviewItem = null;
}

// Download item
function downloadItem() {
    if (!currentPreviewItem) return;
    
    // Increment download count
    currentPreviewItem.downloads++;
    saveItems();
    updateStats();
    
    // Create download link
    if (currentPreviewItem.type === 'photo' && currentPreviewItem.fullUrl) {
        const link = document.createElement('a');
        link.href = currentPreviewItem.fullUrl;
        link.download = `${currentPreviewItem.title}.jpg`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        // For PDFs, simulate download
        alert(`Downloading ${currentPreviewItem.title}.pdf`);
    }
    
    closePreview();
}

// Update stats
function updateStats() {
    const totalDownloads = items.reduce((sum, item) => sum + item.downloads, 0);
    localStorage.setItem('bbfamous_total_downloads', totalDownloads.toString());
}

// Toggle mobile menu
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('previewModal');
    if (event.target === modal) {
        closePreview();
    }
}

// Handle search on Enter key
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchItems();
    }
});