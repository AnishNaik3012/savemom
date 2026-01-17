import React, { useState } from 'react';

function Login({ onLogin }) {
    const [selectedRole, setSelectedRole] = useState('mother');
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username) {
            onLogin({ name: username, role: selectedRole });
        }
    };

    return (
        <div className="login-page">
            {/* Left Side - Visuals */}
            <div className="login-visuals">
                <div className="visual-content">
                    <h1>Unified<br />Healthcare<br />Ecosystem</h1>
                    <p>SaveMom • Allobaby • Allodoc • Allogate</p>
                    <div className="floating-shapes">
                        <div className="shape s1"></div>
                        <div className="shape s2"></div>
                        <div className="shape s3"></div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="login-form-container">
                <div className="login-card-modern">
                    <div className="form-header">
                        <h2>Welcome Back</h2>
                        <p>Please log in to access your dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                placeholder="e.g. Sarah"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Access Role</label>
                            <div className="role-grid">
                                <button
                                    type="button"
                                    className={`role-choice ${selectedRole === 'mother' ? 'active' : ''}`}
                                    onClick={() => setSelectedRole('mother')}
                                >
                                    🤰 Mother
                                </button>
                                <button
                                    type="button"
                                    className={`role-choice ${selectedRole === 'doctor' ? 'active' : ''}`}
                                    onClick={() => setSelectedRole('doctor')}
                                >
                                    👨‍⚕️ Doctor
                                </button>
                                <button
                                    type="button"
                                    className={`role-choice ${selectedRole === 'lab' ? 'active' : ''}`}
                                    onClick={() => setSelectedRole('lab')}
                                >
                                    🧪 Lab
                                </button>
                                <button
                                    type="button"
                                    className={`role-choice ${selectedRole === 'admin' ? 'active' : ''}`}
                                    onClick={() => setSelectedRole('admin')}
                                >
                                    🌐 Admin
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="login-btn-modern">Login to System</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
