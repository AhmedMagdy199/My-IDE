import { useState, useEffect } from 'react';
import { devopsService, DevOpsCommand, CommandResult, ToolStatus } from '@/services/devops';

export function useDevOpsCommands() {
  const [commands, setCommands] = useState<DevOpsCommand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommands = async () => {
      try {
        setLoading(true);
        const data = await devopsService.getAvailableCommands();
        setCommands(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch commands');
      } finally {
        setLoading(false);
      }
    };

    fetchCommands();
  }, []);

  return { commands, loading, error };
}

export function useCommandExecution() {
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<CommandResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executeCommand = async (command: string, args: string[] = []) => {
    try {
      setExecuting(true);
      setError(null);
      const data = await devopsService.executeCommand(command, args);
      setResult(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Command execution failed';
      setError(errorMessage);
      throw err;
    } finally {
      setExecuting(false);
    }
  };

  return { executeCommand, executing, result, error };
}

export function useCommandHistory() {
  const [history, setHistory] = useState<CommandResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async (limit: number = 20) => {
    try {
      setLoading(true);
      const data = await devopsService.getCommandHistory(limit);
      setHistory(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return { history, loading, error, refetch: fetchHistory };
}

export function useToolStatus() {
  const [tools, setTools] = useState<ToolStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const data = await devopsService.getToolStatus();
      setTools(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tool status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Refresh tool status every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return { tools, loading, error, refetch: fetchStatus };
}