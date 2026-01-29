const mainView = document.getElementById('main-view');
const settingsView = document.getElementById('settings-view');
const openSettingsBtn = document.getElementById('open-settings-btn');
const closeSettingsBtn = document.getElementById('global-close-btn');
const backToMainGear = document.getElementById('back-to-main-gear');

const dropzone = document.getElementById('dropzone');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const toastEl = document.getElementById('toast');

const closeBtn = document.getElementById('close-btn');
const minBtn = document.getElementById('min-btn');

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        window.api.window.close(); // Actually hide logic in main
    });
}
if (minBtn) {
    minBtn.addEventListener('click', () => {
        // Since it's a tray app, minimize might hide it or minimize to tray
        window.api.window.close(); // Reusing hide logic for now as per tray standard
    });
}

// Views Switching
const windowTitle = document.getElementById('window-title');

const toggleCloseBtn = (show) => {
    if (show) closeSettingsBtn.classList.remove('hidden');
    else closeSettingsBtn.classList.add('hidden');
};

const openSettings = () => {
    mainView.classList.add('hidden');
    settingsView.classList.remove('hidden');
    toggleCloseBtn(true);
    windowTitle.textContent = 'Settings';
};

const returnToMain = () => {
    settingsView.classList.add('hidden');
    mainView.classList.remove('hidden');
    toggleCloseBtn(false);
    windowTitle.textContent = 'File Hub';
};

// Initial State: Hide Close button (since we start in Main view)
toggleCloseBtn(false);

openSettingsBtn.addEventListener('click', openSettings);
closeSettingsBtn.addEventListener('click', returnToMain);
backToMainGear.addEventListener('click', returnToMain);

// Init
loadSettings();

// Checkbox Logic
document.querySelectorAll('.label-group').forEach(group => {
    const cb = group.querySelector('.custom-checkbox');
    const input = group.querySelector('input');
    const dotIcon = group.closest('.setting-item').querySelector('.dot-check-icon');

    const updateUI = (checked) => {
        cb.classList.toggle('checked', checked);
        dotIcon.classList.toggle('checked', checked);
    };

    group.addEventListener('click', () => {
        input.checked = !input.checked;
        updateUI(input.checked);
    });

    // Initial sync
    setTimeout(() => updateUI(input.checked), 10);
});

// Drag & Drop
dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', async (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');

    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;

    await sendFilesDirectly(files);
});

const sentList = document.getElementById('sent-list');

const MAX_BATCH_SIZE_MB = 25;

async function sendFilesDirectly(files) {
    const settings = await window.api.settings.get();
    if (!settings.email || !settings.appPassword) {
        showToast('Please configure email settings!');
        openSettingsBtn.click();
        return;
    }

    const { batches, oversized } = createBatches(files);

    if (oversized.length > 0) {
        showToast(`Skipped ${oversized.length} file(s) larger than 25MB.`);
    }

    if (batches.length === 0) return;

    const mainProgress = document.getElementById('main-progress');
    const mainBar = document.getElementById('progress-bar-main');
    const mainText = document.getElementById('progress-text-main');

    mainProgress.classList.remove('hidden');

    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        const batchSizeMB = (batch.totalSize / (1024 * 1024)).toFixed(2);

        mainBar.style.width = '0%';
        mainText.textContent = `Sending Batch ${i + 1}/${batches.length} (${batchSizeMB} MB)...`;

        try {
            const fileData = batch.files.map(f => ({ name: f.name, path: f.path, size: f.size }));

            // UX Simulation
            let progress = 0;
            const interval = setInterval(() => {
                progress += 5;
                if (progress > 90) clearInterval(interval);
                mainBar.style.width = `${progress}%`;
            }, 100);

            await window.api.sendMail(fileData);

            clearInterval(interval);
            mainBar.style.width = '100%';

            addToSentList(fileData);
        } catch (err) {
            mainText.textContent = 'Failed!';
            showToast(`Batch ${i + 1} failed: ${err.message}`);
            break; // Stop remaining batches on error? Or continue? Let's stop.
        }
    }

    mainText.textContent = 'All Sent!';
    showToast('All batches sent successfully!');
    setTimeout(() => mainProgress.classList.add('hidden'), 3000);
}

function createBatches(files) {
    const batches = [];
    const oversized = [];
    let currentBatch = { files: [], totalSize: 0 };

    files.forEach(file => {
        const fileSizeMB = file.size / (1024 * 1024);

        if (fileSizeMB > MAX_BATCH_SIZE_MB) {
            oversized.push(file);
            return;
        }

        const currentBatchSizeMB = currentBatch.totalSize / (1024 * 1024);

        if (currentBatchSizeMB + fileSizeMB > MAX_BATCH_SIZE_MB) {
            // Push current batch and start new
            batches.push(currentBatch);
            currentBatch = { files: [file], totalSize: file.size };
        } else {
            currentBatch.files.push(file);
            currentBatch.totalSize += file.size;
        }
    });

    if (currentBatch.files.length > 0) {
        batches.push(currentBatch);
    }

    return { batches, oversized };
}

function addToSentList(files) {
    if (sentList.querySelector('.empty-state')) {
        sentList.innerHTML = '';
    }

    files.forEach(file => {
        const item = document.createElement('div');
        item.className = 'sent-item';
        item.innerHTML = `
            <span class="material-icons sent-item-icon">description</span>
            <div class="sent-item-info">
                <div class="sent-item-name">${file.name}</div>
                <div class="sent-item-meta">${(file.size / 1024).toFixed(1)} KB • Just now</div>
            </div>
        `;
        sentList.prepend(item);
    });
}


// Theme Logic
const themeSelect = document.getElementById('theme-select');

function applyTheme(theme) {
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
}

themeSelect.addEventListener('change', async (e) => {
    const newTheme = e.target.value;
    applyTheme(newTheme);

    // Save partial setting without erasing others
    const currentSettings = await window.api.settings.get();
    await window.api.settings.save({ ...currentSettings, theme: newTheme });
});

// System Change Listener
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', async () => {
    const settings = await window.api.settings.get();
    if (settings.theme === 'system') {
        applyTheme('system');
    }
});

// Init Settings & Theme
async function loadSettings() {
    const settings = await window.api.settings.get();
    emailInput.value = settings.email || '';
    passwordInput.value = settings.appPassword || '';
    document.getElementById('autostart-check').checked = settings.autoStart;
    document.getElementById('notify-check').checked = settings.notifications;

    // Theme init
    const currentTheme = settings.theme || 'system';
    themeSelect.value = currentTheme;
    applyTheme(currentTheme);
}

saveSettingsBtn.addEventListener('click', async () => {
    const currentTheme = themeSelect.value;
    await window.api.settings.save({
        email: emailInput.value,
        appPassword: passwordInput.value,
        autoStart: document.getElementById('autostart-check').checked,
        notifications: document.getElementById('notify-check').checked,
        theme: currentTheme
    });
    showToast('Settings saved!');
});

function showToast(msg) {
    // Check if notifications are enabled
    const notificationsEnabled = document.getElementById('notify-check').checked;
    if (!notificationsEnabled) return;

    toastEl.textContent = msg;
    toastEl.classList.remove('hidden');
    setTimeout(() => toastEl.classList.add('hidden'), 3000);
}
