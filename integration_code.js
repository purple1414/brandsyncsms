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
    // Replace this with your actual Render/Live URL
    LIVE_URL: 'https://brand-sync.onrender.com', 
    PASSCODE: 'dadasafa'
};

/**
 * Main function to fetch leads from the Brand-Sync server
 */
async function pullLeadsFromBrandSync() {
    console.log('--- INITIATING LEAD PULL ---');
    const statusEl = document.getElementById('sync-status');
    const btn = document.getElementById('pull-leads-btn');

    if (statusEl) {
        statusEl.textContent = 'Pulling leads...';
        statusEl.style.color = '#ff9f0a';
    }
    if (btn) btn.disabled = true;

    try {
        const url = `${CONFIG.LIVE_URL}/api/external/sync?pass=${CONFIG.PASSCODE}`;
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 401) throw new Error('Invalid Passcode');
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Successfully pulled ${data.count} leads.`);
        
        // --- LOCAL DATABASE PERSISTENCE (Added for App Compatibility) ---
        if (window.BrandSyncAPI && window.BrandSyncAPI.fetchBrandSyncLeads) {
            await window.BrandSyncAPI.fetchBrandSyncLeads();
            if (window.ContactsView && window.ContactsView.loadPendingData) {
                window.ContactsView.loadPendingData();
            }
        }
        // ---------------------------------------------------------------
        
        // Render the data on the page
        renderLeads(data.leads);
        
        if (statusEl) {
            statusEl.textContent = `Last sync: ${new Date().toLocaleTimeString()} (${data.count} leads)`;
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
        if (btn) btn.disabled = false;
    }
}

/**
 * Display leads in your project (Contacts list)
 * @param {Array} leads - The list of visitors/leads
 */
function renderLeads(leads) {
    const container = document.getElementById('contacts'); // Target your contacts element
    if (!container) {
        console.warn('UI Warning: No element with ID "contacts" found to display leads.');
        return;
    }

    // Keep the table if we want the existing approve buttons, or replace with cards if preferred.
    // Given the user instructions, we'll follow their card-based rendering but keep it inside the modal.
    container.innerHTML = ''; // Clear previous entries

    if (leads.length === 0) {
        container.innerHTML = '<div style="padding:20px; text-align:center; color:rgba(255,255,255,0.2);">No leads found to sync.</div>';
        return;
    }

    leads.forEach(lead => {
        const leadItem = document.createElement('div');
        leadItem.style.cssText = `
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 10px;
            display: flex;
            flex-direction: column;
            gap: 5px;
            color: #fff;
        `;

        leadItem.innerHTML = `
            <div style="font-weight: 800; font-size: 1rem; color: #fff;">${lead.name || 'Anonymous'}</div>
            <div style="color: #32d74b; font-family: monospace; font-weight: 700;">Phone: ${lead.phone || 'N/A'}</div>
            <div style="color: rgba(255,255,255,0.4); font-size: 0.8rem;">Email: ${lead.email || 'N/A'}</div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 5px;">
                <div style="display:flex; gap: 8px;">
                    <span style="background: rgba(255,255,255,0.05); color: #fff; padding: 3px 8px; border-radius: 6px; font-size: 0.65rem; font-weight: 800; border: 1px solid rgba(255,255,255,0.1);">
                        Status: ${lead.approval_status}
                    </span>
                    <span style="background: rgba(10,132,255,0.1); color: #0a84ff; padding: 3px 8px; border-radius: 6px; font-size: 0.65rem; font-weight: 800; border: 1px solid rgba(10,132,255,0.2);">
                        Event: ${lead.event || 'N/A'}
                    </span>
                </div>
                <button onclick="window.ContactsView.closePendingModal()" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#fff; padding:4px 10px; border-radius:8px; font-size:0.75rem; cursor:pointer;">Review in Table</button>
            </div>
        `;
        container.appendChild(leadItem);
    });
}

// Optional: Auto-link to a button if it exists
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('pull-leads-btn');
    if (btn) btn.addEventListener('click', pullLeadsFromBrandSync);
});
