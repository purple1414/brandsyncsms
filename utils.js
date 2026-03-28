// Utility functions for UI and Logic

window.showToast = (message, type = 'success') => {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position:fixed; bottom:24px; right:24px; z-index:100000; display:flex; flex-direction:column; gap:10px; pointer-events:none;';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        background: rgba(30, 30, 35, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.1);
        color: #fff;
        padding: 12px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 0.9rem;
        font-weight: 500;
        animation: slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border-left: 4px solid ${type === 'error' ? '#ff453a' : type === 'info' ? '#0a84ff' : '#32d74b'};
    `;
    
    let icon = 'icon-lucide-check-circle';
    if(type === 'error') icon = 'icon-lucide-alert-circle';
    
    toast.innerHTML = `
        <i class="${icon}"></i>
        <div>${message}</div>
    `;
    
    container.appendChild(toast);
    
    // Animate out and remove
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// GSM 7-bit validation and counter
// A standard GSM 7-bit character set includes basic letters, numbers, and some symbols.
// For simplicity, we define max length rules.
window.calculateSMSLength = (text) => {
    // Check if contains non-GSM characters (e.g. unicode / emojis)
    const gsmRegex = /^[@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞ\^{}\[\]~|€ÆæßÉ !"#¤%&'()*+,\-./0-9:;<=>?¡A-ZÄÖÑÜ§¿a-zäöñüà]*$/;
    const isGSM = gsmRegex.test(text);
    const length = text.length;
    
    let segmentLength = 160;
    let maxSegments = 1;
    let encoding = isGSM ? 'GSM-7' : 'UCS-2';
    
    if (isGSM) {
        if (length > 160) segmentLength = 153; // Concatenated SMS standard
        maxSegments = Math.ceil(length / segmentLength) || 1;
    } else {
        segmentLength = 70;
        if (length > 70) segmentLength = 67;
        maxSegments = Math.ceil(length / segmentLength) || 1;
    }
    
    return {
        length,
        segments: maxSegments,
        encoding,
        remainingInSegment: segmentLength - (length % segmentLength === 0 && length > 0 ? segmentLength : length % segmentLength)
    };
};
