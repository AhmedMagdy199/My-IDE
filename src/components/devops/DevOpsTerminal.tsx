import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Play, History, Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useCommandExecution, useDevOpsCommands, useCommandHistory } from '@/hooks/useDevOps';

export function DevOpsTerminal() {
  const [command, setCommand] = useState('');
  const [selectedCommand, setSelectedCommand] = useState('');
  const [args, setArgs] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const { commands, loading: commandsLoading } = useDevOpsCommands();
  const { executeCommand, executing, result, error } = useCommandExecution();
  const { history, refetch: refetchHistory } = useCommandHistory();

  const handleExecute = async () => {
    if (!command.trim()) return;

    const [cmd, ...cmdArgs] = command.trim().split(' ');
    try {
      await executeCommand(cmd, cmdArgs.length > 0 ? cmdArgs : args.split(' ').filter(Boolean));
      refetchHistory();
      
      // Scroll to bottom of terminal
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    } catch (err) {
      console.error('Command execution failed:', err);
    }
  };

  const handleQuickCommand = (cmdName: string) => {
    setCommand(cmdName);
    setSelectedCommand(cmdName);
    
    // Find command details for parameter hints
    const cmdDetails = commands.find(c => c.name === cmdName);
    if (cmdDetails?.example) {
      const exampleArgs = cmdDetails.example.split(' ').slice(1).join(' ');
      setArgs(exampleArgs);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleExecute();
    }
  };

  const commandsByCategory = commands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, typeof commands>);

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Command Input */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold">DevOps Command Terminal</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">Command</label>
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter DevOps command (e.g., sonar-scan, trivy-image, jenkins-jobs)"
                className="w-full bg-gray-700 rounded-md px-3 py-2 text-sm font-mono"
              />
            </div>
            
            {selectedCommand && (
              <div>
                <label className="block text-sm font-medium mb-2">Arguments</label>
                <input
                  type="text"
                  value={args}
                  onChange={(e) => setArgs(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Command arguments (space-separated)"
                  className="w-full bg-gray-700 rounded-md px-3 py-2 text-sm font-mono"
                />
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleExecute}
                loading={executing}
                disabled={!command.trim()}
              >
                <Play className="w-4 h-4 mr-2" />
                Execute
              </Button>
              
              <Button
                variant="secondary"
                onClick={() => setShowHistory(!showHistory)}
              >
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
              
              <Button variant="secondary" onClick={refetchHistory}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Commands */}
      <Card title="Quick Commands">
        <div className="space-y-4">
          {Object.entries(commandsByCategory).map(([category, cmds]) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-gray-400 mb-2">{category}</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {cmds.map((cmd) => (
                  <Button
                    key={cmd.name}
                    size="sm"
                    variant="secondary"
                    onClick={() => handleQuickCommand(cmd.name)}
                    className="text-left justify-start"
                    title={cmd.description}
                  >
                    {cmd.name}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Terminal Output */}
      <Card title="Output" className="flex-1">
        <div
          ref={terminalRef}
          className="bg-black rounded-lg p-4 font-mono text-sm text-green-400 h-64 overflow-y-auto"
        >
          {executing && (
            <div className="text-yellow-400">
              Executing: {command} {args}
              <span className="animate-pulse">...</span>
            </div>
          )}
          
          {error && (
            <div className="text-red-400 mb-2">
              Error: {error}
            </div>
          )}
          
          {result && (
            <div className="space-y-2">
              <div className="text-blue-400">
                $ {result.command}
              </div>
              
              {result.success ? (
                <div className="text-green-400">
                  ✓ {result.output}
                  {result.data && (
                    <pre className="mt-2 text-gray-300 text-xs overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  )}
                </div>
              ) : (
                <div className="text-red-400">
                  ✗ {result.error}
                </div>
              )}
              
              <div className="text-gray-500 text-xs">
                Completed in {result.duration} at {result.timestamp}
              </div>
            </div>
          )}
          
          {!executing && !result && !error && (
            <div className="text-gray-500">
              Ready to execute DevOps commands...
            </div>
          )}
        </div>
      </Card>

      {/* Command History */}
      {showHistory && (
        <Card title="Command History">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-gray-400 text-sm">No command history available</p>
            ) : (
              history.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-700 rounded text-sm"
                >
                  <div className="flex-1">
                    <span className="font-mono">{item.command}</span>
                    <span className={`ml-2 ${item.success ? 'text-green-400' : 'text-red-400'}`}>
                      {item.success ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
}