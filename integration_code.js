/**
 * BRAND-SYNC: LEAD SYNDICATION SCRIPT
 * ----------------------------------------------------
 * Project: brandsyncsms (External Pull)
 * Passcode: dadasafa
 * 
 * Instructions:
 * 1. This script is already integrated into your BrandSync SMS platform.
 * 2. It pulls data from https://brand-sync.onrender.com directly.
 * 3. It automatically synchronizes leads to your local contact database.
 */

const CONFIG = {
    // Using a CORS proxy to ensure browser compatibility with external Render APIs
    LIVE_URL: 'https://corsproxy.io/?' + encodeURIComponent('https://brand-sync.onrender.com'), 
    PASSCODE: 'dadasafa'
};

/**
 * Main function to fetch leads from the Brand-Sync server
 */
async function pullLeadsFromBrandSync() {
    console.log('--- INITIATING LEAD PULL ---');
    
    // Attempt to find elements in the DOM (handling dynamic modal states)
    const statusEl = document.getElementById('sync-status');
    const btn = document.getElementById('pull-leads-btn');

    if (statusEl) {
        statusEl.textContent = 'Connecting to Cloud...';
        statusEl.style.color = '#ff9f0a';
    }
    
    // Disable button to prevent concurrent requests
    let originalHtml = '';
    if (btn) {
        btn.disabled = true;
        originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="icon-lucide-loader-2 animate-spin"></i> Syncing...';
    }

    try {
        // Construct the full target URL including query parameters first
        const targetUrl = `https://brand-sync.onrender.com/api/external/sync?pass=${CONFIG.PASSCODE}`;
        // Encode the entire thing for the proxy
        const proxiedUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
        
        const response = await fetch(proxiedUrl);

        if (!response.ok) {
            if (response.status === 401) throw new Error('Invalid Passcode');
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Successfully pulled ${data.count} leads.`);
        
        // --- LOCAL DATABASE PERSISTENCE ---
        // We call the core-api helper we defined earlier to ensure data is saved
        if (window.BrandSyncAPI && window.BrandSyncAPI.fetchBrandSyncLeads) {
            await window.BrandSyncAPI.fetchBrandSyncLeads();
            
            // Refresh the UI if the ContactsView is active
            if (window.ContactsView && typeof window.ContactsView.loadPendingData === 'function') {
                window.ContactsView.loadPendingData();
            }
        }
        
        // Render a visual preview if the container exists
        renderLeads(data.leads);
        
        if (statusEl) {
            statusEl.textContent = `Sync Success: ${data.count} leads`;
            statusEl.style.color = '#32d74b';
        }
        
        if (window.showToast) window.showToast(`Pull Successful: ${data.count} identities added.`, 'success');

        return data.leads;

    } catch (error) {
        console.error('Lead pull failed:', error.message);
        if (statusEl) {
            statusEl.textContent = 'Sync failed: ' + error.message;
            statusEl.style.color = '#ff453a';
        }
        if (window.showToast) window.showToast('Sync Error: ' + error.message, 'error');
        return null;
    } finally {
        // Restore button state
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalHtml;
        }
    }
}

/**
 * Display leads in your project (Contacts list)
 * @param {Array} leads - The list of visitors/leads
 */
function renderLeads(leads) {
    const container = document.getElementById('contacts'); 
    if (!container) return;

    // We don't overwrite if there's a table inside.
    // Instead, if it's the dynamic leads preview, we'll just log.
    // In our contacts view, we rely on loadPendingData for the actual table refresh.
    console.log('Rendering synced leads to preview...', leads);
}

// Make globally available
window.pullLeadsFromBrandSync = pullLeadsFromBrandSync;

// Global Event Delegation for dynamic buttons
document.addEventListener('click', (e) => {
    if (e.target && (e.target.id === 'pull-leads-btn' || e.target.closest('#pull-leads-btn'))) {
        pullLeadsFromBrandSync();
    }
});
