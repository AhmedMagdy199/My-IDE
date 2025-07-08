import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { 
  Terminal as TerminalIcon, 
  Plus, 
  X, 
  Settings, 
  Download,
  Upload,
  Copy,
  Maximize2,
  Minimize2
} from 'lucide-react';
import 'xterm/css/xterm.css';

interface TerminalSession {
  id: string;
  name: string;
  terminal: XTerm;
  fitAddon: FitAddon;
  isActive: boolean;
  currentDirectory: string;
  environment: Record<string, string>;
  processes: Array<{
    pid: number;
    command: string;
    cpu: number;
    memory: number;
    time: string;
  }>;
}

export default function Terminal() {
  const [sessions, setSessions] = useState<TerminalSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const sessionCounter = useRef(1);

  useEffect(() => {
    // Create initial terminal session
    createNewSession();
    
    return () => {
      // Cleanup all terminals
      sessions.forEach(session => {
        session.terminal.dispose();
      });
    };
  }, []);

  const createNewSession = () => {
    const sessionId = `terminal-${sessionCounter.current++}`;
    const terminal = new XTerm({
      theme: {
        background: '#0f172a',
        foreground: '#e2e8f0',
        cursor: '#60a5fa',
        selection: '#334155',
        black: '#1e293b',
        brightBlack: '#475569',
        red: '#ef4444',
        brightRed: '#f87171',
        green: '#22c55e',
        brightGreen: '#4ade80',
        yellow: '#eab308',
        brightYellow: '#facc15',
        blue: '#3b82f6',
        brightBlue: '#60a5fa',
        magenta: '#a855f7',
        brightMagenta: '#c084fc',
        cyan: '#06b6d4',
        brightCyan: '#22d3ee',
        white: '#f1f5f9',
        brightWhite: '#f8fafc'
      },
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Menlo, Monaco, "Courier New", monospace',
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 1000,
      tabStopWidth: 4
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.loadAddon(new WebLinksAddon());

    const newSession: TerminalSession = {
      id: sessionId,
      name: `Terminal ${sessionCounter.current - 1}`,
      terminal,
      fitAddon,
      isActive: false,
      currentDirectory: '/home/user',
      environment: {
        USER: 'devops-user',
        HOME: '/home/user',
        PATH: '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin',
        SHELL: '/bin/bash',
        TERM: 'xterm-256color'
      },
      processes: [
        { pid: 1, command: 'systemd', cpu: 0.1, memory: 1.2, time: '00:01:23' },
        { pid: 123, command: 'bash', cpu: 0.0, memory: 0.8, time: '00:00:05' },
        { pid: 456, command: 'node', cpu: 2.1, memory: 45.6, time: '00:15:32' },
        { pid: 789, command: 'docker', cpu: 1.5, memory: 12.3, time: '00:08:45' },
        { pid: 1011, command: 'kubectl', cpu: 0.3, memory: 8.9, time: '00:02:15' }
      ]
    };

    setSessions(prev => [...prev, newSession]);
    setActiveSessionId(sessionId);

    // Initialize terminal with welcome message
    setTimeout(() => {
      terminal.writeln('\x1b[1;32mWelcome to DevOps IDE Terminal\x1b[0m');
      terminal.writeln('\x1b[36mType "help" for available commands\x1b[0m');
      terminal.write('\r\n');
      writePrompt(terminal, newSession);
      
      // Setup command handling
      setupTerminalCommands(terminal, newSession);
    }, 100);

    return newSession;
  };

  const writePrompt = (terminal: XTerm, session: TerminalSession) => {
    const user = session.environment.USER;
    const hostname = 'devops-ide';
    const cwd = session.currentDirectory.replace(session.environment.HOME, '~');
    terminal.write(`\x1b[32m${user}@${hostname}\x1b[0m:\x1b[34m${cwd}\x1b[0m$ `);
  };

  const setupTerminalCommands = (terminal: XTerm, session: TerminalSession) => {
    let currentLine = '';
    let commandHistory: string[] = [];
    let historyIndex = -1;

    terminal.onData(data => {
      switch (data) {
        case '\r': // Enter
          terminal.write('\r\n');
          if (currentLine.trim()) {
            executeCommand(terminal, session, currentLine.trim());
            commandHistory.push(currentLine.trim());
            historyIndex = commandHistory.length;
          }
          currentLine = '';
          break;

        case '\u0003': // Ctrl+C
          terminal.write('^C\r\n');
          currentLine = '';
          writePrompt(terminal, session);
          break;

        case '\u007F': // Backspace
          if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1);
            terminal.write('\b \b');
          }
          break;

        case '\u001b[A': // Up arrow
          if (historyIndex > 0) {
            historyIndex--;
            const command = commandHistory[historyIndex];
            terminal.write('\r\x1b[K');
            writePrompt(terminal, session);
            terminal.write(command);
            currentLine = command;
          }
          break;

        case '\u001b[B': // Down arrow
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            const command = commandHistory[historyIndex];
            terminal.write('\r\x1b[K');
            writePrompt(terminal, session);
            terminal.write(command);
            currentLine = command;
          } else {
            historyIndex = commandHistory.length;
            terminal.write('\r\x1b[K');
            writePrompt(terminal, session);
            currentLine = '';
          }
          break;

        case '\t': // Tab completion
          // Simple tab completion for common commands
          const commands = ['ls', 'cd', 'pwd', 'ps', 'top', 'cat', 'grep', 'find', 'docker', 'kubectl', 'git', 'npm', 'yarn'];
          const matches = commands.filter(cmd => cmd.startsWith(currentLine));
          if (matches.length === 1) {
            const completion = matches[0].slice(currentLine.length);
            terminal.write(completion);
            currentLine += completion;
          }
          break;

        default:
          if (data >= String.fromCharCode(0x20) && data <= String.fromCharCode(0x7E)) {
            currentLine += data;
            terminal.write(data);
          }
      }
    });
  };

  const executeCommand = async (terminal: XTerm, session: TerminalSession, command: string) => {
    const [cmd, ...args] = command.split(' ');

    switch (cmd.toLowerCase()) {
      case 'help':
        terminal.writeln('Available commands:');
        terminal.writeln('  Basic Commands:');
        terminal.writeln('    help          - Show this help message');
        terminal.writeln('    clear         - Clear the terminal');
        terminal.writeln('    exit          - Exit the terminal');
        terminal.writeln('    history       - Show command history');
        terminal.writeln('');
        terminal.writeln('  File System:');
        terminal.writeln('    ls [path]     - List directory contents');
        terminal.writeln('    cd [path]     - Change directory');
        terminal.writeln('    pwd           - Print working directory');
        terminal.writeln('    mkdir <dir>   - Create directory');
        terminal.writeln('    rmdir <dir>   - Remove directory');
        terminal.writeln('    touch <file>  - Create empty file');
        terminal.writeln('    rm <file>     - Remove file');
        terminal.writeln('    cp <src> <dst> - Copy file');
        terminal.writeln('    mv <src> <dst> - Move/rename file');
        terminal.writeln('    cat <file>    - Display file contents');
        terminal.writeln('    head <file>   - Show first 10 lines');
        terminal.writeln('    tail <file>   - Show last 10 lines');
        terminal.writeln('    grep <pattern> <file> - Search in file');
        terminal.writeln('    find <path> -name <pattern> - Find files');
        terminal.writeln('');
        terminal.writeln('  System Info:');
        terminal.writeln('    ps [aux]      - Show running processes');
        terminal.writeln('    top           - Show system processes');
        terminal.writeln('    df [-h]       - Show disk usage');
        terminal.writeln('    free [-h]     - Show memory usage');
        terminal.writeln('    uptime        - Show system uptime');
        terminal.writeln('    whoami        - Show current user');
        terminal.writeln('    date          - Show current date and time');
        terminal.writeln('    uname [-a]    - Show system information');
        terminal.writeln('');
        terminal.writeln('  DevOps Tools:');
        terminal.writeln('    docker        - Docker commands');
        terminal.writeln('    kubectl       - Kubernetes CLI commands');
        terminal.writeln('    terraform     - Terraform commands');
        terminal.writeln('    aws           - AWS CLI commands');
        terminal.writeln('    git           - Git commands');
        terminal.writeln('    npm           - Node package manager');
        terminal.writeln('    yarn          - Yarn package manager');
        break;

      case 'clear':
        terminal.clear();
        break;

      case 'exit':
        terminal.writeln('Goodbye!');
        // Don't write prompt after exit
        return;

      case 'ls':
        const path = args[0] || session.currentDirectory;
        if (path === session.currentDirectory || path === '.') {
          terminal.writeln('total 24');
          terminal.writeln('drwxr-xr-x  3 user user 4096 Dec 15 10:30 \x1b[34mprojects\x1b[0m');
          terminal.writeln('drwxr-xr-x  2 user user 4096 Dec 15 09:15 \x1b[34mscripts\x1b[0m');
          terminal.writeln('drwxr-xr-x  2 user user 4096 Dec 15 08:00 \x1b[34m.config\x1b[0m');
          terminal.writeln('-rw-r--r--  1 user user 1024 Dec 15 08:45 README.md');
          terminal.writeln('-rw-r--r--  1 user user  512 Dec 15 08:30 package.json');
          terminal.writeln('-rw-r--r--  1 user user  256 Dec 15 08:15 .bashrc');
        } else if (path === '/') {
          terminal.writeln('total 68');
          terminal.writeln('drwxr-xr-x   2 root root  4096 Dec 15 08:00 \x1b[34mbin\x1b[0m');
          terminal.writeln('drwxr-xr-x   3 root root  4096 Dec 15 08:00 \x1b[34mboot\x1b[0m');
          terminal.writeln('drwxr-xr-x  19 root root  3860 Dec 15 10:30 \x1b[34mdev\x1b[0m');
          terminal.writeln('drwxr-xr-x 133 root root 12288 Dec 15 10:30 \x1b[34metc\x1b[0m');
          terminal.writeln('drwxr-xr-x   3 root root  4096 Dec 15 08:00 \x1b[34mhome\x1b[0m');
          terminal.writeln('drwxr-xr-x  21 root root  4096 Dec 15 08:00 \x1b[34mlib\x1b[0m');
          terminal.writeln('drwxr-xr-x   2 root root  4096 Dec 15 08:00 \x1b[34msbin\x1b[0m');
          terminal.writeln('drwxr-xr-x  13 root root     0 Dec 15 10:30 \x1b[34msys\x1b[0m');
          terminal.writeln('drwxrwxrwt  15 root root  4096 Dec 15 10:30 \x1b[34mtmp\x1b[0m');
          terminal.writeln('drwxr-xr-x  10 root root  4096 Dec 15 08:00 \x1b[34musr\x1b[0m');
          terminal.writeln('drwxr-xr-x  11 root root  4096 Dec 15 08:00 \x1b[34mvar\x1b[0m');
        } else {
          terminal.writeln(`ls: cannot access '${path}': No such file or directory`);
        }
        break;

      case 'cd':
        const newPath = args[0];
        if (!newPath || newPath === '~') {
          session.currentDirectory = session.environment.HOME;
        } else if (newPath === '/') {
          session.currentDirectory = '/';
        } else if (newPath === '..') {
          const parts = session.currentDirectory.split('/').filter(p => p);
          parts.pop();
          session.currentDirectory = '/' + parts.join('/');
          if (session.currentDirectory === '/') session.currentDirectory = '/';
        } else if (newPath.startsWith('/')) {
          session.currentDirectory = newPath;
        } else {
          session.currentDirectory = session.currentDirectory + '/' + newPath;
        }
        break;

      case 'pwd':
        terminal.writeln(session.currentDirectory);
        break;

      case 'ps':
        if (args[0] === 'aux' || args[0] === '-aux') {
          terminal.writeln('USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND');
          session.processes.forEach(proc => {
            terminal.writeln(`${session.environment.USER.padEnd(8)} ${proc.pid.toString().padStart(5)} ${proc.cpu.toFixed(1).padStart(4)} ${proc.memory.toFixed(1).padStart(4)} 123456  12345 pts/0    S    10:30   ${proc.time} ${proc.command}`);
          });
        } else {
          terminal.writeln('  PID TTY          TIME CMD');
          session.processes.slice(1, 4).forEach(proc => {
            terminal.writeln(`${proc.pid.toString().padStart(5)} pts/0    ${proc.time} ${proc.command}`);
          });
        }
        break;

      case 'top':
        terminal.writeln('top - 10:30:15 up 2 days,  3:45,  1 user,  load average: 0.15, 0.25, 0.30');
        terminal.writeln('Tasks: 156 total,   1 running, 155 sleeping,   0 stopped,   0 zombie');
        terminal.writeln('%Cpu(s):  2.1 us,  1.3 sy,  0.0 ni, 96.2 id,  0.4 wa,  0.0 hi,  0.0 si,  0.0 st');
        terminal.writeln('MiB Mem :   7936.0 total,   1234.5 free,   3456.7 used,   3244.8 buff/cache');
        terminal.writeln('MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   4123.4 avail Mem');
        terminal.writeln('');
        terminal.writeln('  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND');
        session.processes.forEach(proc => {
          terminal.writeln(`${proc.pid.toString().padStart(5)} ${session.environment.USER.padEnd(8)} 20   0  123456  12345   8765 S  ${proc.cpu.toFixed(1).padStart(4)}  ${proc.memory.toFixed(1).padStart(4)}   ${proc.time} ${proc.command}`);
        });
        break;

      case 'df':
        if (args[0] === '-h') {
          terminal.writeln('Filesystem      Size  Used Avail Use% Mounted on');
          terminal.writeln('/dev/sda1        20G  8.5G   11G  45% /');
          terminal.writeln('tmpfs           3.9G     0  3.9G   0% /dev/shm');
          terminal.writeln('/dev/sda2       100G   45G   50G  48% /home');
        } else {
          terminal.writeln('Filesystem     1K-blocks     Used Available Use% Mounted on');
          terminal.writeln('/dev/sda1       20971520  8912896  11534336  45% /');
          terminal.writeln('tmpfs            4063232        0   4063232   0% /dev/shm');
          terminal.writeln('/dev/sda2      104857600 47185920  52428800  48% /home');
        }
        break;

      case 'free':
        if (args[0] === '-h') {
          terminal.writeln('              total        used        free      shared  buff/cache   available');
          terminal.writeln('Mem:          7.8Gi       3.4Gi       1.2Gi       256Mi       3.2Gi       4.0Gi');
          terminal.writeln('Swap:         2.0Gi          0B       2.0Gi');
        } else {
          terminal.writeln('              total        used        free      shared  buff/cache   available');
          terminal.writeln('Mem:        8126464     3567890     1234567      262144     3323907     4123456');
          terminal.writeln('Swap:       2097152           0     2097152');
        }
        break;

      case 'uptime':
        terminal.writeln(' 10:30:15 up 2 days,  3:45,  1 user,  load average: 0.15, 0.25, 0.30');
        break;

      case 'whoami':
        terminal.writeln(session.environment.USER);
        break;

      case 'date':
        terminal.writeln(new Date().toString());
        break;

      case 'uname':
        if (args[0] === '-a') {
          terminal.writeln('Linux devops-ide 5.15.0-generic #72-Ubuntu SMP Tue Nov 23 20:14:38 UTC 2021 x86_64 x86_64 x86_64 GNU/Linux');
        } else {
          terminal.writeln('Linux');
        }
        break;

      case 'mkdir':
        if (args[0]) {
          terminal.writeln(`Directory '${args[0]}' created`);
        } else {
          terminal.writeln('mkdir: missing operand');
        }
        break;

      case 'rmdir':
        if (args[0]) {
          terminal.writeln(`Directory '${args[0]}' removed`);
        } else {
          terminal.writeln('rmdir: missing operand');
        }
        break;

      case 'touch':
        if (args[0]) {
          terminal.writeln(`File '${args[0]}' created`);
        } else {
          terminal.writeln('touch: missing file operand');
        }
        break;

      case 'rm':
        if (args[0]) {
          terminal.writeln(`File '${args[0]}' removed`);
        } else {
          terminal.writeln('rm: missing operand');
        }
        break;

      case 'cp':
        if (args.length >= 2) {
          terminal.writeln(`'${args[0]}' copied to '${args[1]}'`);
        } else {
          terminal.writeln('cp: missing file operand');
        }
        break;

      case 'mv':
        if (args.length >= 2) {
          terminal.writeln(`'${args[0]}' moved to '${args[1]}'`);
        } else {
          terminal.writeln('mv: missing file operand');
        }
        break;

      case 'cat':
        if (args[0]) {
          if (args[0] === 'README.md') {
            terminal.writeln('# DevOps IDE');
            terminal.writeln('');
            terminal.writeln('A comprehensive DevOps development environment.');
            terminal.writeln('');
            terminal.writeln('## Features');
            terminal.writeln('- Cloud integration');
            terminal.writeln('- Container management');
            terminal.writeln('- CI/CD pipelines');
            terminal.writeln('- Monitoring and logging');
          } else if (args[0] === 'package.json') {
            terminal.writeln('{');
            terminal.writeln('  "name": "devops-ide",');
            terminal.writeln('  "version": "1.0.0",');
            terminal.writeln('  "description": "DevOps IDE",');
            terminal.writeln('  "main": "index.js"');
            terminal.writeln('}');
          } else {
            terminal.writeln(`cat: ${args[0]}: No such file or directory`);
          }
        } else {
          terminal.writeln('cat: missing file operand');
        }
        break;

      case 'head':
        if (args[0]) {
          terminal.writeln(`Showing first 10 lines of ${args[0]}:`);
          terminal.writeln('Line 1');
          terminal.writeln('Line 2');
          terminal.writeln('...');
        } else {
          terminal.writeln('head: missing file operand');
        }
        break;

      case 'tail':
        if (args[0]) {
          terminal.writeln(`Showing last 10 lines of ${args[0]}:`);
          terminal.writeln('...');
          terminal.writeln('Line 9');
          terminal.writeln('Line 10');
        } else {
          terminal.writeln('tail: missing file operand');
        }
        break;

      case 'grep':
        if (args.length >= 2) {
          terminal.writeln(`Searching for '${args[0]}' in ${args[1]}:`);
          terminal.writeln(`${args[1]}:1:Found match: ${args[0]}`);
        } else {
          terminal.writeln('grep: missing operand');
        }
        break;

      case 'find':
        if (args.length >= 3 && args[1] === '-name') {
          terminal.writeln(`Finding files matching '${args[2]}' in ${args[0] || '.'}:`);
          terminal.writeln(`./projects/${args[2]}`);
          terminal.writeln(`./scripts/${args[2]}`);
        } else {
          terminal.writeln('find: invalid syntax');
        }
        break;

      case 'history':
        terminal.writeln('Command history:');
        terminal.writeln('  1  ls');
        terminal.writeln('  2  cd projects');
        terminal.writeln('  3  pwd');
        terminal.writeln('  4  ps aux');
        terminal.writeln('  5  docker ps');
        break;

      case 'env':
        Object.entries(session.environment).forEach(([key, value]) => {
          terminal.writeln(`${key}=${value}`);
        });
        break;

      case 'echo':
        terminal.writeln(args.join(' '));
        break;

      // DevOps Tools
      case 'docker':
        if (args.length === 0) {
          terminal.writeln('Docker version 24.0.7');
          terminal.writeln('Usage: docker [OPTIONS] COMMAND');
        } else {
          terminal.writeln(`Executing: docker ${args.join(' ')}`);
          await simulateCommand(terminal, `docker ${args.join(' ')}`);
        }
        break;

      case 'kubectl':
        if (args.length === 0) {
          terminal.writeln('kubectl controls the Kubernetes cluster manager.');
          terminal.writeln('Usage: kubectl [command] [options]');
        } else {
          terminal.writeln(`Executing: kubectl ${args.join(' ')}`);
          await simulateCommand(terminal, `kubectl ${args.join(' ')}`);
        }
        break;

      case 'terraform':
        if (args.length === 0) {
          terminal.writeln('Terraform v1.6.0');
          terminal.writeln('Usage: terraform [global options] <subcommand> [args]');
        } else {
          terminal.writeln(`Executing: terraform ${args.join(' ')}`);
          await simulateCommand(terminal, `terraform ${args.join(' ')}`);
        }
        break;

      case 'aws':
        if (args.length === 0) {
          terminal.writeln('aws-cli/2.13.0 Python/3.11.0');
          terminal.writeln('Usage: aws [options] <command> <subcommand> [<subcommand> ...] [parameters]');
        } else {
          terminal.writeln(`Executing: aws ${args.join(' ')}`);
          await simulateCommand(terminal, `aws ${args.join(' ')}`);
        }
        break;

      case 'git':
        if (args.length === 0) {
          terminal.writeln('git version 2.42.0');
          terminal.writeln('Usage: git [--version] [--help] [-C <path>] [-c <name>=<value>]');
        } else {
          terminal.writeln(`Executing: git ${args.join(' ')}`);
          await simulateCommand(terminal, `git ${args.join(' ')}`);
        }
        break;

      case 'npm':
        if (args.length === 0) {
          terminal.writeln('npm version 10.2.0');
          terminal.writeln('Usage: npm <command>');
        } else {
          terminal.writeln(`Executing: npm ${args.join(' ')}`);
          await simulateCommand(terminal, `npm ${args.join(' ')}`);
        }
        break;

      case 'yarn':
        if (args.length === 0) {
          terminal.writeln('yarn version 1.22.19');
          terminal.writeln('Usage: yarn [command] [flags]');
        } else {
          terminal.writeln(`Executing: yarn ${args.join(' ')}`);
          await simulateCommand(terminal, `yarn ${args.join(' ')}`);
        }
        break;

      default:
        terminal.writeln(`Command not found: ${cmd}`);
        terminal.writeln('Type "help" for available commands.');
    }

    writePrompt(terminal, session);
  };

  const simulateCommand = async (terminal: XTerm, command: string) => {
    // Simulate command execution with loading
    terminal.write('...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    terminal.write('\r\x1b[K');
    
    if (command.includes('kubectl get pods')) {
      terminal.writeln('NAME                     READY   STATUS    RESTARTS   AGE');
      terminal.writeln('nginx-deployment-1       1/1     Running   0          2d');
      terminal.writeln('redis-cache-2            1/1     Running   1          1d');
      terminal.writeln('api-server-3             1/1     Running   0          3h');
    } else if (command.includes('docker ps')) {
      terminal.writeln('CONTAINER ID   IMAGE          COMMAND                  CREATED       STATUS       PORTS                    NAMES');
      terminal.writeln('a1b2c3d4e5f6   nginx:latest   "/docker-entrypoint.…"   2 hours ago   Up 2 hours   0.0.0.0:80->80/tcp      web-server');
      terminal.writeln('f6e5d4c3b2a1   redis:alpine   "docker-entrypoint.s…"   1 day ago     Up 1 day     0.0.0.0:6379->6379/tcp  redis-cache');
    } else if (command.includes('terraform plan')) {
      terminal.writeln('Terraform will perform the following actions:');
      terminal.writeln('');
      terminal.writeln('  # aws_instance.web will be created');
      terminal.writeln('  + resource "aws_instance" "web" {');
      terminal.writeln('      + ami                    = "ami-0c02fb55956c7d316"');
      terminal.writeln('      + instance_type          = "t2.micro"');
      terminal.writeln('    }');
      terminal.writeln('');
      terminal.writeln('Plan: 1 to add, 0 to change, 0 to destroy.');
    } else if (command.includes('git status')) {
      terminal.writeln('On branch main');
      terminal.writeln('Your branch is up to date with \'origin/main\'.');
      terminal.writeln('');
      terminal.writeln('Changes not staged for commit:');
      terminal.writeln('  (use "git add <file>..." to update what will be committed)');
      terminal.writeln('  (use "git restore <file>..." to discard changes in working directory)');
      terminal.writeln('        \x1b[31mmodified:   src/components/Terminal.tsx\x1b[0m');
      terminal.writeln('');
      terminal.writeln('no changes added to commit (use "git add" or "git commit -a")');
    } else if (command.includes('npm install')) {
      terminal.writeln('npm WARN deprecated package@1.0.0: This package is deprecated');
      terminal.writeln('');
      terminal.writeln('added 245 packages, and audited 1337 packages in 15s');
      terminal.writeln('');
      terminal.writeln('42 packages are looking for funding');
      terminal.writeln('  run `npm fund` for details');
      terminal.writeln('');
      terminal.writeln('found 0 vulnerabilities');
    } else {
      terminal.writeln(`Command executed successfully: ${command}`);
    }
  };

  const closeSession = (sessionId: string) => {
    setSessions(prev => {
      const session = prev.find(s => s.id === sessionId);
      if (session) {
        session.terminal.dispose();
      }
      const newSessions = prev.filter(s => s.id !== sessionId);
      
      if (sessionId === activeSessionId && newSessions.length > 0) {
        setActiveSessionId(newSessions[0].id);
      } else if (newSessions.length === 0) {
        setActiveSessionId(null);
      }
      
      return newSessions;
    });
  };

  const switchToSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    
    // Mount the terminal to the container
    setTimeout(() => {
      const session = sessions.find(s => s.id === sessionId);
      if (session && terminalContainerRef.current) {
        session.terminal.open(terminalContainerRef.current);
        session.fitAddon.fit();
      }
    }, 0);
  };

  useEffect(() => {
    if (activeSessionId && terminalContainerRef.current) {
      const activeSession = sessions.find(s => s.id === activeSessionId);
      if (activeSession) {
        // Clear the container first
        terminalContainerRef.current.innerHTML = '';
        activeSession.terminal.open(terminalContainerRef.current);
        activeSession.fitAddon.fit();
      }
    }
  }, [activeSessionId, sessions]);

  useEffect(() => {
    const handleResize = () => {
      const activeSession = sessions.find(s => s.id === activeSessionId);
      if (activeSession) {
        activeSession.fitAddon.fit();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeSessionId, sessions]);

  return (
    <div className={`flex flex-col bg-gray-900 text-white ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'}`}>
      {/* Header */}
      <div className="border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <TerminalIcon className="w-6 h-6 text-green-400" />
            <h1 className="text-xl font-bold">Terminal</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-700 rounded-md"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button className="p-2 hover:bg-gray-700 rounded-md" title="Settings">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Tabs */}
      <div className="flex items-center bg-gray-800 border-b border-gray-700">
        <div className="flex-1 flex items-center overflow-x-auto">
          {sessions.map(session => (
            <div
              key={session.id}
              className={`flex items-center px-4 py-2 border-r border-gray-700 cursor-pointer min-w-0 ${
                session.id === activeSessionId ? 'bg-gray-900' : 'hover:bg-gray-700'
              }`}
              onClick={() => switchToSession(session.id)}
            >
              <span className="truncate mr-2">{session.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeSession(session.id);
                }}
                className="p-1 hover:bg-gray-600 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        
        <button
          onClick={createNewSession}
          className="p-2 hover:bg-gray-700 border-l border-gray-700"
          title="New Terminal"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 relative">
        <div
          ref={terminalContainerRef}
          className="absolute inset-0 p-2"
          style={{ fontFamily: 'JetBrains Mono, Menlo, Monaco, "Courier New", monospace' }}
        />
        
        {sessions.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <TerminalIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No terminal sessions</p>
              <button
                onClick={createNewSession}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Create New Terminal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer with shortcuts */}
      <div className="border-t border-gray-700 px-4 py-2 bg-gray-800">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <span>Ctrl+C: Interrupt</span>
            <span>Ctrl+L: Clear</span>
            <span>↑/↓: History</span>
            <span>Tab: Completion</span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-gray-700 rounded" title="Copy">
              <Copy className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-gray-700 rounded" title="Download Log">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-gray-700 rounded" title="Upload File">
              <Upload className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}