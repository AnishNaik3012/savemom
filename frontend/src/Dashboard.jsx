import React from 'react';

function Dashboard({ user, onOpenApp }) {

    // Define which apps are visible to which roles
    const getAppsForRole = (role) => {
        const apps = [];

        // Everyone sees Allogate (The Ecosystem App)
        apps.push({ id: 'allogate', name: 'Allogate', icon: '🌐', color: '#6c5ce7' });

        if (role === 'mother') {
            apps.push({ id: 'savemom', name: 'SaveMom', icon: '🤰', color: '#ff7675' });
            apps.push({ id: 'allobaby', name: 'Allobaby', icon: '👶', color: '#fab1a0' });
        } else if (role === 'doctor') {
            apps.push({ id: 'allodoc', name: 'Allodoc', icon: '👨‍⚕️', color: '#0984e3' });
        } else if (role === 'lab') {
            apps.push({ id: 'savemom', name: 'SaveMom (Lab View)', icon: '🧪', color: '#00cec9' });
        } else if (role === 'admin') {
            apps.push({ id: 'savemom', name: 'SaveMom', icon: '🤰', color: '#ff7675' });
            apps.push({ id: 'allobaby', name: 'Allobaby', icon: '👶', color: '#fab1a0' });
            apps.push({ id: 'allodoc', name: 'Allodoc', icon: '👨‍⚕️', color: '#0984e3' });
        }

        return apps;
    };

    const apps = getAppsForRole(user.role);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h3>Hello, {user.name}</h3>
                <span className="user-badge">{user.role}</span>
            </header>

            {/* 
            <div className="app-grid">
                {apps.map(app => (
                    <div
                        key={app.id}
                        className="app-card"
                        style={{ borderTop: `4px solid ${app.color}` }}
                        onClick={() => onOpenApp(app)}
                    >
                        <div className="app-icon" style={{ background: app.color }}>{app.icon}</div>
                        <h4>{app.name}</h4>
                    </div>
                ))}
            </div>
            */}

            <div className="dashboard-footer" style={{ marginTop: '20vh' }}>
                <h1 style={{ fontSize: '3rem', color: '#ccc' }}>Unified AI Ecosystem</h1>
                <p>Detailed apps are hidden as per request.</p>
                <p><strong>Click the glowing bot button below ↘️</strong></p>
            </div>
        </div>
    );
}

export default Dashboard;
