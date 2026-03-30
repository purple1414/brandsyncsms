* BRAND-SYNC: LEAD SYNDICATION SCRIPT
 * ----------------------------------------------------
 * Project: brandsyncsms (External Pull)
 * Passcode: dadasafa
 * 
 * Instructions for Co-developer:
 * 1. Paste this script into your project.
 * 2. Update the 'LIVE_URL' below with your deployed Brand-Sync URL.
 * 3. Add a button with ID 'pull-leads-btn' to your HTML.
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
    if (statusEl) statusEl.textContent = 'Pulling leads...';

    try {
        const url = `${CONFIG.LIVE_URL}/api/external/sync?pass=${CONFIG.PASSCODE}`;
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 401) throw new Error('Invalid Passcode');
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Successfully pulled ${data.count} leads.`);
        
        // Render the data on the page
        renderLeads(data.leads);
        
        if (statusEl) statusEl.textContent = `Last sync: ${new Date().toLocaleTimeString()} (${data.count} leads)`;
        return data.leads;

    } catch (error) {
        console.error('Lead pull failed:', error.message);
        if (statusEl) statusEl.textContent = 'Sync failed: ' + error.message;
        alert('Sync Error: ' + error.message);
        return null;
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

    container.innerHTML = ''; // Clear previous entries

    if (leads.length === 0) {
        container.innerHTML = '<div class="no-leads">No leads found to sync.</div>';
        return;
    }

    leads.forEach(lead => {
        const leadItem = document.createElement('div');
        leadItem.className = 'lead-card';
        leadItem.style.borderBottom = '1px solid #ddd';
        leadItem.style.padding = '10px';
        leadItem.style.marginBottom = '5px';

        leadItem.innerHTML = `
            <div style="font-weight: bold; font-size: 1.1em;">${lead.name || 'Anonymous'}</div>
            <div style="color: #444;">Phone: ${lead.phone || 'N/A'}</div>
            <div style="color: #666; font-size: 0.9em;">Email: ${lead.email || 'N/A'}</div>
            <div style="margin-top: 5px;">
                <span style="background: #eee; padding: 2px 6px; border-radius: 4px; font-size: 0.8em;">
                    Status: ${lead.approval_status}
                </span>
                <span style="background: #e3f2fd; padding: 2px 6px; border-radius: 4px; font-size: 0.8em; margin-left: 5px;">
                    Event: ${lead.event || 'N/A'}
                </span>
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
"
