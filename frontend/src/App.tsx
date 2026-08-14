import { useState } from 'react';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';

function App() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white/70 backdrop-blur rounded-2xl p-10 shadow-lg w-full max-w-sm">
        <h1 className="font-display text-2xl font-black text-sky-deep mb-6">
          Travel Planner
        </h1>

        <div className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            error="Password must be at least 8 characters"
          />

          <p className="text-xs text-ink-light">You typed: {email}</p>

          <Button>Sign in</Button>
        </div>
      </div>
    </div>
  );
}

export default App;