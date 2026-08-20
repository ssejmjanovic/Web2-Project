import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import { formatDate } from '../utils/format';
import { getErrorMessage } from '../utils/getErrorMessage';

export function Profile() {
    const {user, updateCurrentUser} = useAuth();

    const [profileForm, setProfileForm] = useState({
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? ''
    });
    const [profileError, setProfileError] = useState<string | null>(null);
    const [profileMessage, setProfileMessage] = useState<string | null>(null);
    const [savingProfile, setSavingProfile] = useState(false);

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
    const [savingPassword, setSavingPassword] = useState(false);

    const handleProfileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setProfileForm((previous) => ({...previous, [name]: value}));
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setPasswordForm((previous) => ({...previous, [name]: value}));
    };

    const handleProfileSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setProfileError(null);
        setProfileMessage(null);
        setSavingProfile(true);

        try {
            const updated = await userService.updateProfile(profileForm);
            updateCurrentUser(updated);
            setProfileMessage('Profile updated.');
        } catch (err) {
            setProfileError(getErrorMessage(err));
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setPasswordError(null);
        setPasswordMessage(null);

        if (passwordForm.newPassword.length < 8) {
            setPasswordError('New password must be at least 8 characters.');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }

        setSavingPassword(true);

        try {
            await userService.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });

            setPasswordForm({currentPassword: '', newPassword: '', confirmPassword: ''});
            setPasswordMessage('Password changed.');
        } catch (err) {
            setPasswordError(getErrorMessage(err));
        } finally {
            setSavingPassword(false);
        }
    };

    return (
    <div className="max-w-xl flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-black text-sky-deep">Your profile</h1>
        <p className="text-sm text-ink-light">
          {user?.email} · {user?.role}
          {user && ` · joined ${formatDate(user.createdAt)}`}
        </p>
      </div>

      <form onSubmit={handleProfileSubmit} className="glass-card p-6 flex flex-col gap-4">
        <h2 className="font-display font-black text-sky-deep">Details</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="First name"
            name="firstName"
            required
            maxLength={100}
            value={profileForm.firstName}
            onChange={handleProfileChange}
          />
          <Input
            label="Last name"
            name="lastName"
            required
            maxLength={100}
            value={profileForm.lastName}
            onChange={handleProfileChange}
          />
        </div>

        {profileError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {profileError}
          </p>
        )}

        {profileMessage && (
          <p className="text-sm text-grass-deep bg-grass-light border border-grass/40 rounded-lg px-3 py-2">
            {profileMessage}
          </p>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={savingProfile}>
            {savingProfile ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </form>

      <form onSubmit={handlePasswordSubmit} className="glass-card p-6 flex flex-col gap-4">
        <h2 className="font-display font-black text-sky-deep">Change password</h2>

        <Input
          label="Current password"
          name="currentPassword"
          type="password"
          required
          value={passwordForm.currentPassword}
          onChange={handlePasswordChange}
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="New password"
            name="newPassword"
            type="password"
            required
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
          />
          <Input
            label="Confirm new password"
            name="confirmPassword"
            type="password"
            required
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
          />
        </div>

        {passwordError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {passwordError}
          </p>
        )}

        {passwordMessage && (
          <p className="text-sm text-grass-deep bg-grass-light border border-grass/40 rounded-lg px-3 py-2">
            {passwordMessage}
          </p>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={savingPassword}>
            {savingPassword ? 'Saving...' : 'Change password'}
          </Button>
        </div>
      </form>
    </div>
  );
}