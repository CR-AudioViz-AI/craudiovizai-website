export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-blue-600">CR AudioViz AI</a>
            <a href="/" className="text-gray-600 hover:text-blue-600">← Back to Home</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            1200+ Games
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Play games, earn credits, and have fun while building
          </p>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Game Categories</h2>
          
          {/* Strategy Games */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6">♟️ Strategy Games</h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              <GameCard name="Chess Master" players="2 players" credits={0} />
              <GameCard name="Tower Defense" players="1 player" credits={0} />
              <GameCard name="Risk Empire" players="2-6 players" credits={0} />
              <GameCard name="Civilization Builder" players="1-4 players" credits={0} />
            </div>
          </div>

          {/* Puzzle Games */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6">🧩 Puzzle Games</h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              <GameCard name="Match Three" players="1 player" credits={0} />
              <GameCard name="Word Search" players="1 player" credits={0} />
              <GameCard name="Sudoku Master" players="1 player" credits={0} />
              <GameCard name="Block Puzzle" players="1 player" credits={0} />
            </div>
          </div>

          {/* Action Games */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6">⚡ Action Games</h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              <GameCard name="Space Shooter" players="1 player" credits={0} />
              <GameCard name="Platform Runner" players="1 player" credits={0} />
              <GameCard name="Battle Arena" players="2-8 players" credits={0} />
              <GameCard name="Racing Championship" players="1-4 players" credits={0} />
            </div>
          </div>

          {/* Card Games */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6">🃏 Card Games</h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              <GameCard name="Poker Night" players="2-8 players" credits={0} />
              <GameCard name="Solitaire" players="1 player" credits={0} />
              <GameCard name="UNO Party" players="2-10 players" credits={0} />
              <GameCard name="Blackjack 21" players="1-6 players" credits={0} />
            </div>
          </div>

          {/* Earn Credits */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-12 text-center text-white">
            <h3 className="text-3xl font-bold mb-4">🎮 Play Games, Earn Credits!</h3>
            <p className="text-xl mb-6">
              Win tournaments and daily challenges to earn free credits
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-lg">
                <div className="text-2xl font-bold">Daily Bonus</div>
                <div className="text-sm">Login daily for 5 credits</div>
              </div>
              <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-lg">
                <div className="text-2xl font-bold">Win Tournaments</div>
                <div className="text-sm">Up to 100 credits</div>
              </div>
              <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-lg">
                <div className="text-2xl font-bold">Achievements</div>
                <div className="text-sm">Unlock rewards</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function GameCard({ name, players, credits }: { name: string; players: string; credits: number }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
      <div className="bg-gradient-to-br from-purple-400 to-pink-400 h-32 rounded-lg mb-4 flex items-center justify-center text-4xl">
        🎮
      </div>
      <h4 className="font-bold text-lg mb-2">{name}</h4>
      <p className="text-gray-600 text-sm mb-4">{players}</p>
      <div className="flex items-center justify-between">
        <span className="text-green-600 font-bold">Free to play</span>
        <button className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700">
          Play Now
        </button>
      </div>
    </div>
  )
}
