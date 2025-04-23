// Global variables
let socket = null;
let connected = false;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap components
    // Manually activate the tab functionality for the main navigation tabs
    const navTabLinks = document.querySelectorAll('.navbar-nav .nav-link[data-bs-toggle="tab"]');
    navTabLinks.forEach(tabLink => {
        tabLink.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('data-bs-target');
            
            // Hide all tab panes
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('show', 'active');
            });
            
            // Show the selected tab pane
            const targetPane = document.querySelector(targetId);
            if (targetPane) {
                targetPane.classList.add('show', 'active');
            }
            
            // Update active state in nav
            navTabLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Initialize Bootstrap tabs for in-page tabs (like JSON, YAML, Exploit tabs)
    const inPageTabLinks = document.querySelectorAll('.card-header-tabs .nav-link[data-bs-toggle="tab"]');
    inPageTabLinks.forEach(tabLink => {
        tabLink.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('data-bs-target');
            
            // Find the parent tab-content
            const tabContent = this.closest('.card').querySelector('.tab-content');
            
            // Hide all tab panes in this tab-content
            tabContent.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('show', 'active');
            });
            
            // Show the selected tab pane
            const targetPane = document.querySelector(targetId);
            if (targetPane) {
                targetPane.classList.add('show', 'active');
            }
            
            // Update active state in nav
            const navLinks = this.closest('.nav-tabs').querySelectorAll('.nav-link');
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Initialize accordion functionality
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = document.querySelector(this.getAttribute('data-bs-target'));
            if (target) {
                const isCollapsed = target.classList.contains('show');
                if (isCollapsed) {
                    target.classList.remove('show');
                    this.classList.add('collapsed');
                    this.setAttribute('aria-expanded', 'false');
                } else {
                    // Close other open accordion items in the same accordion
                    const accordion = target.getAttribute('data-bs-parent');
                    if (accordion) {
                        document.querySelectorAll(`${accordion} .accordion-collapse.show`).forEach(item => {
                            if (item !== target) {
                                item.classList.remove('show');
                                const button = document.querySelector(`[data-bs-target="#${item.id}"]`);
                                if (button) {
                                    button.classList.add('collapsed');
                                    button.setAttribute('aria-expanded', 'false');
                                }
                            }
                        });
                    }
                    
                    target.classList.add('show');
                    this.classList.remove('collapsed');
                    this.setAttribute('aria-expanded', 'true');
                }
            }
        });
    });
    
    // Initialize form handlers
    initializePersonApiForms();
    initializeFileUpload();
    initializeWebSocketChat();
    
    // Add syntax highlighting to code elements
    document.querySelectorAll('.code-highlight').forEach(element => {
        element.classList.add('language-json');
    });
    
    // Initialize form validation
    document.querySelectorAll('.needs-validation').forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
});

// Person API related functionality
function initializePersonApiForms() {
    // Person Builder functionality
    initializePersonBuilder();
    
    // Get Person Form
    document.getElementById('getPerson-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const personId = document.getElementById('person-id').value;
        const resultElement = document.getElementById('getPerson-result');
        const statusElement = document.getElementById('getPerson-status');
        
        resultElement.textContent = 'Loading...';
        statusElement.textContent = 'Requesting...';
        statusElement.className = 'badge bg-warning';
        
        fetch(`/persons/${personId}`)
            .then(response => {
                statusElement.textContent = `Status: ${response.status} ${response.statusText}`;
                statusElement.className = response.ok ? 'badge bg-success' : 'badge bg-danger';
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                resultElement.textContent = formatJson(data);
                applySyntaxHighlighting(resultElement);
            })
            .catch(error => {
                resultElement.textContent = `Error: ${error.message}`;
                statusElement.textContent = 'Error';
                statusElement.className = 'badge bg-danger';
            });
    });
    
    // Create Person JSON Form
    document.getElementById('createPersonJson-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const jsonPayload = document.getElementById('json-payload').value;
        const resultElement = document.getElementById('createPersonJson-result');
        const statusElement = document.getElementById('createPersonJson-status');
        
        // Basic validation
        if (!isValidJson(jsonPayload)) {
            document.getElementById('json-payload').classList.add('is-invalid');
            return;
        }
        
        resultElement.textContent = 'Submitting...';
        statusElement.textContent = 'Requesting...';
        statusElement.className = 'badge bg-warning';
        
        fetch('/persons', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: jsonPayload
        })
            .then(response => {
                statusElement.textContent = `Status: ${response.status} ${response.statusText}`;
                statusElement.className = response.ok ? 'badge bg-success' : 'badge bg-danger';
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                resultElement.textContent = data || 'Success! Person created.';
            })
            .catch(error => {
                resultElement.textContent = `Error: ${error.message}`;
            });
    });
    
    // Format JSON button
    document.getElementById('format-json-btn').addEventListener('click', function() {
        const jsonInput = document.getElementById('json-payload');
        try {
            const jsonObj = JSON.parse(jsonInput.value);
            jsonInput.value = formatJson(jsonObj);
            jsonInput.classList.remove('is-invalid');
        } catch (e) {
            // If not valid JSON, don't change anything
            console.error('Invalid JSON');
            jsonInput.classList.add('is-invalid');
        }
    });
    
    // Create Person YAML Form
    document.getElementById('createPersonYaml-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const yamlPayload = document.getElementById('yaml-payload').value;
        const resultElement = document.getElementById('createPersonYaml-result');
        const statusElement = document.getElementById('createPersonYaml-status');
        
        // Basic YAML validation - check if not empty
        if (!yamlPayload.trim()) {
            document.getElementById('yaml-payload').classList.add('is-invalid');
            return;
        }
        
        resultElement.textContent = 'Submitting...';
        statusElement.textContent = 'Requesting...';
        statusElement.className = 'badge bg-warning';
        
        fetch('/persons', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=UTF-8'
            },
            body: yamlPayload
        })
            .then(response => {
                statusElement.textContent = `Status: ${response.status} ${response.statusText}`;
                statusElement.className = response.ok ? 'badge bg-success' : 'badge bg-danger';
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                resultElement.textContent = data || 'Success! Person created.';
            })
            .catch(error => {
                resultElement.textContent = `Error: ${error.message}`;
            });
    });
    
    // Jackson Vulnerability Test Form
    document.getElementById('jacksonVuln-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const payload = document.getElementById('jackson-payload').value;
        const resultElement = document.getElementById('jacksonVuln-result');
        const statusElement = document.getElementById('jacksonVuln-status');
        
        resultElement.textContent = 'Exploiting...';
        statusElement.textContent = 'Requesting...';
        statusElement.className = 'badge bg-warning';
        
        fetch('/persons', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: payload
        })
            .then(response => {
                const statusText = `Status: ${response.status} ${response.statusText}`;
                statusElement.textContent = statusText;
                statusElement.className = response.ok ? 'badge bg-success' : 'badge bg-danger';
                
                if (!response.ok) {
                    return response.text().then(text => {
                        return `${statusText}\n${text}`;
                    });
                }
                return response.text().then(text => {
                    return `${statusText}\n${text || 'Exploit payload successful!'}`;
                });
            })
            .then(data => {
                resultElement.textContent = data;
            })
            .catch(error => {
                resultElement.textContent = `Error: ${error.message}`;
                statusElement.textContent = 'Error';
                statusElement.className = 'badge bg-danger';
            });
    });
    
    // Insert LDAP URL button
    document.getElementById('insert-ldap-url-btn').addEventListener('click', function() {
        const textarea = document.getElementById('jackson-payload');
        const payload = textarea.value;
        
        // Try to prompt the user for their LDAP URL
        const ldapUrl = prompt('Enter your LDAP URL:', 'ldap://localhost:1389/obj');
        
        if (ldapUrl) {
            // Basic find and replace for the URL
            const updatedPayload = payload.replace(/"healthCheckRegistry": "[^"]*"/, `"healthCheckRegistry": "${ldapUrl}"`);
            textarea.value = updatedPayload;
        }
    });
}

// Person Builder functionality
function initializePersonBuilder() {
    document.getElementById('generate-payload-btn').addEventListener('click', function() {
        const id = document.getElementById('builder-id').value;
        const firstname = document.getElementById('builder-firstname').value;
        const lastname = document.getElementById('builder-lastname').value;
        const format = document.getElementById('builder-format').value;
        
        const now = new Date().toISOString();
        
        let result = '';
        
        if (format === 'json') {
            const personObj = {
                id: parseInt(id),
                firstname: firstname,
                lastname: lastname,
                createdAt: now,
                modifiedAt: now
            };
            
            result = formatJson(personObj);
            
            // Show in a modal or alert
            alert(`Generated JSON Payload:\n\n${result}`);
        } else {
            // YAML Format
            result = `id: ${id}\nfirstname: ${firstname}\nlastname: ${lastname}\ncreatedAt: ${now}\nmodifiedAt: ${now}`;
            
            // Show in a modal or alert
            alert(`Generated YAML Payload:\n\n${result}`);
        }
    });
    
    document.getElementById('apply-to-form-btn').addEventListener('click', function() {
        const id = document.getElementById('builder-id').value;
        const firstname = document.getElementById('builder-firstname').value;
        const lastname = document.getElementById('builder-lastname').value;
        const format = document.getElementById('builder-format').value;
        
        const now = new Date().toISOString();
        
        if (format === 'json') {
            const personObj = {
                id: parseInt(id),
                firstname: firstname,
                lastname: lastname,
                createdAt: now,
                modifiedAt: now
            };
            
            document.getElementById('json-payload').value = formatJson(personObj);
            // Use Bootstrap's Tab API to switch tabs
            const tabElement = document.querySelector('#json-tab');
            const tab = new bootstrap.Tab(tabElement);
            tab.show();
        } else {
            // YAML Format
            const yamlPayload = `id: ${id}\nfirstname: ${firstname}\nlastname: ${lastname}\ncreatedAt: ${now}\nmodifiedAt: ${now}`;
            
            document.getElementById('yaml-payload').value = yamlPayload;
            // Use Bootstrap's Tab API to switch tabs
            const tabElement = document.querySelector('#yaml-tab');
            const tab = new bootstrap.Tab(tabElement);
            tab.show();
        }
    });
}

// File Upload related functionality
function initializeFileUpload() {
    document.getElementById('fileUpload-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const fileInput = document.getElementById('file');
        const resultElement = document.getElementById('fileUpload-result');
        const progressContainer = document.getElementById('upload-progress-container');
        const progressBar = document.getElementById('upload-progress-bar');
        
        if (!fileInput.files.length) {
            resultElement.textContent = 'Please select a file to upload.';
            return;
        }
        
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        
        // Show progress bar
        progressContainer.classList.remove('d-none');
        progressBar.style.width = '0%';
        resultElement.textContent = 'Uploading...';
        
        fetch('/api/files/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                // Simulate progress for demonstration purposes
                simulateProgress(progressBar, () => {
                    resultElement.textContent = data;
                });
            })
            .catch(error => {
                progressContainer.classList.add('d-none');
                resultElement.textContent = `Error: ${error.message}`;
            });
    });
}

// Function to simulate upload progress
function simulateProgress(progressBar, callback) {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        progressBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                callback();
            }, 500);
        }
    }, 100);
}

// WebSocket Chat related functionality
function initializeWebSocketChat() {
    const connectBtn = document.getElementById('connect-btn');
    const disconnectBtn = document.getElementById('disconnect-btn');
    const statusElement = document.getElementById('connection-status');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    
    connectBtn.addEventListener('click', function() {
        if (connected) return;
        
        // Create WebSocket connection
        socket = new WebSocket(`ws://${window.location.host}/chat-websocket`);
        
        socket.onopen = function() {
            connected = true;
            statusElement.innerHTML = '<i class="bi bi-check-circle-fill"></i> Connected';
            statusElement.classList.remove('alert-warning');
            statusElement.classList.add('alert-success');
            
            connectBtn.disabled = true;
            disconnectBtn.disabled = false;
            
            addSystemMessage('Connected to chat server!');
        };
        
        socket.onclose = function() {
            disconnectChat();
            addSystemMessage('Disconnected from chat server');
        };
        
        socket.onerror = function(error) {
            disconnectChat();
            addSystemMessage('Error: Could not connect to chat server');
            console.error('WebSocket error:', error);
        };
        
        socket.onmessage = function(event) {
            const message = event.data;
            addChatMessage(message, 'received');
        };
    });
    
    disconnectBtn.addEventListener('click', function() {
        if (!connected || !socket) return;
        
        socket.close();
        disconnectChat();
    });
    
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!connected || !socket) return;
        
        const message = chatInput.value.trim();
        if (!message) return;
        
        socket.send(message);
        addChatMessage(message, 'sent');
        chatInput.value = '';
    });
}

function disconnectChat() {
    connected = false;
    socket = null;
    
    const statusElement = document.getElementById('connection-status');
    statusElement.innerHTML = '<i class="bi bi-x-circle-fill"></i> Not Connected';
    statusElement.classList.remove('alert-success');
    statusElement.classList.add('alert-warning');
    
    document.getElementById('connect-btn').disabled = false;
    document.getElementById('disconnect-btn').disabled = true;
}

function addChatMessage(message, type) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', type, 'fadeIn');
    
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    
    messageElement.innerHTML = `
        <div>${escapeHtml(message)}</div>
        <div class="chat-time">${timeString}</div>
    `;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addSystemMessage(message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('alert', 'alert-info', 'mb-2', 'fadeIn');
    messageElement.textContent = message;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Utility function to escape HTML
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Utility function to format JSON
function formatJson(obj) {
    return JSON.stringify(obj, null, 2);
}

// Utility function to validate JSON
function isValidJson(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

// Apply syntax highlighting to code elements
function applySyntaxHighlighting(element) {
    const text = element.textContent;
    let html = '';
    
    try {
        // Try to parse as JSON
        const obj = JSON.parse(text);
        html = highlightJson(text);
    } catch (e) {
        // If not JSON or error, just escape HTML
        html = escapeHtml(text);
    }
    
    element.innerHTML = html;
}

// Highlight JSON syntax
function highlightJson(json) {
    return json
        .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                    match = match.replace(/:$/, '');
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
}