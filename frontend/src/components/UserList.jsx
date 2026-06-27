import { useEffect, useState } from 'react';
import api from '../api/axios';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                setUsers(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to fetch users. Is the backend running?");
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <div className="loading">Loading users...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="user-list-container">
            <h2 className="title">Users from Laravel API</h2>
            <div className="user-list">
                {users.length === 0 ? (
                    <p className="no-users">No users found.</p>
                ) : (
                    users.map(user => (
                        <div key={user.id} className="user-card">
                            <p className="user-name">{user.name}</p>
                            <p className="user-email">{user.email}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UserList;
