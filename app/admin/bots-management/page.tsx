                <p className="text-slate-500 text-sm mt-2">Track CPU, memory, response time, and task completion over time</p>
              </div>

              <button
                onClick={() => {
                  setShowMetricsModal(false);
                  setSelectedBot(null);
                }}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Config Modal */}
        {showConfigModal && selectedBot && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-lg max-w-2xl w-full p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Settings className="w-6 h-6 text-purple-400" />
                  {selectedBot.name} Configuration
                </h2>
                <button
                  onClick={() => {
                    setShowConfigModal(false);
                    setSelectedBot(null);
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-slate-300 mb-2 text-sm font-medium">Max Concurrent Tasks</label>
                  <input
                    type="number"
                    defaultValue={10}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 text-sm font-medium">Response Timeout (ms)</label>
                  <input
                    type="number"
                    defaultValue={5000}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 text-sm font-medium">Memory Limit (MB)</label>
                  <input
                    type="number"
                    defaultValue={1024}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 text-sm font-medium">Auto-restart on failure</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="w-4 h-4 rounded bg-slate-900 border-slate-600 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-slate-400 text-sm">Automatically restart bot if it crashes</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 text-sm font-medium">Log Level</label>
                  <select className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="debug">Debug</option>
                    <option value="info" selected>Info</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
                <p className="text-slate-400 text-sm">
                  ⚠️ Configuration changes will take effect after restarting the bot
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    alert('Configuration saved! Restart bot to apply changes.');
                    setShowConfigModal(false);
                    setSelectedBot(null);
                  }}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Save Configuration
                </button>
                <button
                  onClick={() => {
                    setShowConfigModal(false);
                    setSelectedBot(null);
                  }}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
