// ============================================
// BASEROW API CONFIGURATION
// ============================================

const BASEROW_CONFIG = {
    apiUrl: 'http://localhost/api/database/rows/table/',
    token: 'YOUR_API_TOKEN_HERE',  // Replace with your actual token
    tables: {
        universities: 568,  // Replace with your actual table ID
        scholarships: 569,  // Replace with your actual table ID
        errors: 570         // Replace with your actual table ID
    }
};

// ============================================
// FETCH UNIVERSITIES FROM BASEROW
// ============================================

async function fetchUniversities() {
    try {
        const response = await fetch(
            `${BASEROW_CONFIG.apiUrl}${BASEROW_CONFIG.tables.universities}/?user_field_names=true`,
            {
                headers: {
                    'Authorization': `Token ${BASEROW_CONFIG.token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Error fetching universities:', error);
        return [];
    }
}

// ============================================
// FETCH SCHOLARSHIPS FROM BASEROW
// ============================================

async function fetchScholarships() {
    try {
        const response = await fetch(
            `${BASEROW_CONFIG.apiUrl}${BASEROW_CONFIG.tables.scholarships}/?user_field_names=true`,
            {
                headers: {
                    'Authorization': `Token ${BASEROW_CONFIG.token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Error fetching scholarships:', error);
        return [];
    }
}

// ============================================
// SEARCH UNIVERSITIES WITH FILTERS
// ============================================

async function searchUniversities(query = '', filters = {}) {
    const allUniversities = await fetchUniversities();
    
    return allUniversities.filter(uni => {
        let match = true;
        
        // Search by name
        if (query) {
            const name = uni['University Name'] || '';
            match = name.toLowerCase().includes(query.toLowerCase());
            if (!match) return false;
        }
        
        // Filter by province
        if (filters.province && uni['Province'] !== filters.province) {
            return false;
        }
        
        // Filter by degree level
        if (filters.degree) {
            const degree = uni['Degree Levels'] || '';
            if (!degree.includes(filters.degree)) return false;
        }
        
        // Filter by teaching language
        if (filters.language && uni['Teaching Language'] !== filters.language) {
            return false;
        }
        
        return true;
    });
}

// ============================================
// DISPLAY UNIVERSITIES ON SEARCH PAGE
// ============================================

function displayUniversities(universities) {
    const container = document.getElementById('searchResults');
    
    if (!container) {
        console.warn('Search results container not found');
        return;
    }
    
    if (!universities || universities.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:40px; color:#666;">
                <p>No universities found. Try adjusting your search.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = universities.map(uni => `
        <div class="uni-card">
            <h4>${uni['University Name'] || 'Unknown'}</h4>
            <div class="location">
                ${uni['City'] || 'N/A'}, ${uni['Province'] || 'N/A'}
            </div>
            <div class="tags">
                <span>${uni['Degree Levels'] || 'N/A'}</span>
                <span>${uni['Teaching Language'] || 'N/A'}</span>
            </div>
            <div class="actions">
                <a href="university-detail.html?id=${uni.id}" style="color:#2563eb;">View →</a>
                <button class="btn-primary" style="padding:4px 16px;" onclick="applyToUniversity('${uni.id}')">
                    Apply
                </button>
            </div>
        </div>
    `).join('');
}

// ============================================
// APPLY TO UNIVERSITY
// ============================================

function applyToUniversity(universityId) {
    // Redirect to application page or open modal
    window.location.href = `apply.html?university=${universityId}`;
}

// ============================================
// INITIALIZE SEARCH PAGE
// ============================================

// Run when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Check if we're on the search page
    const searchContainer = document.getElementById('searchResults');
    if (searchContainer) {
        const universities = await fetchUniversities();
        displayUniversities(universities);
    }
});
