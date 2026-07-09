document.addEventListener('DOMContentLoaded', async () => {
    ui.checkAuth();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const taskGrid = document.getElementById('task-list');
    const modal = document.getElementById('task-modal');
    const openBtn = document.getElementById('open-task-modal');
    const closeBtn = document.getElementById('close-task-modal');
    const form = document.getElementById('task-form');
    const filterBtn = document.getElementById('apply-filters');
    const filterAssignee = document.getElementById('filter-assignee');
    const filterStatus = document.getElementById('filter-status');
    const assigneeSelect = document.getElementById('task-assignee');

    let employeesMap = {}; // id -> name

    // Load setup data if admin/manager
    if (user.role === 'admin' || user.role === 'manager') {
        openBtn.style.display = 'block';
        filterAssignee.style.display = 'inline-block';
        
        // Fetch employees for dropdowns
        try {
            const employees = await api.get('/employees');
            employees.forEach(emp => {
                employeesMap[emp.employee_id] = emp.full_name;
                
                const optFilter = document.createElement('option');
                optFilter.value = emp.employee_id;
                optFilter.textContent = emp.full_name;
                filterAssignee.appendChild(optFilter);

                const optForm = document.createElement('option');
                optForm.value = emp.employee_id;
                optForm.textContent = emp.full_name;
                assigneeSelect.appendChild(optForm);
            });
        } catch(err){}
    }

    // Modal
    if(openBtn) openBtn.addEventListener('click', () => { modal.classList.add('active'); });
    if(closeBtn) closeBtn.addEventListener('click', () => { modal.classList.remove('active'); form.reset(); });

    // Load tasks
    async function loadTasks() {
        try {
            let url = '/tasks?limit=100';
            const status = filterStatus.value;
            const assignee = filterAssignee.value;
            
            if (status) url += `&status=${status}`;
            if (assignee && user.role !== 'employee') url += `&assigned_to=${assignee}`;

            const tasks = await api.get(url);
            taskGrid.innerHTML = '';
            
            if (tasks.length === 0) {
                taskGrid.innerHTML = '<p>No tasks found.</p>';
                return;
            }

            tasks.forEach(task => {
                const card = document.createElement('div');
                card.className = 'task-card';
                
                const badgeClass = {
                    'Pending': 'pending',
                    'In Progress': 'warning',
                    'Completed': 'success',
                    'Overdue': 'danger'
                }[task.status] || 'pending';

                const assigneeName = employeesMap[task.assigned_to] || `ID: ${task.assigned_to}`;

                let statusActions = '';
                if (user.role === 'employee' || user.role === 'admin' || user.role === 'manager') {
                    // Everyone can update status
                    statusActions = `
                        <div style="margin-top:12px; display:flex; gap:8px;">
                            <select class="status-update-select" data-id="${task.task_id}" style="padding:4px; font-size:12px;">
                                <option value="Pending" ${task.status==='Pending'?'selected':''}>Pending</option>
                                <option value="In Progress" ${task.status==='In Progress'?'selected':''}>In Progress</option>
                                <option value="Completed" ${task.status==='Completed'?'selected':''}>Completed</option>
                            </select>
                            <button class="btn-secondary update-status-btn" data-id="${task.task_id}" style="padding:4px 8px; font-size:12px; width:auto;">Update</button>
                        </div>
                    `;
                }

                card.innerHTML = `
                    <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                        <span class="badge ${badgeClass}">${task.status}</span>
                        <span style="font-size:12px; font-weight:600; color:var(--text-secondary)">Priority: ${task.priority}</span>
                    </div>
                    <h4>${task.title}</h4>
                    <p>${task.description || 'No description'}</p>
                    <div style="font-size:12px; color:var(--text-secondary);">
                        <div>Assigned to: ${assigneeName}</div>
                        <div>Due: ${task.due_date || 'N/A'}</div>
                    </div>
                    ${statusActions}
                `;
                taskGrid.appendChild(card);
            });

            // Bind status update events
            document.querySelectorAll('.update-status-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.getAttribute('data-id');
                    const select = document.querySelector(`.status-update-select[data-id="${id}"]`);
                    const newStatus = select.value;
                    const isCompleted = newStatus === 'Completed';

                    try {
                        await api.patch(`/tasks/${id}/status`, { status: newStatus, completed: isCompleted });
                        ui.showToast('Status updated');
                        loadTasks();
                    } catch(err) {}
                });
            });

        } catch (error) {}
    }

    // Form submit
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                title: document.getElementById('task-title').value,
                description: document.getElementById('task-desc').value || null,
                assigned_to: parseInt(document.getElementById('task-assignee').value),
                priority: document.getElementById('task-priority').value,
                due_date: document.getElementById('task-due').value || null
            };
            try {
                await api.post('/tasks', data);
                ui.showToast('Task created successfully');
                modal.classList.remove('active');
                form.reset();
                loadTasks();
            } catch(err) {}
        });
    }

    if(filterBtn) {
        filterBtn.addEventListener('click', loadTasks);
    }

    // Initial load
    loadTasks();
});
