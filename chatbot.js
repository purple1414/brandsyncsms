// BrandSync AI Super-Agent Assistant
window.BrandSyncChatbot = {
    isOpen: false,
    lang: 'en',
    lastContext: '',
    
    // Core Centralized Knowledge Base & Workflow Directory
    KNOWLEDGE_BASE: {
        'contact': {
            en: "Here's how to manage your database. Do you want me to guide you step-by-step on how to add a contact?",
            tl: "Ito ay para sa pag-manage ng database. Gusto mo bang ituro ko sayo step-by-step kung paano mag-add ng contact?",
            actionName: "Guide me (Add Contact)",
            actionId: "add_contact"
        },
        'send': {
            en: "To dispatch an SMS, navigate to 'Send SMS'. You can define a Spintax payload to automatically rotate words. Do you want a quick walkthrough?",
            tl: "Para mag-send ng SMS, pumunta sa 'Send SMS'. Pwede kang gumamit ng Spintax para umikot ang mga words. Gusto mo ba ng walkthrough?",
            actionName: "Start Sending Tour",
            actionId: "send_sms"
        },
        'schedule': {
            en: "Running scheduled campaigns is incredibly easy. Just compile your message in 'Send SMS', but click the Clock icon instead of Send. It will queue into the 'Scheduled' automation queue.",
            tl: "Napakadaling gumawa ng scheduled campaigns. Gumawa lang ng message sa 'Send SMS', pero i-click ang Clock icon imbis na Send.",
            actionName: "Go to Automation",
            actionNavigate: "scheduled"
        },
        'template': {
            en: "Templates are stored configurations you can reuse instantly. Go to 'Templates', define a name, write your Spintax body, and save it. It will securely sync to the cloud.",
            tl: "Ang templates ay reusable na messages. Pumunta sa 'Templates', ilagay ang pangalan at mensahe, at i-save. Mag-sy-sync ito sa cloud."
        },
        'import': {
            en: "Got massive data? The system supports importing MS Excel (.xlsx) and generic CSV files. Want me to point out the button?",
            tl: "Maraming data? Supported ng system ang pag-import ng MS Excel (.xlsx) at CSV files. Gusto mong ituro ko yung button?",
            actionName: "Show me where",
            actionId: "heavy_import"
        },
        'github': {
            en: "We use a sophisticated GitHub Sync Engine to persist your data locally in the browser, yet securely sync it globally across devices for your entire team. Look at the Heart Pulse on the top right!",
            tl: "Gumagamit kami ng GitHub Sync Engine para ma-save ang data sa browser at ma-sync globally para sa team mo. Tiyaking berde ang Heart Pulse!"
        },
        'unsure': {
            en: "I'm not completely sure I have the latest update on that specific topic. Try asking me about 'Contacts', 'Sending SMS', 'Templates', or 'Imports'.",
            tl: "Hindi ako sigurado kung nakuha ko ang pinakabagong update para diyan. Subukan magtanong tungkol sa 'Contacts', 'Sending SMS', 'Templates', o 'Imports'."
        }
    },

    PAGE_CONTEXT: {
        'contacts': {
            en: "You are inside the Database root. Notice the global search bar—you can simultaneously search matching Names natively alongside applying active group filters.",
            tl: "Nasa Database root ka ngayon. Gamitin ang global search bar para sabay makapag-search ng pangalan at mag-apply ng group filters."
        },
        'send-sms': {
            en: "System alert: To maximize credit efficiency on this page, strictly monitor the Network Payload UI beneath the text editor. A single standard SMS supports 160 GSM characters.",
            tl: "System alert: Para ma-maximize ang credits dito, palaging bantayan ang Network Payload limit sa ibaba ng text space. 160 GSM characters ang limit."
        },
        'scheduled': {
            en: "Automation engine loaded. All pending dispatches here exist universally across your synced cloud instance.",
            tl: "Automation engine loaded. Lahat ng pending messages dito ay universal na naka-sync sa cloud system ninyo."
        }
    },

    init() {
        this.injectHTML();
        this.addEventListeners();
        this.scanSystem(); // Execute initial Deep Scan
        
        // Expose to window for global access
        window.BrandSyncChatbot = this;

        // Monitor hash changes for context
        window.addEventListener('hashchange', () => {
            if (this.isOpen) this.evaluateContext();
        });
    },

    // Safely scan the DOM to map available features and buttons dynamically
    scanSystem() {
        console.log("[AI Super-Agent] Deep Scan Initiated...");
        this.discoveredFeatures = [];
        
        // Scan main navigation items
        document.querySelectorAll('#mainNav li').forEach(el => {
            const txt = el.innerText.trim();
            if (txt) this.discoveredFeatures.push(txt.toLowerCase());
        });

        // Scan operational actions currently mounted in DOM
        document.querySelectorAll('button').forEach(btn => {
            if (btn.innerText && btn.innerText.length < 20 && !btn.innerText.includes('<')) {
                this.discoveredFeatures.push(btn.innerText.trim().toLowerCase());
            }
        });

        console.log("[AI Super-Agent] System Map Index acquired:", [...new Set(this.discoveredFeatures)]);
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
                width: 360px;
                height: 520px;
                background: rgba(25, 25, 30, 0.95);
                backdrop-filter: blur(40px) saturate(200%);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 24px;
                box-shadow: 0 30px 60px rgba(0,0,0,0.6), 0 0 100px rgba(10,132,255,0.1) inset;
                margin-bottom: 20px;
                flex-direction: column;
                overflow: hidden;
                transform-origin: bottom right;
                animation: chatPop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.25);
            ">
                <!-- Header -->
                <div style="padding: 16px 20px; background: rgba(0,0,0,0.25); border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #0a84ff, #bf5af2); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(10,132,255,0.4);">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a2 2 0 0 1 2 2c-.11.66.69 1.15 1.14.65l.5-.5a2 2 0 0 1 2.82 2.82l-.5.5c-.5.45-.01 1.25.65 1.14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2c-.66-.11-1.15.69-.65 1.14l.5.5a2 2 0 0 1-2.82 2.82l-.5-.5c-.45-.5-1.25-.01-1.14.65a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2c.11-.66-.69-1.15-1.14-.65l-.5.5a2 2 0 0 1-2.82-2.82l.5-.5c.5-.45.01-1.25-.65-1.14a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2c.66.11 1.15-.69.65-1.14l-.5-.5a2 2 0 0 1 2.82-2.82l.5.5c.45.5 1.25.01 1.14-.65a2 2 0 0 1-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </div>
                        <div>
                            <span style="font-weight: 800; color: #fff; font-size: 0.95rem; display: flex; align-items: center; gap:6px;">BrandSync Core <div style="width:6px; height:6px; border-radius:50%; background:#32d74b; box-shadow:0 0 8px #32d74b;"></div></span>
                            <span style="font-size: 0.65rem; color: rgba(255,255,255,0.5); font-weight: 700; text-transform: uppercase;">Agent Interface</span>
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button id="aiLangBtn" onclick="window.BrandSyncChatbot.toggleLanguage()" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: #fff; border-radius: 6px; padding: 2px 8px; font-size: 0.65rem; font-weight: 800; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">EN</button>
                        <button onclick="window.BrandSyncChatbot.toggle()" style="background: none; border: none; color: rgba(255,255,255,0.5); cursor: pointer; padding: 0; transition:0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.5)'">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                </div>

                <!-- Chat Body -->
                <div id="aiChatBody" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; scroll-behavior: smooth;">
                    <!-- Messages render here -->
                </div>

                <!-- Smart Suggestions -->
                <div id="aiChatSuggestions" style="padding: 0 16px 12px; display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none;">
                    <button class="ai-chip" onclick="window.BrandSyncChatbot.submitPredefined('Guide me to add contacts')" style="white-space:nowrap; background: rgba(10,132,255,0.1); border: 1px solid rgba(10,132,255,0.3); color: #0a84ff; border-radius: 12px; padding: 6px 12px; font-size: 0.7rem; font-weight: 700; cursor: pointer; transition: 0.2s;">🎯 Guide: Add Contacts</button>
                    <button class="ai-chip" onclick="window.BrandSyncChatbot.submitPredefined('What is GitHub Sync?')" style="white-space:nowrap; background: rgba(255,159,10,0.1); border: 1px solid rgba(255,159,10,0.3); color: #ff9f0a; border-radius: 12px; padding: 6px 12px; font-size: 0.7rem; font-weight: 700; cursor: pointer; transition: 0.2s;">☁️ Cloud Logic</button>
                    <button class="ai-chip" onclick="window.BrandSyncChatbot.submitPredefined('How do I send scheduled?')" style="white-space:nowrap; background: rgba(50,215,75,0.1); border: 1px solid rgba(50,215,75,0.3); color: #32d74b; border-radius: 12px; padding: 6px 12px; font-size: 0.7rem; font-weight: 700; cursor: pointer; transition: 0.2s;">⏱️ Automations</button>
                </div>

                <!-- Input Context -->
                <div style="padding: 16px; background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.05); display: flex; gap: 10px; align-items:center;">
                    <div style="flex: 1; position:relative;">
                        <input type="text" id="aiChatInput" placeholder="Interrogate the core system..." autocomplete="off" style="width:100%; height:44px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); border-radius: 14px; padding: 0 16px; color: #fff; font-size: 0.85rem; outline: none; transition: 0.2s;">
                    </div>
                    <button onclick="window.BrandSyncChatbot.submit()" style="width: 44px; height: 44px; background: linear-gradient(135deg, #0a84ff, #005bb5); border: none; border-radius: 14px; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 15px rgba(10,132,255,0.3);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </div>
            </div>

            <!-- Floating Toggle Button -->
            <button onclick="window.BrandSyncChatbot.toggle()" style="
                pointer-events: auto;
                width: 65px; height: 65px; 
                background: linear-gradient(135deg, #1c1c1e, #2c2c30); 
                border: 2px solid rgba(255,255,255,0.2); 
                border-radius: 50%; 
                display: flex; align-items: center; justify-content: center; 
                cursor: pointer; 
                box-shadow: 0 15px 40px rgba(0,0,0,0.8);
                transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                position: relative;
            " onmouseover="this.style.transform='scale(1.1)'; this.style.borderColor='rgba(10,132,255,0.6)'" onmouseout="this.style.transform='scale(1)'; this.style.borderColor='rgba(255,255,255,0.2)'">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                <div id="aiToggleBadge" style="position: absolute; top: -2px; right: -2px; width: 22px; height: 22px; background: #0a84ff; color: #fff; border-radius: 50%; font-size: 0.7rem; font-weight: 800; display: flex; align-items: center; justify-content: center; border: 2px solid #1c1c1e; box-shadow: 0 4px 10px rgba(10,132,255,0.5);">1</div>
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
            if(badge) badge.style.display = 'none'; // Unread status clear
            this.evaluateContext();
            setTimeout(() => document.getElementById('aiChatInput')?.focus(), 100);
            
            if(this.isFirstOpen === undefined) {
                this.isFirstOpen = false;
                const txt = this.lang === 'en' ? "System Core initialized. I am deeply integrated with BrandSync modules. How may I accelerate your workflow today?" : "System Core activated. Konektado ako sa lahat ng modules ng BrandSync. Paano ko mapapabilis ang trabaho mo ngayon?";
                this.addBotMessage(txt);
            }
        } else {
            windowEl.style.display = 'none';
        }
    },

    toggleLanguage() {
        this.lang = this.lang === 'en' ? 'tl' : 'en';
        document.getElementById('aiLangBtn').innerText = this.lang.toUpperCase();
        this.addBotMessage(this.lang === 'en' ? "Language switched to English. Knowledge base re-indexing complete." : "Pinalitan ang wika sa Tagalog. Handang tumulong muli.");
    },

    evaluateContext() {
        const hash = (window.location.hash || '').replace('#', '');
        
        // Don't repeat identical context tips to prevent spam
        if(this.PAGE_CONTEXT[hash] && this.lastContext !== hash) {
            this.lastContext = hash;
            
            // Artificial delay to simulate scanning current view
            setTimeout(() => {
                this.addBotMessage(`👁️ <b>Context Scan:</b> ${this.PAGE_CONTEXT[hash][this.lang]}`);
            }, 500);
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

        this.addUserMessage(text);
        input.value = '';

        // NLP Cognitive Engine Processing Array
        const lower = text.toLowerCase();
        let intentKey = 'unsure';

        // Deep Analysis matching
        if(lower.includes('contact') || lower.includes('add') || lower.includes('people') || lower.includes('database')) intentKey = 'contact';
        else if(lower.includes('send') || lower.includes('dispatch') || lower.includes('blast')) intentKey = 'send';
        else if(lower.includes('schedule') || lower.includes('automate') || lower.includes('later')) intentKey = 'schedule';
        else if(lower.includes('template') || lower.includes('spintax') || lower.includes('reuse') || lower.includes('save time')) intentKey = 'template';
        else if(lower.includes('import') || lower.includes('csv') || lower.includes('excel')) intentKey = 'import';
        else if(lower.includes('sync') || lower.includes('github') || lower.includes('cloud') || lower.includes('save')) intentKey = 'github';

        // Render response artificially later
        setTimeout(() => {
            const kbItem = this.KNOWLEDGE_BASE[intentKey];
            
            // Generate interactive HTML buttons if actions exist in Knowledge Base definition
            let actionHtml = '';
            if (kbItem.actionNavigate) {
                 actionHtml = `<div style="margin-top:10px;"><button onclick="window.location.hash='${kbItem.actionNavigate}'; window.BrandSyncChatbot.toggle()" style="background:var(--accent-color); border:none; padding:6px 14px; border-radius:8px; color:#fff; font-size:0.75rem; font-weight:800; cursor:pointer; box-shadow:0 4px 10px rgba(10,132,255,0.3);">${kbItem.actionName}</button></div>`;
            } else if (kbItem.actionId) {
                 actionHtml = `<div style="margin-top:10px;"><button onclick="window.BrandSyncChatbot.runOnScreenWalkthrough('${kbItem.actionId}')" style="background:#bf5af2; border:none; padding:6px 14px; border-radius:8px; color:#fff; font-size:0.75rem; font-weight:800; cursor:pointer; box-shadow:0 4px 10px rgba(191,90,242,0.3);"><i class="icon-lucide-navigation"></i> ${kbItem.actionName}</button></div>`;
            }

            this.addBotMessage(kbItem[this.lang] + actionHtml);
        }, 500 + Math.random() * 500); // Compute cycle delay
    },

    // ON-SCREEN INTERACTIVE TUTORIAL ENGINE
    // Physically hooks onto DOM elements and guides the user via pulsing halos
    runOnScreenWalkthrough(flowId) {
        this.toggle(); // Hide chat
        
        let steps = [];
        // Walkthrough Definitions Registry
        if (flowId === 'add_contact') {
            window.location.hash = 'contacts';
            steps = [
                { jsAction: () => true, selector: "button[onclick*='openEditModal']", msg: "Step 1: Click this primary button to invoke the secure Contact Entry modal." },
                { jsAction: () => window.ContactsView.openEditModal(), awaitSelector: "#contactModal", msg: "Step 2: You've penetrated the modal. Fill in the parameters (Name, Phone, etc). Notice we have validation." },
                { jsAction: () => true, selector: "#saveContactBtn", msg: "Step 3: Finally, hit Save to commit to the local indexedDB and globally sync to GitHub." }
            ];
        } else if (flowId === 'heavy_import') {
            window.location.hash = 'contacts';
            steps = [
                { jsAction: () => true, selector: "button[onclick*='importContacts']", msg: "Look here. This button bridges your raw Excel sheets directly into our structured database." }
            ];
        } else if (flowId === 'send_sms') {
            window.location.hash = 'send-sms';
            steps = [
                { jsAction: () => true, selector: "#chooseContactsBtn", msg: "Step 1: Extract target identities from your synced database." },
                { jsAction: () => true, selector: "#smsMessage", msg: "Step 2: Formulate your Spintax payload in the syntax editor." },
                { jsAction: () => true, selector: "#sendSmsBtn", msg: "Step 3: Establish connection and blast to the PhilSMS remote gateway." }
            ];
        } else {
             window.showToast("Walkthrough parameters missing or misconfigured.", "error"); return;
        }

        // Delay to allow hash navigation mounting
        setTimeout(() => this._orchestrateSteps(steps, 0), 400); 
    },

    _orchestrateSteps(steps, index) {
        if (index >= steps.length) {
            this._clearWalkthrough();
            window.showToast("Walkthrough simulation terminated successfully.", "success");
            return;
        }
        
        this._clearWalkthrough(); // clear previous
        const step = steps[index];

        // Execute JS requirement if defined (e.g., opening a modal)
        if (step.jsAction) step.jsAction();

        setTimeout(() => {
            const target = document.querySelector(step.awaitSelector || step.selector);
            if (!target) {
                console.warn("[AI Guide] Hook failed element unmounted for:", step.selector);
                window.showToast("Cannot find DOM reference. Ensure module is loaded.", "error");
                return;
            }

            // Create Visual Halo
            const halo = document.createElement('div');
            halo.id = 'aiWalkthroughHalo';
            const rect = target.getBoundingClientRect();
            
            halo.style.cssText = `
                position: fixed;
                top: ${rect.top - 6}px;
                left: ${rect.left - 6}px;
                width: ${rect.width + 12}px;
                height: ${rect.height + 12}px;
                border: 3px solid #bf5af2;
                border-radius: ${window.getComputedStyle(target).borderRadius || '12px'};
                box-shadow: 0 0 0 9999px rgba(0,0,0,0.6), 0 0 30px #bf5af2 inset;
                z-index: 100000;
                pointer-events: none;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                animation: pulseHalo 2s infinite;
            `;

            // Create Tooltip Overlay Dialog
            const dialog = document.createElement('div');
            dialog.id = 'aiWalkthroughDialog';
            dialog.style.cssText = `
                position: fixed;
                top: ${rect.bottom + 20 < window.innerHeight - 100 ? rect.bottom + 20 : rect.top - 120}px;
                left: ${Math.max(20, rect.left + (rect.width/2) - 150)}px;
                width: 300px;
                background: rgba(30,30,35,0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(191,90,242,0.4);
                border-radius: 16px;
                padding: 20px;
                color: #fff;
                z-index: 100001;
                box-shadow: 0 30px 60px rgba(0,0,0,0.6);
                animation: fadeIn 0.3s ease-out;
            `;

            dialog.innerHTML = `
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                    <div style="width:20px;height:20px;border-radius:50%;background:#bf5af2;display:flex;align-items:center;justify-content:center;"><i class="icon-lucide-bot" style="font-size:10px;"></i></div>
                    <span style="font-weight:800; font-size:0.8rem; text-transform:uppercase; color:#bf5af2;">BrandSync Guide</span>
                </div>
                <p style="font-size:0.85rem; line-height:1.5; margin:0 0 16px 0; color:rgba(255,255,255,0.8);">${step.msg}</p>
                <div style="display:flex; justify-content:space-between;">
                    <button id="aiWalkCancelBtn" style="background:transparent; border:none; color:rgba(255,255,255,0.4); font-size:0.75rem; font-weight:700; cursor:pointer;">Exit Protocol</button>
                    <button id="aiWalkNextBtn" style="background:#bf5af2; border:none; padding:8px 16px; border-radius:8px; color:#fff; font-size:0.8rem; font-weight:800; cursor:pointer;">${index === steps.length - 1 ? 'Finish' : 'Next Step'}</button>
                </div>
            `;

            document.body.appendChild(halo);
            document.body.appendChild(dialog);

            document.getElementById('aiWalkNextBtn').onclick = () => this._orchestrateSteps(steps, index + 1);
            document.getElementById('aiWalkCancelBtn').onclick = () => this._clearWalkthrough();

        }, 300); // 300ms dom mount buffer
    },

    _clearWalkthrough() {
        const h = document.getElementById('aiWalkthroughHalo');
        const d = document.getElementById('aiWalkthroughDialog');
        if(h) document.body.removeChild(h);
        if(d) document.body.removeChild(d);
    },

    addUserMessage(text) {
        const body = document.getElementById('aiChatBody');
        const msg = document.createElement('div');
        msg.style.cssText = `
            align-self: flex-end;
            background: linear-gradient(135deg, #0a84ff, #005bb5);
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
            <div style="flex-shrink: 0; width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg, #0a84ff, #bf5af2); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a2 2 0 0 1 2 2c-.11.66.69 1.15 1.14.65l.5-.5a2 2 0 0 1 2.82 2.82l-.5.5c-.5.45-.01 1.25.65 1.14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2c-.66-.11-1.15.69-.65 1.14l.5.5a2 2 0 0 1-2.82 2.82l-.5-.5c-.45-.5-1.25-.01-1.14.65a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2c.11-.66-.69-1.15-1.14-.65l-.5.5a2 2 0 0 1-2.82-2.82l.5-.5c.5-.45.01-1.25-.65-1.14a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2c.66.11 1.15-.69.65-1.14l-.5-.5a2 2 0 0 1 2.82-2.82l.5.5c.45.5 1.25.01 1.14-.65a2 2 0 0 1-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </div>
            <div style="
                background: rgba(255,255,255,0.06);
                border: 1px solid rgba(255,255,255,0.05);
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

// CSS Injection
(function() {
    if(!document.getElementById('aiSuperAgentStyles')) {
        const style = document.createElement('style');
        style.id = 'aiSuperAgentStyles';
        style.innerHTML = `
            @keyframes chatPop { 0% { opacity: 0; transform: scale(0.9) translateY(20px); filter:blur(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); filter:blur(0);} }
            @keyframes pulseHalo { 0% { box-shadow: 0 0 0 9999px rgba(0,0,0,0.6), 0 0 0 0 rgba(191,90,242,0.8) inset; } 50% { box-shadow: 0 0 0 9999px rgba(0,0,0,0.6), 0 0 30px rgba(191,90,242,1) inset; } 100% { box-shadow: 0 0 0 9999px rgba(0,0,0,0.6), 0 0 0 0 rgba(191,90,242,0.8) inset; } }
            .ai-chip:hover { background: rgba(255,255,255,0.1) !important; transform: translateY(-2px); }
        `;
        document.head.appendChild(style);
    }
})();

document.addEventListener('DOMContentLoaded', () => setTimeout(() => window.BrandSyncChatbot.init(), 1000));
