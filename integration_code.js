/**
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
    // Using a CORS proxy for browser development if Render doesn't have CORS headers
    LIVE_URL: 'https://corsproxy.io/?' + encodeURIComponent('https://brand-sync.onrender.com'), 
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
        statusEl.textContent = 'CONNECTING TO CLOUD...';
        statusEl.style.color = '#ff9f0a';
        statusEl.style.background = 'rgba(255,159,10,0.1)';
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
        
        // Save leads to local database if API is available
        if (window.BrandSyncAPI && window.BrandSyncAPI.saveContact) {
            for (const lead of data.leads) {
                // Ensure name is properly set
                const first = lead.first_name || lead.firstName || lead.name || '';
                const last = lead.last_name || lead.lastName || '';
                const fullName = lead.name || `${first} ${last}`.trim();
                
                await window.BrandSyncAPI.saveContact({
                    name: fullName,
                    phone: lead.phone || '',
                    company: lead.company || '',
                    event: lead.event || 'Cloud Sync',
                    interest: lead.interest || '',
                    added: new Date().toISOString(),
                    groupIds: []
                });
            }
        }

        // Render the data on the page
        renderLeads(data.leads);
        
        if (statusEl) {
            statusEl.textContent = `SYNC SUCCESS: ${data.count} LEADS`;
            statusEl.style.color = '#32d74b';
            statusEl.style.background = 'rgba(50,215,75,0.1)';
        }

        if (window.showToast) window.showToast(`Lead Syndication Success: ${data.count} identities pulled.`, 'success');

        return data.leads;

    } catch (error) {
        console.error('Lead pull failed:', error.message);
        if (statusEl) {
            statusEl.textContent = 'SYNC FAILED';
            statusEl.style.color = '#ff453a';
            statusEl.style.background = 'rgba(255,69,58,0.1)';
        }
        if (window.showToast) window.showToast('Syndication Error: ' + error.message, 'error');
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
    const container = document.getElementById('contacts'); 
    if (!container) return;

    container.innerHTML = ''; 

    if (leads.length === 0) {
        container.innerHTML = '<div style="padding:20px; text-align:center; color:rgba(255,255,255,0.2); font-size:0.8rem; font-style:italic;">No new leads found in this pulse.</div>';
        return;
    }

    leads.forEach(lead => {
        const leadItem = document.createElement('div');
        leadItem.style.cssText = `
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 12px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 4px;
        `;

        leadItem.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div style="font-weight: 700; color: #fff; font-size:0.9rem;">${lead.name || 'Anonymous'}</div>
                <div style="font-size:0.65rem; color:#32d74b; font-weight:800; font-family:monospace;">+${lead.phone || 'N/A'}</div>
            </div>
            <div style="color: rgba(255,255,255,0.4); font-size: 0.75rem;">${lead.company || 'Private Entity'}</div>
            <div style="display:flex; gap:6px; margin-top:4px;">
                <span style="background: rgba(10,132,255,0.15); color: #0a84ff; padding: 2px 8px; border-radius: 6px; font-size: 0.6rem; font-weight:800; border: 1px solid rgba(10,132,255,0.3);">
                    ${lead.approval_status || 'Synced'}
                </span>
                <span style="background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.5); padding: 2px 8px; border-radius: 6px; font-size: 0.6rem; font-weight:700;">
                    ${lead.event || 'Unknown Origin'}
                </span>
            </div>
        `;
        container.appendChild(leadItem);
    });
}

// Optional: Auto-link to a button if it exists
document.addEventListener('DOMContentLoaded', () => {
    // Delay initialization to ensure other scripts are ready
    setTimeout(() => {
        const btn = document.getElementById('pull-leads-btn');
        if (btn) btn.addEventListener('click', pullLeadsFromBrandSync);
    }, 500);
});
