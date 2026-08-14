import { Button } from './components/ui/Button';


function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white/70 backdrop-blur rounded-2xl p-10 text-center shadow-lg">
        <h1 className="font-display text-3xl font-black text-sky-deep mb-2">
          Travel Planner
        </h1>

        <div className="flex gap-3 justify-center">
          <Button onClick={() => alert('clicked')}>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>
    </div>
  );
}

export default App;
