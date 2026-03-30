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
    // Hosted CRM URL (using CORS proxy to ensure browser compatibility)
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
        statusEl.textContent = 'Connecting to Cloud...';
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
        
        // Save leads to local database for persistence
        if (window.BrandSyncAPI && window.BrandSyncAPI.saveContact) {
            for (const lead of data.leads) {
                // Formatting data for the local contact engine
                const firstName = lead.first_name || lead.firstName || lead.name || 'Cloud';
                const lastName = lead.last_name || lead.lastName || '';
                const fullName = lead.name || `${firstName} ${lastName}`.trim();

                await window.BrandSyncAPI.saveContact({
                    name: fullName,
                    phone: lead.phone || '',
                    company: lead.company || 'External Sync',
                    event: lead.event || 'Cloud Lead',
                    interest: lead.interest || '',
                    added: new Date().toISOString(),
                    groupIds: []
                });
            }
        }

        // Render the preview on the page
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
        if (window.showToast) window.showToast('Pull Error: ' + error.message, 'error');
        return null;
    } finally {
        if (btn) btn.disabled = false;
    }
}

/**
 * Display leads in the preview dashboard
 * @param {Array} leads - The list of visitors/leads
 */
function renderLeads(leads) {
    const container = document.getElementById('contacts'); 
    if (!container) return;

    container.innerHTML = ''; 

    if (leads.length === 0) {
        container.innerHTML = '<div style="padding:20px; text-align:center; color:rgba(255,255,255,0.2);">No new leads synced.</div>';
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
        `;

        leadItem.innerHTML = `
            <div style="font-weight: 800; font-size: 1rem; color: #fff;">${lead.name || 'Anonymous'}</div>
            <div style="color: #32d74b; font-family: monospace; font-weight: 700;">Phone: ${lead.phone || 'N/A'}</div>
            <div style="color: rgba(255,255,255,0.4); font-size: 0.8rem;">Email: ${lead.email || 'N/A'}</div>
            <div style="display:flex; gap: 8px; margin-top: 5px;">
                <span style="background: rgba(255,255,255,0.05); color: #fff; padding: 3px 8px; border-radius: 6px; font-size: 0.65rem; font-weight: 800; border: 1px solid rgba(255,255,255,0.1);">
                    ${lead.approval_status || 'Synced'}
                </span>
                <span style="background: rgba(10,132,255,0.1); color: #0a84ff; padding: 3px 8px; border-radius: 6px; font-size: 0.65rem; font-weight: 800; border: 1px solid rgba(10,132,255,0.2);">
                    ${lead.event || 'Cloud Origin'}
                </span>
            </div>
        `;
        container.appendChild(leadItem);
    });
}
