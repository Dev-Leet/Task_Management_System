document.addEventListener('DOMContentLoaded', async () => {
    ui.checkAuth();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (user.role !== 'admin' && user.role !== 'manager') {
        window.location.href = 'dashboard.html';
        return;
    }

    const modal = document.getElementById('employee-modal');
    const openBtn = document.getElementById('open-employee-modal');
    const closeBtn = document.getElementById('close-employee-modal');
    const form = document.getElementById('employee-form');
    const tbody = document.getElementById('employee-list');

    if (user.role !== 'admin') {
        openBtn.style.display = 'none'; // Only admin can add
    }

    // Modal behavior
    openBtn.addEventListener('click', () => { modal.classList.add('active'); });
    closeBtn.addEventListener('click', () => { modal.classList.remove('active'); form.reset(); });

    // Load employees
    async function loadEmployees() {
        try {
            const employees = await api.get('/employees');
            tbody.innerHTML = '';
            employees.forEach(emp => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${emp.employee_id}</td>
                    <td>${emp.full_name}</td>
                    <td>${emp.department || '-'}</td>
                    <td>${emp.designation || '-'}</td>
                    <td><span class="badge ${emp.is_active ? 'success' : 'danger'}">${emp.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                        ${user.role === 'admin' && emp.is_active ? `<button class="btn-secondary deactivate-btn" data-id="${emp.employee_id}" style="padding: 4px 8px; font-size:12px;">Deactivate</button>` : '-'}
                    </td>
                `;
                tbody.appendChild(tr);
            });

            // Bind deactivate events
            document.querySelectorAll('.deactivate-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    if (confirm('Are you sure you want to deactivate this employee?')) {
                        const id = e.target.getAttribute('data-id');
                        try {
                            await api.delete(`/employees/${id}`);
                            ui.showToast('Employee deactivated');
                            loadEmployees();
                        } catch(err) {}
                    }
                });
            });
        } catch (error) {}
    }

    // Save employee
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const empData = {
            full_name: document.getElementById('emp-name').value,
            username: document.getElementById('emp-username').value,
            email: document.getElementById('emp-email').value,
            password: document.getElementById('emp-password').value,
            department: document.getElementById('emp-dept').value || null,
            designation: document.getElementById('emp-desig').value || null
        };
        try {
            await api.post('/employees', empData);
            ui.showToast('Employee created successfully');
            modal.classList.remove('active');
            form.reset();
            loadEmployees();
        } catch (err) {}
    });

    loadEmployees();
});
