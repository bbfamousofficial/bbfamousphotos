// Admin credentials
const ADMIN_USERNAME = 'admin456';
const ADMIN_PASSWORD = 'bbfamous456';

let currentSection = 'dashboard';
let items = [];

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    loadItems();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('uploadForm').addEventListener('submit', handleUpload);
    document.getElementById('editForm').addEventListener('submit', handleEdit);
    document.getElementById('itemFile').addEventListener('change', handleFilePreview);
    document.getElementById('manageSearch').addEventListener('input', filterManageItems);
}

// Check if user is logged in
function checkLogin() {
    const isLoggedIn = sessionStorage.getItem('bbfamous_admin_logged_in');
    if (isLoggedIn === 'true') {
        showAdminPanel();
    } else {
        showLoginScreen();
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        sessionStorage.setItem('bbfamous_admin_logged_in', 'true');
        showAdminPanel();
    } else {
        alert('Invalid credentials!');
    }
}

// Show login screen
function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
}

// Show admin panel
function showAdminPanel() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'flex';
    loadDashboard();
}

// Logout
function logout() {
    sessionStorage.removeItem('bbfamous_admin_logged_in');
    showLoginScreen();
    
    // Reset form
    document.getElementById('loginForm').reset();
}

// Load items from localStorage
function loadItems() {
    const stored = localStorage.getItem('bbfamous_items');
    if (stored) {
        items = JSON.parse(stored);
    } else {
        // Initialize with sample data
        items = [
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
            }
        ];
        saveItems();
    }
}

// Save items to localStorage
function saveItems() {
    localStorage.setItem('bbfamous_items', JSON.stringify(items));
}

// Show section
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(s => {
        s.style.display = 'none';
    });
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(section + 'Section').style.display = 'block';
    event.target.classList.add('active');
    
    // Update title
    const titles = {
        dashboard: 'Dashboard',
        upload: 'Upload New Item',
        manage: 'Manage Items'
    };
    document.getElementById('sectionTitle').textContent = titles[section];
    
    currentSection = section;
    
    // Load section-specific content
    if (section === 'dashboard') {
        loadDashboard();
    } else if (section === 'manage') {
        loadManageItems();
    }
}

// Load dashboard stats
function loadDashboard() {
    const totalPhotos = items.filter(item => item.type === 'photo').length;
    const totalPdfs = items.filter(item => item.type === 'pdf').length;
    const totalDownloads = items.reduce((sum, item) => sum + item.downloads, 0);
    
    document.getElementById('totalPhotos').textContent = totalPhotos;
    document.getElementById('totalPdfs').textContent = totalPdfs;
    document.getElementById('totalDownloads').textContent = totalDownloads.toLocaleString();
}

// Handle file preview
function handleFilePreview(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('filePreview');
    
    if (file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = `<div style="color: #8B5CF6;">📄 ${file.name}</div>`;
        }
    } else {
        preview.innerHTML = '';
    }
}

// Handle upload
function handleUpload(e) {
    e.preventDefault();
    
    const title = document.getElementById('itemTitle').value;
    const description = document.getElementById('itemDescription').value;
    const type = document.getElementById('itemType').value;
    const file = document.getElementById('itemFile').files[0];
    
    if (!file) {
        alert('Please select a file');
        return;
    }
    
    // Create new item
    const newItem = {
        id: Date.now(),
        title: title,
        description: description,
        type: type,
        size: formatFileSize(file.size),
        downloads: 0,
        url: null,
        fullUrl: null
    };
    
    // For demo purposes, use placeholder URLs for images
    if (type === 'photo' && file.type.startsWith('image/')) {
        // In a real application, you would upload the file to a server
        // For demo, we'll use a placeholder image
        newItem.url = "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800";
        newItem.fullUrl = "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1200";
    }
    
    items.push(newItem);
    saveItems();
    
    // Reset form
    document.getElementById('uploadForm').reset();
    document.getElementById('filePreview').innerHTML = '';
    
    alert('Item uploaded successfully!');
    
    // Refresh dashboard if currently viewing
    if (currentSection === 'dashboard') {
        loadDashboard();
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Load manage items
function loadManageItems() {
    const tbody = document.getElementById('itemsTableBody');
    tbody.innerHTML = '';
    
    items.forEach(item => {
        const row = createItemRow(item);
        tbody.appendChild(row);
    });
}

// Create item row for manage table
function createItemRow(item) {
    const row = document.createElement('tr');
    
    let thumbnailContent;
    if (item.type === 'photo' && item.url) {
        thumbnailContent = `<img src="${item.url}" alt="${item.title}" class="item-thumbnail">`;
    } else {
        thumbnailContent = `<div class="pdf-thumb">📄</div>`;
    }
    
    row.innerHTML = `
        <td>${thumbnailContent}</td>
        <td>${item.title}</td>
        <td>${item.type.toUpperCase()}</td>
        <td>${item.size}</td>
        <td>${item.downloads}</td>
        <td>
            <div class="action-buttons">
                <button onclick="editItem(${item.id})" class="edit-btn">Edit</button>
                <button onclick="deleteItem(${item.id})" class="delete-btn">Delete</button>
            </div>
        </td>
    `;
    
    return row;
}

// Edit item
function editItem(itemId) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    document.getElementById('editItemId').value = item.id;
    document.getElementById('editTitle').value = item.title;
    document.getElementById('editDescription').value = item.description;
    
    document.getElementById('editModal').style.display = 'block';
}

// Handle edit
function handleEdit(e) {
    e.preventDefault();
    
    const itemId = parseInt(document.getElementById('editItemId').value);
    const title = document.getElementById('editTitle').value;
    const description = document.getElementById('editDescription').value;
    
    const itemIndex = items.findIndex(i => i.id === itemId);
    if (itemIndex !== -1) {
        items[itemIndex].title = title;
        items[itemIndex].description = description;
        saveItems();
        
        closeEditModal();
        loadManageItems();
        alert('Item updated successfully!');
    }
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Delete item
function deleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        items = items.filter(item => item.id !== itemId);
        saveItems();
        loadManageItems();
        
        // Refresh dashboard if currently viewing
        if (currentSection === 'dashboard') {
            loadDashboard();
        }
        
        alert('Item deleted successfully!');
    }
}

// Filter manage items
function filterManageItems() {
    const query = document.getElementById('manageSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#itemsTableBody tr');
    
    rows.forEach(row => {
        const title = row.cells[1].textContent.toLowerCase();
        const type = row.cells[2].textContent.toLowerCase();
        
        if (title.includes(query) || type.includes(query)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const editModal = document.getElementById('editModal');
    if (event.target === editModal) {
        closeEditModal();
    }
}