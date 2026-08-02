// Tetrashop Advanced UI Management System
class TetrashopAdvancedUI {
    constructor() {
        this.currentSection = 'dashboard';
        this.selectedAlgorithms = new Set();
        this.algorithmData = null;
        this.sectionTitles = {
            'dashboard': 'داشبورد اصلی',
            'nlp-overview': 'پردازش زبان طبیعی',
            'quantum-writer': 'Quantum Writer',
            'secret-garden': 'Secret Garden',
            'speech-recognition': 'تشخیص گفتار',
            'code-output': 'خروجی کد',
            'all-algorithms': 'همه الگوریتم‌ها'
        };
        
        this.init();
    }

    async init() {
        try {
            // Hide loading screen
            setTimeout(() => {
                document.getElementById('loading').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('loading').style.display = 'none';
                }, 500);
            }, 1500);

            // Setup navigation
            this.setupNavigation();
            
            // Load all data
            await this.loadAllData();
            
            // Setup search
            this.setupGlobalSearch();
            
            // Setup section switching
            this.setupSectionSwitching();
            
            // Update system stats
            this.updateSystemStats();
            
            // Setup real-time updates
            this.setupRealTimeUpdates();
            
            this.showNotification('✅ سیستم مدیریت تتراشاپ با موفقیت بارگذاری شد', 'success');
            
            // Set NLP count to 219
            document.getElementById('nlp-count').textContent = '219';
            
        } catch (error) {
            console.error('خطا در بارگذاری سیستم:', error);
            this.showNotification('❌ خطا در بارگذاری سیستم', 'error');
        }
    }

    async loadAllData() {
        try {
            // Load algorithms data
            this.algorithmData = await tetrashopAPI.getAllAlgorithms();
            
            // Update dashboard stats
            this.updateDashboardStats();
            
            // Load NLP data
            await this.loadNLPData();
            
            // Load Quantum Writer data
            await this.loadQuantumData();
            
            // Load Secret Garden data
            await this.loadSecretData();
            
            // Load Speech Recognition data
            await this.loadSpeechData();
            
            // Load recent activity
            this.loadActivityLog();
            
            // Update last update time
            document.getElementById('last-update').textContent = 
                `آخرین بروزرسانی: ${new Date().toLocaleTimeString('fa-IR')}`;
                
        } catch (error) {
            console.error('خطا در بارگذاری داده‌ها:', error);
        }
    }

    updateDashboardStats() {
        if (!this.algorithmData) return;
        
        const stats = tetrashopAPI.calculateStats(this.algorithmData);
        
        // Update total algorithms
        document.getElementById('total-algorithms').textContent = stats.total;
        document.getElementById('total-algos').textContent = stats.total;
        
        // Update category counts
        document.getElementById('quantum-count').textContent = stats.byCategory.quantum || 0;
        document.getElementById('secret-count').textContent = stats.byCategory.secret || 0;
        document.getElementById('speech-count').textContent = stats.byCategory.speech || 0;
        
        // Update total lines
        document.getElementById('total-lines').textContent = stats.totalLines.toLocaleString();
        
        // Update filter count
        document.getElementById('filter-count').textContent = `${stats.total} مورد`;
    }

    async loadNLPData() {
        try {
            const nlpData = await tetrashopAPI.getNLPData();
            
            // Update NLP categories
            const categoriesContainer = document.getElementById('nlp-categories');
            categoriesContainer.innerHTML = '';
            
            nlpData.categories?.forEach(category => {
                const categoryCard = this.createCategoryCard(category);
                categoriesContainer.appendChild(categoryCard);
            });
            
        } catch (error) {
            console.error('خطا در بارگذاری داده‌های NLP:', error);
        }
    }

    createCategoryCard(category) {
        const div = document.createElement('div');
        div.className = 'category-card';
        div.innerHTML = `
            <div class="category-header">
                <div class="category-icon">
                    <i class="fas fa-folder"></i>
                </div>
                <div class="category-name">${category.name}</div>
                <span class="category-count">${category.count} الگوریتم</span>
            </div>
            <div class="category-algorithms">
                ${category.algorithms?.map(algo => 
                    `<span class="algorithm-tag" onclick="tetrashopUI.viewAlgorithm('nlp', '${algo}')">${algo}</span>`
                ).join('')}
            </div>
        `;
        return div;
    }

    async loadQuantumData() {
        try {
            const quantumData = await tetrashopAPI.getQuantumData();
            
            // Update features
            const featuresContainer = document.getElementById('quantum-features');
            featuresContainer.innerHTML = '';
            
            quantumData.features?.forEach(feature => {
                const featureCard = this.createFeatureCard(feature, 'quantum');
                featuresContainer.appendChild(featureCard);
            });
            
            // Update algorithms
            const algorithmsContainer = document.getElementById('quantum-algorithms');
            algorithmsContainer.innerHTML = '';
            
            quantumData.algorithms?.forEach(algo => {
                const algorithmCard = this.createAlgorithmCard(algo, 'quantum');
                algorithmsContainer.appendChild(algorithmCard);
            });
            
        } catch (error) {
            console.error('خطا در بارگذاری داده‌های Quantum Writer:', error);
        }
    }

    async loadSecretData() {
        try {
            const secretData = await tetrashopAPI.getSecretData();
            
            // Update security levels
            const levelsContainer = document.getElementById('security-levels');
            levelsContainer.innerHTML = '';
            
            secretData.levels?.forEach(level => {
                const levelCard = this.createLevelCard(level);
                levelsContainer.appendChild(levelCard);
            });
            
            // Update algorithms
            const algorithmsContainer = document.getElementById('secret-algorithms');
            algorithmsContainer.innerHTML = '';
            
            secretData.algorithms?.forEach(algo => {
                const algorithmCard = this.createAlgorithmCard(algo, 'secret');
                algorithmsContainer.appendChild(algorithmCard);
            });
            
        } catch (error) {
            console.error('خطا در بارگذاری داده‌های Secret Garden:', error);
        }
    }

    async loadSpeechData() {
        try {
            const speechData = await tetrashopAPI.getSpeechData();
            
            // Update features
            const featuresContainer = document.getElementById('speech-features');
            featuresContainer.innerHTML = '';
            
            speechData.features?.forEach(feature => {
                const featureCard = this.createFeatureCard(feature, 'speech');
                featuresContainer.appendChild(featureCard);
            });
            
            // Update algorithms
            const algorithmsContainer = document.getElementById('speech-algorithms');
            algorithmsContainer.innerHTML = '';
            
            speechData.algorithms?.forEach(algo => {
                const algorithmCard = this.createAlgorithmCard(algo, 'speech');
                algorithmsContainer.appendChild(algorithmCard);
            });
            
        } catch (error) {
            console.error('خطا در بارگذاری داده‌های Speech Recognition:', error);
        }
    }

    createFeatureCard(feature, type) {
        const div = document.createElement('div');
        div.className = 'feature-card';
        div.innerHTML = `
            <div class="feature-icon">
                <i class="${feature.icon}"></i>
            </div>
            <div class="feature-title">${feature.title}</div>
            <div class="feature-desc">${feature.description}</div>
            ${feature.code ? `
                <button class="btn-link" onclick="tetrashopUI.viewCode('${type}', '${feature.title}')" 
                        style="margin-top: 10px; font-size: 0.9rem;">
                    <i class="fas fa-code"></i> مشاهده کد
                </button>
            ` : ''}
        `;
        return div;
    }

    createAlgorithmCard(algorithm, category) {
        const div = document.createElement('div');
        div.className = 'algorithm-card';
        div.innerHTML = `
            <div class="algorithm-icon">
                <i class="fas fa-code"></i>
            </div>
            <div class="algorithm-title">${algorithm.name}</div>
            <div class="algorithm-desc">${algorithm.description}</div>
            <div class="algorithm-actions" style="margin-top: 15px; display: flex; gap: 10px;">
                <button class="table-action-btn view" onclick="tetrashopUI.viewAlgorithm('${category}', '${algorithm.name}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="table-action-btn copy" onclick="tetrashopUI.copyAlgorithm('${category}', '${algorithm.name}')">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="table-action-btn export" onclick="tetrashopUI.exportAlgorithm('${category}', '${algorithm.name}')">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        `;
        return div;
    }

    createLevelCard(level) {
        const div = document.createElement('div');
        div.className = 'level-card';
        div.innerHTML = `
            <div class="level-icon">
                <i class="fas fa-shield-alt"></i>
            </div>
            <div class="level-title">${level.name}</div>
            <div class="level-desc">${level.description}</div>
            <div class="level-info" style="margin-top: 10px; font-size: 0.85rem; color: var(--gray);">
                <i class="fas fa-lock"></i> ${level.protection}
            </div>
        `;
        return div;
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-menu li[data-section]');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all items
                navItems.forEach(navItem => navItem.classList.remove('active'));
                
                // Add active class to clicked item
                item.classList.add('active');
                
                // Switch to section
                const sectionId = item.dataset.section;
                this.switchToSection(sectionId);
            });
        });
    }

    switchToSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
            
            // Update breadcrumb
            this.updateBreadcrumb(sectionId);
            
            // Special handling for sections
            if (sectionId === 'all-algorithms') {
                this.loadAllAlgorithmsTable();
            } else if (sectionId === 'nlp-overview') {
                // Ensure NLP count is 219
                document.querySelectorAll('#nlp-count').forEach(el => {
                    el.textContent = '219';
                });
            }
        }
    }

    updateBreadcrumb(sectionId) {
        const breadcrumbSection = document.getElementById('current-section');
        const breadcrumbSubsection = document.getElementById('current-subsection');
        
        if (breadcrumbSection && breadcrumbSubsection) {
            breadcrumbSection.textContent = this.sectionTitles[sectionId] || sectionId;
            
            // Set appropriate subsection
            const subsections = {
                'dashboard': 'آمار کلی',
                'nlp-overview': 'مرور کامل',
                'quantum-writer': 'الگوریتم‌های کوانتومی',
                'secret-garden': 'سیستم امنیتی',
                'speech-recognition': 'تشخیص گفتار',
                'code-output': 'خروجی کدها',
                'all-algorithms': 'مدیریت الگوریتم‌ها'
            };
            
            breadcrumbSubsection.textContent = subsections[sectionId] || 'صفحه اصلی';
        }
    }

    setupGlobalSearch() {
        const searchInput = document.getElementById('global-search');
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            if (query.length >= 2) {
                this.performGlobalSearch(query);
            } else {
                this.clearSearchResults();
            }
        });
    }

    async performGlobalSearch(query) {
        try {
            const results = await tetrashopAPI.globalSearch(query);
            
            // Show search results (simplified for now)
            if (results.length > 0) {
                this.showNotification(`🔍 ${results.length} نتیجه برای "${query}" یافت شد`, 'info');
            } else {
                this.showNotification(`🔍 هیچ نتیجه‌ای برای "${query}" یافت نشد`, 'warning');
            }
            
        } catch (error) {
            console.error('خطا در جستجو:', error);
        }
    }

    clearSearchResults() {
        // Clear search highlights
        document.querySelectorAll('.search-highlight').forEach(el => {
            el.classList.remove('search-highlight');
        });
    }

    setupSectionSwitching() {
        // Handle export option clicks
        document.querySelectorAll('.export-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('onclick');
                if (action) {
                    // Switch to code output section
                    this.switchToSection('code-output');
                }
            });
        });
    }

    setupRealTimeUpdates() {
        // Update CPU and memory usage
        setInterval(() => {
            this.updateSystemStats();
        }, 5000);
        
        // Refresh data every 30 seconds
        setInterval(() => {
            this.refreshData();
        }, 30000);
    }

    updateSystemStats() {
        // Simulate system stats
        const cpuUsage = Math.floor(Math.random() * 30) + 5;
        const memoryUsage = Math.floor(Math.random() * 30) + 50;
        
        document.getElementById('cpu-usage').textContent = `${cpuUsage}%`;
        document.getElementById('memory-usage').textContent = `${memoryUsage}%`;
    }

    loadActivityLog() {
        const activityList = document.getElementById('activity-list');
        if (!activityList) return;
        
        const activities = [
            {
                type: 'success',
                icon: 'fas fa-code',
                title: 'الگوریتم جدید اضافه شد',
                time: '۲ دقیقه پیش',
                desc: 'Quantum Writer v1.2.0'
            },
            {
                type: 'info',
                icon: 'fas fa-sync-alt',
                title: 'بروزرسانی داده‌ها',
                time: '۵ دقیقه پیش',
                desc: 'NLP الگوریتم‌ها بروزرسانی شدند'
            },
            {
                type: 'warning',
                icon: 'fas fa-shield-alt',
                title: 'افزایش امنیت',
                time: '۱۰ دقیقه پیش',
                desc: 'Secret Garden ارتقا یافت'
            },
            {
                type: 'success',
                icon: 'fas fa-microphone',
                title: 'آزمون موفق',
                time: '۱۵ دقیقه پیش',
                desc: 'تشخیص گفتار با دقت ۹۸%'
            },
            {
                type: 'info',
                icon: 'fas fa-file-export',
                title: 'خروجی تولید شد',
                time: '۲۰ دقیقه پیش',
                desc: 'تمامی الگوریتم‌ها export شدند'
            }
        ];
        
        activityList.innerHTML = '';
        
        activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = `activity-item activity-${activity.type}`;
            activityItem.innerHTML = `
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-desc">${activity.desc}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            `;
            activityList.appendChild(activityItem);
        });
    }

    loadAllAlgorithmsTable() {
        const tableBody = document.getElementById('all-algorithms-table');
        if (!tableBody || !this.algorithmData) return;
        
        tableBody.innerHTML = '';
        
        // Combine all algorithms
        const allAlgorithms = [];
        Object.entries(this.algorithmData).forEach(([category, algorithms]) => {
            algorithms?.forEach(algo => {
                allAlgorithms.push({
                    ...algo,
                    category: category
                });
            });
        });
        
        // Sort algorithms
        const sortBy = document.getElementById('sort-by')?.value || 'name';
        allAlgorithms.sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'size') return b.size - a.size;
            if (sortBy === 'date') return new Date(b.modified) - new Date(a.modified);
            return 0;
        });
        
        // Populate table
        allAlgorithms.forEach(algo => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <input type="checkbox" class="algorithm-checkbox" 
                           data-id="${algo.category}/${algo.name}">
                </td>
                <td>${algo.name}</td>
                <td>
                    <span class="badge ${algo.category}">
                        ${this.getCategoryName(algo.category)}
                    </span>
                </td>
                <td>${algo.language || '---'}</td>
                <td>${this.formatSize(algo.size)}</td>
                <td>${new Date(algo.modified || Date.now()).toLocaleDateString('fa-IR')}</td>
                <td>
                    <div class="table-actions">
                        <button class="table-action-btn view" 
                                onclick="tetrashopUI.viewAlgorithm('${algo.category}', '${algo.name}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="table-action-btn copy" 
                                onclick="tetrashopUI.copyAlgorithm('${algo.category}', '${algo.name}')">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="table-action-btn export" 
                                onclick="tetrashopUI.exportAlgorithm('${algo.category}', '${algo.name}')">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Setup checkbox handling
        this.setupTableCheckboxes();
    }

    setupTableCheckboxes() {
        const selectAll = document.getElementById('select-all');
        const checkboxes = document.querySelectorAll('.algorithm-checkbox');
        
        if (selectAll) {
            selectAll.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                checkboxes.forEach(checkbox => {
                    checkbox.checked = isChecked;
                    this.handleAlgorithmSelection(checkbox);
                });
            });
        }
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleAlgorithmSelection(e.target);
            });
        });
    }

    handleAlgorithmSelection(checkbox) {
        const algorithmId = checkbox.dataset.id;
        
        if (checkbox.checked) {
            this.selectedAlgorithms.add(algorithmId);
        } else {
            this.selectedAlgorithms.delete(algorithmId);
        }
        
        // Update select all checkbox
        const allCheckboxes = document.querySelectorAll('.algorithm-checkbox');
        const selectAll = document.getElementById('select-all');
        
        if (selectAll) {
            const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
            const someChecked = Array.from(allCheckboxes).some(cb => cb.checked);
            
            selectAll.checked = allChecked;
            selectAll.indeterminate = someChecked && !allChecked;
        }
    }

    // Action Methods
    async viewAlgorithm(category, algorithmName) {
        try {
            const code = await tetrashopAPI.getAlgorithmCode(category, algorithmName);
            this.showCodeOutput(code, algorithmName, category);
            this.switchToSection('code-output');
        } catch (error) {
            console.error('خطا در مشاهده الگوریتم:', error);
            this.showNotification('❌ خطا در بارگذاری الگوریتم', 'error');
        }
    }

    async copyAlgorithm(category, algorithmName) {
        try {
            const code = await tetrashopAPI.getAlgorithmCode(category, algorithmName);
            const codeBlock = `# ${algorithmName}\n# دسته‌بندی: ${this.getCategoryName(category)}\n# تاریخ: ${new Date().toLocaleDateString('fa-IR')}\n\n${code}`;
            
            await navigator.clipboard.writeText(codeBlock);
            this.showNotification(`✅ "${algorithmName}" کپی شد`, 'success');
        } catch (error) {
            console.error('خطا در کپی الگوریتم:', error);
            this.showNotification('❌ خطا در کپی کردن', 'error');
        }
    }

    async exportAlgorithm(category, algorithmName) {
        this.selectedAlgorithms.add(`${category}/${algorithmName}`);
        this.showNotification(`✅ "${algorithmName}" برای خروجی انتخاب شد`, 'info');
    }

    showCodeOutput(code, title = '', category = '') {
        const codeContent = document.getElementById('code-content');
        const outputSize = document.getElementById('output-size');
        
        const header = `# ${title}\n# دسته‌بندی: ${this.getCategoryName(category)}\n# تاریخ تولید: ${new Date().toLocaleDateString('fa-IR')}\n# زمان: ${new Date().toLocaleTimeString('fa-IR')}\n\n`;
        
        const fullCode = header + code;
        codeContent.textContent = fullCode;
        
        // Calculate size
        const sizeInKB = (new Blob([fullCode]).size / 1024).toFixed(2);
        outputSize.textContent = `${sizeInKB} کیلوبایت`;
        
        // Apply syntax highlighting
        this.highlightSyntax();
    }

    highlightSyntax() {
        const codeElement = document.getElementById('code-content');
        let code = codeElement.textContent;
        
        // Simple syntax highlighting
        const patterns = [
            { regex: /(#.*$)/gm, className: 'comment' },
            { regex: /(["'`])(.*?)\1/g, className: 'string' },
            { regex: /\b(function|const|let|var|if|else|for|while|return|class|export|import|async|await|def|import|from|as|try|except|with|int|float|double|char|void|public|private|include)\b/g, className: 'keyword' },
            { regex: /\b(true|false|null|undefined|this|self)\b/g, className: 'constant' },
            { regex: /\b(\d+)\b/g, className: 'number' }
        ];
        
        patterns.forEach(pattern => {
            code = code.replace(pattern.regex, `<span class="${pattern.className}">$1</span>`);
        });
        
        codeElement.innerHTML = code;
    }

    // Export Methods
    async exportSection(section) {
        try {
            let algorithms = [];
            
            switch(section) {
                case 'nlp':
                    algorithms = await tetrashopAPI.getNLPAlgorithms();
                    break;
                case 'quantum':
                    algorithms = await tetrashopAPI.getQuantumAlgorithms();
                    break;
                case 'secret':
                    algorithms = await tetrashopAPI.getSecretAlgorithms();
                    break;
                case 'speech':
                    algorithms = await tetrashopAPI.getSpeechAlgorithms();
                    break;
            }
            
            if (algorithms.length === 0) {
                this.showNotification(`⚠️ هیچ الگوریتمی در بخش ${section} یافت نشد`, 'warning');
                return;
            }
            
            // Generate cat output
            const catOutput = tetrashopAPI.generateCatOutput(algorithms, section);
            this.showCodeOutput(catOutput, `خروجی ${this.getCategoryName(section)}`, section);
            this.switchToSection('code-output');
            
            this.showNotification(`✅ خروجی ${algorithms.length} الگوریتم ${this.getCategoryName(section)} آماده شد`, 'success');
            
        } catch (error) {
            console.error('خطا در تولید خروجی:', error);
            this.showNotification('❌ خطا در تولید خروجی', 'error');
        }
    }

    async exportEverything() {
        try {
            const allAlgorithms = [];
            
            // Get algorithms from all sections
            const sections = ['nlp', 'quantum', 'secret', 'speech'];
            
            for (const section of sections) {
                let algorithms = [];
                switch(section) {
                    case 'nlp':
                        algorithms = await tetrashopAPI.getNLPAlgorithms();
                        break;
                    case 'quantum':
                        algorithms = await tetrashopAPI.getQuantumAlgorithms();
                        break;
                    case 'secret':
                        algorithms = await tetrashopAPI.getSecretAlgorithms();
                        break;
                    case 'speech':
                        algorithms = await tetrashopAPI.getSpeechAlgorithms();
                        break;
                }
                
                algorithms.forEach(algo => {
                    allAlgorithms.push({
                        ...algo,
                        category: section
                    });
                });
            }
            
            if (allAlgorithms.length === 0) {
                this.showNotification('⚠️ هیچ الگوریتمی یافت نشد', 'warning');
                return;
            }
            
            // Generate comprehensive cat output
            const catOutput = this.generateComprehensiveCatOutput(allAlgorithms);
            this.showCodeOutput(catOutput, 'خروجی کامل تتراشاپ', 'all');
            this.switchToSection('code-output');
            
            this.showNotification(`✅ خروجی کامل ${allAlgorithms.length} الگوریتم آماده شد`, 'success');
            
        } catch (error) {
            console.error('خطا در تولید خروجی کامل:', error);
            this.showNotification('❌ خطا در تولید خروجی کامل', 'error');
        }
    }

    generateComprehensiveCatOutput(algorithms) {
        let output = `# 🚀 خروجی کامل الگوریتم‌های تتراشاپ\n`;
        output += `# ⏰ تاریخ تولید: ${new Date().toLocaleString('fa-IR')}\n`;
        output += `# 📊 تعداد الگوریتم‌ها: ${algorithms.length}\n`;
        output += `# 📁 شامل: NLP (219), Quantum Writer, Secret Garden, Speech Recognition\n\n`;
        
        output += `echo "شروع کپی الگوریتم‌های تتراشاپ..."\n`;
        output += `mkdir -p tetrashop-algorithms\n`;
        output += `cd tetrashop-algorithms\n\n`;
        
        // Group by category
        const grouped = {};
        algorithms.forEach(algo => {
            if (!grouped[algo.category]) {
                grouped[algo.category] = [];
            }
            grouped[algo.category].push(algo);
        });
        
        // Generate cat commands for each category
        Object.entries(grouped).forEach(([category, catAlgorithms]) => {
            output += `# =======================================\n`;
            output += `# 📂 ${this.getCategoryName(category).toUpperCase()}\n`;
            output += `# =======================================\n`;
            output += `mkdir -p ${category}\n`;
            output += `cd ${category}\n\n`;
            
            catAlgorithms.forEach((algo, index) => {
                output += `# ${index + 1}. ${algo.name}\n`;
                output += `cat > "${algo.name}" << 'EOF'\n`;
                output += `${algo.code || '// کد الگوریتم'}\n`;
                output += `EOF\n`;
                output += `echo "✅ ${algo.name} کپی شد"\n\n`;
            });
            
            output += `cd ..\n\n`;
        });
        
        output += `# 🎉 اتمام کار\n`;
        output += `echo "✅ تمام الگوریتم‌ها با موفقیت کپی شدند"\n`;
        output += `echo "📁 ساختار ایجاد شده:"\n`;
        output += `ls -la\n`;
        output += `echo "\nبرای اجرا دستورات مربوطه را اجرا کنید."\n`;
        
        return output;
    }

    async copyAllCode() {
        const codeContent = document.getElementById('code-content').textContent;
        
        try {
            await navigator.clipboard.writeText(codeContent);
            this.showNotification('✅ تمام کدها کپی شدند', 'success');
        } catch (error) {
            console.error('خطا در کپی:', error);
            this.showNotification('❌ خطا در کپی کردن کدها', 'error');
        }
    }

    async downloadCode() {
        const codeContent = document.getElementById('code-content').textContent;
        const format = document.getElementById('output-format').value;
        
        let content = codeContent;
        let filename = `tetrashop-export-${new Date().toISOString().split('T')[0]}`;
        let mimeType = 'text/plain';
        
        switch(format) {
            case 'json':
                content = JSON.stringify({ code: codeContent }, null, 2);
                filename += '.json';
                mimeType = 'application/json';
                break;
            case 'markdown':
                content = `# تتراشاپ Export\n\`\`\`\n${codeContent}\n\`\`\``;
                filename += '.md';
                break;
            default:
                filename += '.sh';
        }
        
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification(`✅ فایل ${filename} دانلود شد`, 'success');
    }

    clearOutput() {
        document.getElementById('code-content').textContent = 
            '// خروجی کدها در این قسمت نمایش داده می‌شود\n// برای کپی از دکمه‌های بالا استفاده کنید';
        
        document.getElementById('output-size').textContent = '0 کیلوبایت';
        this.showNotification('✅ خروجی پاک شد', 'info');
    }

    // Helper Methods
    getCategoryName(category) {
        const names = {
            'nlp': 'پردازش زبان طبیعی',
            'quantum': 'Quantum Writer',
            'secret': 'Secret Garden',
            'speech': 'Speech Recognition',
            'js': 'JavaScript',
            'python': 'Python',
            'cpp': 'C++',
            'docs': 'مستندات'
        };
        return names[category] || category;
    }

    formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-30px)';
            setTimeout(() => {
                container.removeChild(notification);
            }, 300);
        }, 5000);
    }

    refreshData() {
        this.loadAllData();
        this.showNotification('🔄 داده‌ها بروزرسانی شدند', 'info');
    }

    refreshAll() {
        this.refreshData();
        location.reload();
    }

    quickExport() {
        this.exportEverything();
    }

    showSettings() {
        this.showNotification('⚙️ بخش تنظیمات به زودی اضافه خواهد شد', 'info');
    }
}

// Initialize UI
document.addEventListener('DOMContentLoaded', () => {
    window.tetrashopUI = new TetrashopAdvancedUI();
});

// Global functions
window.refreshAll = () => window.tetrashopUI?.refreshAll();
window.quickExport = () => window.tetrashopUI?.quickExport();
window.exportEverything = () => window.tetrashopUI?.exportEverything();
window.exportSection = (section) => window.tetrashopUI?.exportSection(section);
window.copyAllCode = () => window.tetrashopUI?.copyAllCode();
window.downloadCode = () => window.tetrashopUI?.downloadCode();
window.clearOutput = () => window.tetrashopUI?.clearOutput();
window.showSettings = () => window.tetrashopUI?.showSettings();
window.loadActivityLog = () => window.tetrashopUI?.loadActivityLog();
