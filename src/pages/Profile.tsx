import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { User, Mail, Calendar, Edit, Key, Bell, LogOut, Shield, Save, X, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export const Profile = () => {
  const { user, signOut } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [newName, setNewName] = useState(user?.user_metadata?.name || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Email Preferences State
  const [emailPrefs, setEmailPrefs] = useState({
    reminderEmails: true,
    marketingEmails: false,
    noteSummaries: true,
    weeklyDigest: false
  });

  // Load email preferences from localStorage on mount
  useEffect(() => {
    const savedPrefs = localStorage.getItem('emailPreferences');
    if (savedPrefs) {
      setEmailPrefs(JSON.parse(savedPrefs));
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // ✅ Update Profile Name
  const handleUpdateName = async () => {
    if (!newName.trim()) {
      setError('Name cannot be empty');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: newName }
      });

      if (error) throw error;
      
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        setShowEditModal(false);
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Change Password
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      setSuccess('Password changed successfully!');
      setTimeout(() => {
        setShowPasswordModal(false);
        setNewPassword('');
        setConfirmPassword('');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Change Email
  const handleChangeEmail = async () => {
    if (!newEmail) {
      setError('Email cannot be empty');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) throw error;
      
      setSuccess('Verification email sent to your new address! Please check your inbox.');
      setTimeout(() => {
        setShowEmailModal(false);
        setNewEmail('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to change email');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save Email Preferences
  const handleSavePreferences = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Save to localStorage
      localStorage.setItem('emailPreferences', JSON.stringify(emailPrefs));
      
      // Here you can also save to your backend if you have a settings endpoint
      // await API.post('/settings/email-preferences', emailPrefs);
      
      setSuccess('Email preferences saved successfully!');
      setTimeout(() => {
        setShowPreferencesModal(false);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Resend Verification Email
  const handleResendVerification = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user?.email || ''
      });

      if (error) throw error;
      
      setSuccess('Verification email sent! Please check your inbox.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout
  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await signOut();
      window.location.href = '/login';
    }
  };

  // ✅ Delete Account
  const handleDeleteAccount = async () => {
    if (confirm('⚠️ WARNING: This will permanently delete your account and ALL your notes. This cannot be undone! Are you absolutely sure?')) {
      const confirmDelete = prompt('Type "DELETE" to confirm account deletion:');
      if (confirmDelete === 'DELETE') {
        setLoading(true);
        try {
          // First delete all user notes from your backend
          const session = await supabase.auth.getSession();
          const token = session.data.session?.access_token;
          
          const response = await fetch('http://localhost:5000/api/notes', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const notes = await response.json();
          
          // Delete each note
          for (const note of notes) {
            await fetch(`http://localhost:5000/api/notes/${note._id}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
          }
          
          // Delete user from Supabase
          const { error } = await supabase.auth.admin.deleteUser(user?.id || '');
          if (error) throw error;
          
          alert('Account deleted successfully!');
          await signOut();
          window.location.href = '/register';
        } catch (err: any) {
          setError(err.message || 'Failed to delete account. Please contact support.');
        } finally {
          setLoading(false);
        }
      } else {
        setError('Account deletion cancelled');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
              <p className="text-gray-400">Manage your account information</p>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div className="mb-4 p-3 bg-green-600/20 border border-green-500 rounded-lg text-green-400">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-600/20 border border-red-500 rounded-lg text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Profile Info Card */}
              <div className="backdrop-blur-xl bg-white/5 rounded-xl p-8 border border-white/10">
                <div className="flex items-center space-x-6 mb-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                    {user?.user_metadata?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {user?.user_metadata?.name || 'User'}
                    </h2>
                    <p className="text-gray-400">{user?.email}</p>
                    {user?.email_confirmed_at ? (
                      <p className="text-green-400 text-sm mt-1 flex items-center gap-1">
                        <Check className="w-4 h-4" /> Email verified
                      </p>
                    ) : (
                      <button 
                        onClick={handleResendVerification}
                        className="text-yellow-400 text-sm mt-1 hover:text-yellow-300"
                      >
                        ⚠ Email not verified - Click to resend
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="w-6 h-6 text-blue-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Full Name</p>
                        <p className="text-white font-medium">
                          {user?.user_metadata?.name || 'Not set'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-6 h-6 text-blue-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Email Address</p>
                        <p className="text-white font-medium">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowEmailModal(true)}
                      className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-colors"
                    >
                      Change
                    </button>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Member Since</p>
                      <p className="text-white font-medium">
                        {user?.created_at ? formatDate(user.created_at) : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Actions Card */}
              <div className="backdrop-blur-xl bg-white/5 rounded-xl p-8 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Account Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowEditModal(true)}
                    className="w-full px-6 py-3 bg-white/5 text-white rounded-lg font-medium hover:bg-white/10 transition-all flex items-center gap-3"
                  >
                    <Edit className="w-5 h-5 text-blue-400" />
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full px-6 py-3 bg-white/5 text-white rounded-lg font-medium hover:bg-white/10 transition-all flex items-center gap-3"
                  >
                    <Key className="w-5 h-5 text-yellow-400" />
                    Change Password
                  </button>
                  <button 
                    onClick={() => setShowPreferencesModal(true)}
                    className="w-full px-6 py-3 bg-white/5 text-white rounded-lg font-medium hover:bg-white/10 transition-all flex items-center gap-3"
                  >
                    <Bell className="w-5 h-5 text-purple-400" />
                    Email Preferences
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full px-6 py-3 bg-red-500/10 text-red-400 rounded-lg font-medium hover:bg-red-500/20 transition-all flex items-center gap-3 border border-red-500/20"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                  <button 
                    onClick={handleDeleteAccount}
                    className="w-full px-6 py-3 bg-red-600/20 text-red-400 rounded-lg font-medium hover:bg-red-600/30 transition-all flex items-center gap-3"
                  >
                    <Shield className="w-5 h-5" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Name Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 p-4 z-50">
          <div className="w-full max-w-md bg-[#1e293b] rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                placeholder="Enter your name"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleUpdateName}
                disabled={loading}
                className="flex-1 bg-blue-600 py-2 rounded text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-gray-600 py-2 rounded text-white hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 p-4 z-50">
          <div className="w-full max-w-md bg-[#1e293b] rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Change Password</h2>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="flex-1 bg-blue-600 py-2 rounded text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 bg-gray-600 py-2 rounded text-white hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 p-4 z-50">
          <div className="w-full max-w-md bg-[#1e293b] rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Change Email</h2>
              <button onClick={() => setShowEmailModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">New Email Address</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                placeholder="Enter new email"
              />
              <p className="text-gray-500 text-xs mt-2">
                A verification link will be sent to your new email address
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleChangeEmail}
                disabled={loading}
                className="flex-1 bg-blue-600 py-2 rounded text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Change Email'}
              </button>
              <button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 bg-gray-600 py-2 rounded text-white hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Preferences Modal */}
      {showPreferencesModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 p-4 z-50">
          <div className="w-full max-w-md bg-[#1e293b] rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Email Preferences</h2>
              <button onClick={() => setShowPreferencesModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Reminder Emails</p>
                  <p className="text-gray-400 text-sm">Receive email reminders for your notes</p>
                </div>
                <button
                  onClick={() => setEmailPrefs({...emailPrefs, reminderEmails: !emailPrefs.reminderEmails})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailPrefs.reminderEmails ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailPrefs.reminderEmails ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Note Summaries</p>
                  <p className="text-gray-400 text-sm">Get AI-generated summaries of your notes</p>
                </div>
                <button
                  onClick={() => setEmailPrefs({...emailPrefs, noteSummaries: !emailPrefs.noteSummaries})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailPrefs.noteSummaries ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailPrefs.noteSummaries ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Weekly Digest</p>
                  <p className="text-gray-400 text-sm">Weekly summary of your note activity</p>
                </div>
                <button
                  onClick={() => setEmailPrefs({...emailPrefs, weeklyDigest: !emailPrefs.weeklyDigest})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailPrefs.weeklyDigest ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailPrefs.weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Marketing Emails</p>
                  <p className="text-gray-400 text-sm">Updates, tips, and new features</p>
                </div>
                <button
                  onClick={() => setEmailPrefs({...emailPrefs, marketingEmails: !emailPrefs.marketingEmails})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailPrefs.marketingEmails ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailPrefs.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSavePreferences}
                disabled={loading}
                className="flex-1 bg-blue-600 py-2 rounded text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Preferences'}
              </button>
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="flex-1 bg-gray-600 py-2 rounded text-white hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};