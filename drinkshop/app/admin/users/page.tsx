'use client';

import { useState, useCallback } from 'react';
import { User } from '@/types/user.types';
import UserTable from '@/components/admin/UserTable';
import UserForm from '@/components/admin/UserForm';
import { Button } from '@/components/ui/button';

export default function AdminUserPage() {
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [showForm, setShowForm] = useState(false);

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setShowForm(true);
    };

    const handleAddNew = () => {
        setEditingUser(null);
        setShowForm(true);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold">User Management</h1>
                <Button onClick={handleAddNew} className="bg-blue-500 hover:bg-blue-600">
                    Add New User
                </Button>
            </div>
            {showForm && (
                <UserForm
                    user={editingUser}
                    onSave={() => setShowForm(false)}
                />
            )}
            <UserTable onEdit={handleEdit} />
        </div>
    );
}

