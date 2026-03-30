// BrandSync AI Chatbot Assistant (Multilingual & Context-Aware)
window.BrandSyncChatbot = {
    isOpen: false,
    lang: 'en', // 'en' or 'tl'
    
    KNOWLEDGE_BASE: {
        'contact': {
            en: "To manage contacts, go to the 'Contacts' menu on the left. You can add one manually, or use 'Heavy Import' for CSV files. Need to group them? Select contacts and click 'Create Group'. <br><br><button onclick=\"window.location.hash='contacts'; window.BrandSyncChatbot.toggle()\" style='margin-top:8px; background:var(--accent-color); border:none; border-radius:8px; color:#fff; padding:6px 12px; font-size:0.75rem; font-weight:700; cursor:pointer;'>Go to Contacts</button>",
            tl: "Para i-manage ang contacts, pumunta sa 'Contacts' menu sa kaliwa. Pwede kang mag-add isa-isa, o gumamit ng 'Heavy Import' para sa CSV. Gusto mong i-group? I-check ang contacts tapos i-click ang 'Create Group'. <br><br><button onclick=\"window.location.hash='contacts'; window.BrandSyncChatbot.toggle()\" style='margin-top:8px; background:var(--accent-color); border:none; border-radius:8px; color:#fff; padding:6px 12px; font-size:0.75rem; font-weight:700; cursor:pointer;'>Pumunta sa Contacts</button>"
        },
        'send': {
            en: "To send an SMS, go to 'Send SMS'. You can type numbers directly, or click 'Select Contacts' to pull from your database or groups. You can also use Spintax like {Hello|Hi} to avoid spam filters!",
            tl: "Para mag-send ng SMS, pumunta sa 'Send SMS'. Pwedeng i-type ang number, o i-click ang 'Select Contacts' para pumili sa database mo. Pwede rin gumamit ng Spintax tulad ng {Hello|Hi} para iwas spam!"
        },
        'schedule': {
            en: "Scheduled messages let you automate texts! To schedule, go to 'Send SMS', compose your message, and click the 'Send Later (Clock)' icon next to the send button.",
            tl: "Sa Scheduled messages, pwede mong i-automate ang text! Para mag-schedule, pumunta sa 'Send SMS', gawin ang text, at i-click ang 'Send Later (Orasan)' na icon sa tabi ng send button."
        },
        'template': {
            en: "Templates save you time! Go to 'Templates' to create reusable message structures. You can organize them into categories like 'Promos' or 'Follow-ups'.",
            tl: "Makatipid sa oras gamit ang Templates! Pumunta sa 'Templates' para gumawa ng reusable texts. Pwede mo silang i-organize sa mga categories tulad ng 'Promos' o 'Follow-ups'."
        },
        'group': {
            en: "Groups are powerful! You can send bulk messages to entire groups at once. Just jump to Contacts, select multiple rows, and hit 'Create Group' or 'Add To...'.",
            tl: "Napaka-useful ng Groups! Pwede kang mag-send ng bulk messages sa buong grupo nang sabay-sabay. Pumunta lang sa Contacts, i-select ang rows, at i-click ang 'Create Group' o 'Add To...'."
        },
        'inbox': {
            en: "The 'Inbox' module shows all your historical data and replies from the PhilSMS gateway. Keep an eye out for Failed statuses so you can retry them.",
            tl: "Makikita sa 'Inbox' ang lahat ng historical data at replies galing sa PhilSMS gateway. Bantayan ang mga Failed statuses para ma-retry mo sila."
        },
        'hello': {
            en: "Hello! I'm your BrandSync Assistant. What can I help you with today? I can teach you about Contacts, Sending SMS, Scheduling, or Templates.",
            tl: "Kumusta! Ako ang iyong BrandSync Assistant. Ano ang maitutulong ko ngayon? Pwede kitang turuan tungkol sa Contacts, Pag-send ng SMS, Scheduling, o Templates."
        },
        'fallback': {
            en: "I didn't quite catch that. Try asking about 'Contacts', 'Send SMS', 'Templates', or 'Scheduling'!",
            tl: "Hindi ko masyadong naintindihan. Subukan mong magtanong tungkol sa 'Contacts', 'Send SMS', 'Templates', o 'Scheduling'!"
        }
    },
    
    PAGE_CONTEXT: {
        'contacts': {
            en: "I see you're on the Contacts page! Did you know you can use the 'Filter' button at the top to search by exact Date bounds or Companies?",
            tl: "Nasa Contacts page ka ngayon! Alam mo bang pwede mong gamitin ang 'Filter' button sa itaas para mag-search gamit ang Date o Company?"
        },
        'send-sms': {
            en: "You are preparing to Send an SMS. Pro tip: Always check your 'Network Payload' estimator before sending to ensure you don't accidentally over-consume your credits!",
            tl: "Magse-send ka ata ng SMS. Tip: Palaging i-check ang 'Network Payload' estimator bago mag-send para hindi maubos nang aksidente ang credits mo!"
        },
        'scheduled': {
            en: "You're viewing Scheduled Automation. Click the circular Refresh icon above to immediately pull the latest timings from the GitHub cloud database if they aren't showing up.",
            tl: "Nasa Scheduled Automation ka ngayon. I-click ang Refresh icon sa itaas para agad makuha ang pinakabagong data mula sa GitHub kapag hindi nagpapakita."
        }
    },

    init() {
        this.injectHTML();
        this.addEventListeners();
        
        // Expose to window for global access
        window.BrandSyncChatbot = this;
    },

    injectHTML() {
        if(document.getElementById('brandSyncChatbotWrapper')) return;
        
        const wrapper = document.createElement('div');
        wrapper.id = 'brandSyncChatbotWrapper';
        wrapper.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999999;
            font-family: 'Inter', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            pointer-events: none;
        `;
        
        wrapper.innerHTML = `
            <!-- Main Chat Window -->
            <div id="aiChatWindow" style="
                display: none;
                pointer-events: auto;
                width: 340px;
                height: 480px;
                background: rgba(25, 25, 30, 0.95);
                backdrop-filter: blur(40px) saturate(200%);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 24px;
                box-shadow: 0 30px 60px rgba(0,0,0,0.6);
                margin-bottom: 20px;
                flex-direction: column;
                overflow: hidden;
                transform-origin: bottom right;
                animation: chatPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            ">
                <!-- Header -->
                <div style="padding: 16px 20px; background: rgba(0,0,0,0.2); border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #0a84ff, #bf5af2); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(10,132,255,0.3);">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>
                        </div>
                        <div>
                            <span style="font-weight: 800; color: #fff; font-size: 0.95rem; display: block; line-height: 1;">BrandSync AI</span>
                            <span style="font-size: 0.65rem; color: #32d74b; font-weight: 700; text-transform: uppercase;">Online Assistant</span>
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button id="aiLangBtn" onclick="window.BrandSyncChatbot.toggleLanguage()" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 6px; padding: 2px 6px; font-size: 0.65rem; font-weight: 800; cursor: pointer;">EN</button>
                        <button onclick="window.BrandSyncChatbot.toggle()" style="background: none; border: none; color: rgba(255,255,255,0.5); cursor: pointer; padding: 0;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                </div>

                <!-- Chat Body -->
                <div id="aiChatBody" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; scroll-behavior: smooth;">
                    <!-- Messages go here -->
                </div>

                <!-- Suggestions / Chips -->
                <div id="aiChatSuggestions" style="padding: 0 16px 12px; display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none;">
                    <button class="ai-chip" onclick="window.BrandSyncChatbot.submitPredefined('How do I add contacts?')" style="white-space:nowrap; background: rgba(10,132,255,0.1); border: 1px solid rgba(10,132,255,0.3); color: #0a84ff; border-radius: 12px; padding: 6px 12px; font-size: 0.7rem; font-weight: 700; cursor: pointer; transition: 0.2s;">+ Add Contacts</button>
                    <button class="ai-chip" onclick="window.BrandSyncChatbot.submitPredefined('Teach me templates')" style="white-space:nowrap; background: rgba(191,90,242,0.1); border: 1px solid rgba(191,90,242,0.3); color: #bf5af2; border-radius: 12px; padding: 6px 12px; font-size: 0.7rem; font-weight: 700; cursor: pointer; transition: 0.2s;">🎨 Templates</button>
                    <button class="ai-chip" onclick="window.BrandSyncChatbot.submitPredefined('Send SMS help')" style="white-space:nowrap; background: rgba(50,215,75,0.1); border: 1px solid rgba(50,215,75,0.3); color: #32d74b; border-radius: 12px; padding: 6px 12px; font-size: 0.7rem; font-weight: 700; cursor: pointer; transition: 0.2s;">✉️ Send SMS</button>
                </div>

                <!-- Input Area -->
                <div style="padding: 16px; background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.05); display: flex; gap: 10px;">
                    <input type="text" id="aiChatInput" placeholder="Ask for guidance..." style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 0 16px; color: #fff; font-size: 0.85rem; outline: none; transition: 0.2s;">
                    <button onclick="window.BrandSyncChatbot.submit()" style="width: 44px; height: 44px; background: var(--accent-color); border: none; border-radius: 14px; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 15px rgba(10,132,255,0.3);">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </div>
            </div>

            <!-- Floating Toggle Button -->
            <button onclick="window.BrandSyncChatbot.toggle()" style="
                pointer-events: auto;
                width: 65px; height: 65px; 
                background: linear-gradient(135deg, #0a84ff, #005bb5); 
                border: 2px solid rgba(255,255,255,0.2); 
                border-radius: 50%; 
                display: flex; align-items: center; justify-content: center; 
                cursor: pointer; 
                box-shadow: 0 10px 30px rgba(10,132,255,0.5);
                transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                position: relative;
            " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <div id="aiToggleBadge" style="position: absolute; top: -2px; right: -2px; width: 22px; height: 22px; background: #ff453a; color: #fff; border-radius: 50%; font-size: 0.7rem; font-weight: 800; display: flex; align-items: center; justify-content: center; border: 2px solid #1c1c1e; box-shadow: 0 2px 8px rgba(255,69,58,0.5);">1</div>
            </button>
        `;
        
        document.body.appendChild(wrapper);
    },

    addEventListeners() {
        const input = document.getElementById('aiChatInput');
        if(input) {
            input.addEventListener('keypress', (e) => {
                if(e.key === 'Enter') this.submit();
            });
        }
    },

    toggle() {
        this.isOpen = !this.isOpen;
        const windowEl = document.getElementById('aiChatWindow');
        const badge = document.getElementById('aiToggleBadge');
        
        if(this.isOpen) {
            windowEl.style.display = 'flex';
            if(badge) badge.style.display = 'none'; // Clear notification
            
            // Check context upon opening if chat is empty or rarely opened
            this.evaluateContext();
            
            setTimeout(() => {
                document.getElementById('aiChatInput')?.focus();
            }, 100);
            
            if(this.isFirstOpen === undefined) {
                this.isFirstOpen = false;
                this.addBotMessage(this.KNOWLEDGE_BASE['hello'][this.lang]);
            }
        } else {
            windowEl.style.display = 'none';
        }
    },

    toggleLanguage() {
        this.lang = this.lang === 'en' ? 'tl' : 'en';
        document.getElementById('aiLangBtn').innerText = this.lang.toUpperCase();
        this.addBotMessage(this.lang === 'en' ? "Language switched to English. How can I assist?" : "Pinalitan ko ang wika sa Tagalog. Paano ako makakatulong?");
    },

    evaluateContext() {
        // Find current page via hash
        const hash = (window.location.hash || '').replace('#', '');
        if(this.PAGE_CONTEXT[hash]) {
            // Check if we haven't already given this tip recently
            if(this.lastContext !== hash) {
                this.lastContext = hash;
                setTimeout(() => {
                    this.addBotMessage("💡 " + this.PAGE_CONTEXT[hash][this.lang]);
                }, 800);
            }
        }
    },

    submitPredefined(text) {
        document.getElementById('aiChatInput').value = text;
        this.submit();
    },

    submit() {
        const input = document.getElementById('aiChatInput');
        const text = input.value.trim();
        if(!text) return;

        // Add user message
        this.addUserMessage(text);
        input.value = '';

        // Process intents via NLP keywords
        const lower = text.toLowerCase();
        let intent = 'fallback';

        if(lower.includes('contact') || lower.includes('people') || lower.includes('number')) intent = 'contact';
        else if(lower.includes('send') || lower.includes('sms') || lower.includes('message')) intent = 'send';
        else if(lower.includes('schedule') || lower.includes('later') || lower.includes('automate') || lower.includes('automation')) intent = 'schedule';
        else if(lower.includes('template') || lower.includes('spintax') || lower.includes('save time')) intent = 'template';
        else if(lower.includes('group') || lower.includes('bulk')) intent = 'group';
        else if(lower.includes('inbox') || lower.includes('reply') || lower.includes('replies') || lower.includes('history')) intent = 'inbox';
        else if(lower.includes('hi') || lower.includes('hello') || lower.includes('kumusta')) intent = 'hello';

        // Simulate thinking delay
        setTimeout(() => {
            this.addBotMessage(this.KNOWLEDGE_BASE[intent][this.lang]);
        }, 600 + Math.random() * 400); // 600-1000ms delay
    },

    addUserMessage(text) {
        const body = document.getElementById('aiChatBody');
        const msg = document.createElement('div');
        msg.style.cssText = `
            align-self: flex-end;
            background: var(--accent-color);
            color: #fff;
            padding: 10px 14px;
            border-radius: 18px;
            border-bottom-right-radius: 4px;
            max-width: 80%;
            font-size: 0.85rem;
            line-height: 1.4;
            box-shadow: 0 4px 10px rgba(10,132,255,0.2);
            animation: fadeIn 0.2s ease-out;
            word-wrap: break-word;
        `;
        msg.innerText = text;
        body.appendChild(msg);
        this.scrollToBottom();
    },

    addBotMessage(html) {
        const body = document.getElementById('aiChatBody');
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            display: flex;
            align-items: flex-end;
            gap: 8px;
            max-width: 85%;
            animation: fadeIn 0.3s ease-out;
        `;

        wrapper.innerHTML = `
            <div style="flex-shrink: 0; width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, #0a84ff, #bf5af2); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect></svg>
            </div>
            <div style="
                background: rgba(255,255,255,0.08);
                color: #fff;
                padding: 12px 16px;
                border-radius: 18px;
                border-bottom-left-radius: 4px;
                font-size: 0.85rem;
                line-height: 1.5;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            ">
                ${html}
            </div>
        `;
        body.appendChild(wrapper);
        this.scrollToBottom();
    },

    scrollToBottom() {
        const body = document.getElementById('aiChatBody');
        if(body) body.scrollTop = body.scrollHeight;
    }
};

// Add CSS animations to document head if not existing
(function() {
    if(!document.getElementById('aiChatbotStyles')) {
        const style = document.createElement('style');
        style.id = 'aiChatbotStyles';
        style.innerHTML = `
            @keyframes chatPop {
                0% { opacity: 0; transform: scale(0.9) translateY(20px); }
                100% { opacity: 1; transform: scale(1) translateY(0); }
            }
            .ai-chip:hover {
                background: rgba(255,255,255,0.1) !important;
                transform: scale(1.05);
            }
        `;
        document.head.appendChild(style);
    }
})();

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    // Delay initialization slightly to let the rest of the app mount
    setTimeout(() => {
        window.BrandSyncChatbot.init();
    }, 1000);
});
