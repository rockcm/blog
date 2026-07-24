const terminalScreen = document.querySelector("[data-terminal-screen]");
const terminalOutput = document.querySelector("[data-terminal-output]");
const terminalForm = document.querySelector("[data-terminal-form]");
const terminalInput = document.querySelector("[data-terminal-input]");
const terminalPath = document.querySelector("[data-terminal-path]");
const terminalTitlePath = document.querySelector("[data-terminal-title-path]");
const terminalFooter = document.querySelector("[data-terminal-footer]");
const terminalQuickCommands = document.querySelector("[data-terminal-quick]");
const quickCommands = document.querySelectorAll("[data-run-command]");
const vimEditor = document.querySelector("[data-vim-editor]");
const vimTextarea = document.querySelector("[data-vim-textarea]");
const vimLineNumbers = document.querySelector("[data-vim-lines]");
const vimModeLabel = document.querySelector("[data-vim-mode]");
const vimFileLabel = document.querySelector("[data-vim-file]");
const vimPosition = document.querySelector("[data-vim-position]");
const vimMessage = document.querySelector("[data-vim-message]");
const vimCommandRow = document.querySelector("[data-vim-command-row]");
const vimCommandForm = document.querySelector("[data-vim-command-form]");
const vimCommandInput = document.querySelector("[data-vim-command-input]");
const vimActionButtons = document.querySelectorAll("[data-vim-action]");

if (terminalScreen && terminalOutput && terminalForm && terminalInput) {
  const commandHistory = [];
  const commands = [
    "help", "about", "projects", "services", "skills", "experience", "contact",
    "neofetch", "ls", "ll", "cd", "mkdir", "rm", "pwd", "whoami", "cat", "head", "tail", "tree",
    "find", "grep", "wc", "man", "open", "history", "echo", "date", "clear",
    "vim", "reset-fs", "matrix", "sudo", "fortune", "exit"
  ];
  const destinations = {
    home: "index.html",
    work: "index.html#projects",
    projects: "index.html#projects",
    services: "index.html#services",
    experience: "index.html#experience",
    contact: "index.html?contact=open",
    resume: "posts/resume.html",
    writing: "posts/blogs.html",
    blog: "posts/blogs.html",
    calcounter: "https://github.com/rockcm/CalCounter",
    blackjack: "https://rockcm.github.io/CasinoBlackJack/",
    ufc: "https://github.com/rockcm/UFCFightPredictor",
    github: "https://github.com/rockcm",
    linkedin: "https://linkedin.com/in/christianrock"
  };
  const fortunes = [
    "Automate the repeatable. Document the surprising.",
    "The best internal tool is the one people actually want to use.",
    "Reliable delivery is a product, not an afterthought.",
    "Small improvements compound—especially when the pipeline does them automatically."
  ];
  const homeDirectory = "/home/christian";
  const baseDirectories = {
    "/": ["home"],
    "/home": ["christian"],
    "/home/christian": ["README.md", "contact.txt", "experience", "projects", "services", "skills"],
    "/home/christian/experience": ["README.md", "delivery-automation.md"],
    "/home/christian/projects": [
      "README.md",
      "delivery-automation.md",
      "calcounter.md",
      "casino-blackjack.md",
      "ufc-fight-predictor.md"
    ],
    "/home/christian/services": ["README.md"],
    "/home/christian/skills": ["README.md"]
  };
  const builtInFiles = {
    "/home/christian/README.md": [
      "# Christian.dev",
      "",
      "I build systems that ship software and create apps that solve real problems.",
      "",
      "Explore the virtual filesystem:",
      "  cd projects",
      "  ll",
      "  cat README.md",
      "  head delivery-automation.md",
      "  tree ~",
      "",
      "Type `help` for the complete command list or `contact` to start a project."
    ].join("\n"),
    "/home/christian/contact.txt": [
      "Christian Rock",
      "Email: rockcm@etsu.edu",
      "GitHub: https://github.com/rockcm",
      "Run `contact` to open the project inquiry form."
    ].join("\n"),
    "/home/christian/experience/README.md": [
      "# Experience",
      "",
      "Enterprise delivery automation, application development, and technical leadership.",
      "Read delivery-automation.md for a generalized enterprise delivery story."
    ].join("\n"),
    "/home/christian/experience/delivery-automation.md": [
      "# Enterprise Delivery Automation",
      "",
      "Designed reusable automation for a large enterprise application portfolio.",
      "Improved pull-request feedback and build consistency.",
      "Standardized configuration for more repeatable releases.",
      "Established traceable release orchestration with fewer manual steps.",
      "Provided technical leadership and mentoring for automation work."
    ].join("\n"),
    "/home/christian/projects/README.md": [
      "# Selected Projects",
      "",
      "delivery-automation.md       Enterprise build and release automation",
      "calcounter.md                Local-first desktop nutrition tracker",
      "casino-blackjack.md          Responsive blackjack game",
      "ufc-fight-predictor.md       Fight analysis and probability application",
      "",
      "Use `cat <file>` to inspect a project or `open <project>` to visit it."
    ].join("\n"),
    "/home/christian/projects/delivery-automation.md": [
      "# Enterprise Delivery Automation",
      "",
      "Reusable automation improves feedback and build consistency.",
      "Versioned outputs create a stable handoff for release workflows.",
      "Reviewable configuration makes delivery more repeatable.",
      "Employer, system, scale, and implementation details are omitted."
    ].join("\n"),
    "/home/christian/projects/calcounter.md": [
      "# CalCounter",
      "",
      "Electron desktop application for local-first nutrition tracking.",
      "Uses USDA FoodData Central for food search and nutrition data.",
      "Includes serving conversion, result ranking, daily goals, and history.",
      "Run `open calcounter` to view the source."
    ].join("\n"),
    "/home/christian/projects/casino-blackjack.md": [
      "# CasinoBlackJack",
      "",
      "Responsive blackjack game with complete game-state and scoring logic.",
      "Run `open blackjack` to play it."
    ].join("\n"),
    "/home/christian/projects/ufc-fight-predictor.md": [
      "# UFC Fight Predictor",
      "",
      "Python data collection and analysis with a FastAPI service and React interface.",
      "Uses fighter statistics to calculate matchup probabilities.",
      "Run `open ufc` to view the source."
    ].join("\n"),
    "/home/christian/services/README.md": [
      "# Services",
      "",
      "Custom business software",
      "Automation and integrations",
      "Websites and digital presence",
      "Enterprise platform and deployment engineering"
    ].join("\n"),
    "/home/christian/skills/README.md": [
      "# Toolkit",
      "",
      "Platform: AWS, OpenShift, Nexus, Jenkins, Linux, Git, Docker, GitHub Actions",
      "Applications: Python, C#, .NET, JavaScript, React, Blazor, FastAPI, Electron, SQL",
      "Practice: Automation, system design, configuration, leadership, and mentoring"
    ].join("\n")
  };
  const storageKey = "christian-terminal-files-v1";
  let fileOverrides = {};
  let deletedPaths = new Set();
  let createdDirectories = new Set();
  let files = {};
  let directories = {};
  let historyPosition = 0;
  let currentDirectory = homeDirectory;
  let previousDirectory = homeDirectory;
  let tabCompletionSignature = "";

  function loadFilesystem() {
    let stored = {};
    try {
      stored = JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch {
      stored = {};
    }

    if (stored.files || stored.deleted || stored.directories) {
      fileOverrides = stored.files || {};
      deletedPaths = new Set(stored.deleted || []);
      createdDirectories = new Set(stored.directories || []);
    } else {
      fileOverrides = stored;
      deletedPaths = new Set();
      createdDirectories = new Set();
    }

    directories = Object.fromEntries(
      Object.entries(baseDirectories).map(([path, entries]) => [path, [...entries]])
    );
    [...createdDirectories]
      .sort((a, b) => a.split("/").length - b.split("/").length)
      .forEach((path) => {
        const separator = path.lastIndexOf("/");
        const parent = path.slice(0, separator) || "/";
        const name = path.slice(separator + 1);
        if (directories[parent]) {
          directories[path] = directories[path] || [];
          if (!directories[parent].includes(name)) directories[parent].push(name);
        }
      });

    [...deletedPaths]
      .sort((a, b) => b.length - a.length)
      .forEach((path) => {
        Object.keys(directories)
          .filter((directory) => directory === path || directory.startsWith(`${path}/`))
          .forEach((directory) => delete directories[directory]);
        const separator = path.lastIndexOf("/");
        const parent = path.slice(0, separator) || "/";
        const name = path.slice(separator + 1);
        if (directories[parent]) directories[parent] = directories[parent].filter((entry) => entry !== name);
      });

    files = Object.fromEntries(
      Object.entries({ ...builtInFiles, ...fileOverrides }).filter(([path]) =>
        ![...deletedPaths].some((deleted) => path === deleted || path.startsWith(`${deleted}/`))
      )
    );
    Object.keys(files).forEach((path) => {
      const separator = path.lastIndexOf("/");
      const parent = path.slice(0, separator) || "/";
      const name = path.slice(separator + 1);
      if (directories[parent] && !directories[parent].includes(name)) directories[parent].push(name);
    });
  }

  function saveFilesystemState() {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          files: fileOverrides,
          deleted: [...deletedPaths],
          directories: [...createdDirectories]
        })
      );
      return true;
    } catch {
      return false;
    }
  }

  function persistVirtualFile(path, content) {
    files[path] = content;
    fileOverrides[path] = content;
    deletedPaths.delete(path);
    const separator = path.lastIndexOf("/");
    const parent = path.slice(0, separator) || "/";
    const name = path.slice(separator + 1);
    if (!directories[parent].includes(name)) directories[parent].push(name);
    return saveFilesystemState();
  }

  function resetVirtualFilesystem() {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // The in-memory reset still works when browser storage is unavailable.
    }
    fileOverrides = {};
    deletedPaths = new Set();
    createdDirectories = new Set();
    loadFilesystem();
  }

  loadFilesystem();

  function scrollToLatest() {
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
  }

  function writeLine(content = "", className = "", trustedHTML = false) {
    const line = document.createElement("div");
    line.className = `terminal-line-output ${className}`.trim();
    if (trustedHTML) line.innerHTML = content;
    else line.textContent = content;
    terminalOutput.appendChild(line);
    scrollToLatest();
    return line;
  }

  function writeBlock(content) {
    return writeLine(`<div class="terminal-block">${content}</div>`, "", true);
  }

  function displayPath(path = currentDirectory) {
    return path === homeDirectory ? "~" : path.startsWith(`${homeDirectory}/`) ? `~${path.slice(homeDirectory.length)}` : path;
  }

  function normalizePath(path = ".") {
    const expanded = path.replace(/^~(?=\/|$)/, homeDirectory);
    const source = expanded.startsWith("/") ? expanded : `${currentDirectory}/${expanded}`;
    const segments = [];
    source.split("/").forEach((segment) => {
      if (!segment || segment === ".") return;
      if (segment === "..") segments.pop();
      else segments.push(segment);
    });
    return `/${segments.join("/")}`;
  }

  function entryType(path) {
    if (Object.hasOwn(directories, path)) return "directory";
    if (Object.hasOwn(files, path)) return "file";
    return null;
  }

  function parseShellTokens(value) {
    return (value.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [])
      .map((token) => token.replace(/^(["'])(.*)\1$/, "$2"));
  }

  function completionContext() {
    const value = terminalInput.value;
    const cursor = terminalInput.selectionStart ?? value.length;
    const beforeCursor = value.slice(0, cursor);
    let quote = "";
    let tokenStart = 0;

    for (let index = 0; index < beforeCursor.length; index += 1) {
      const character = beforeCursor[index];
      if (quote) {
        if (character === quote) quote = "";
      } else if (character === "'" || character === "\"") {
        quote = character;
      } else if (/\s/.test(character)) {
        tokenStart = index + 1;
      }
    }

    let tokenEnd = cursor;
    let endingQuote = quote;
    for (let index = cursor; index < value.length; index += 1) {
      const character = value[index];
      if (endingQuote) {
        tokenEnd = index + 1;
        if (character === endingQuote) endingQuote = "";
      } else if (/\s/.test(character)) {
        break;
      } else {
        tokenEnd = index + 1;
        if (character === "'" || character === "\"") endingQuote = character;
      }
    }

    const rawToken = beforeCursor.slice(tokenStart);
    const quoteCharacter = rawToken.startsWith("\"") || rawToken.startsWith("'")
      ? rawToken[0]
      : "";
    let typedToken = quoteCharacter ? rawToken.slice(1) : rawToken;
    if (quoteCharacter && typedToken.endsWith(quoteCharacter)) {
      typedToken = typedToken.slice(0, -1);
    }
    const priorTokens = parseShellTokens(beforeCursor.slice(0, tokenStart).trim());

    return {
      value,
      cursor,
      tokenStart,
      tokenEnd,
      typedToken,
      quoteCharacter,
      priorTokens,
      tokenIndex: priorTokens.length,
      command: priorTokens[0]?.toLowerCase() || ""
    };
  }

  function pathCompletionCandidates(typedPath, allowedTypes = new Set(["file", "directory"])) {
    const slashIndex = typedPath.lastIndexOf("/");
    const typedDirectory = slashIndex >= 0 ? typedPath.slice(0, slashIndex + 1) : "";
    const namePrefix = slashIndex >= 0 ? typedPath.slice(slashIndex + 1) : typedPath;
    const parentToken = typedDirectory || ".";
    const parentPath = normalizePath(parentToken);

    if (entryType(parentPath) !== "directory") return [];

    return directories[parentPath]
      .filter((entry) => entry.startsWith(namePrefix))
      .map((entry) => {
        const childPath = parentPath === "/" ? `/${entry}` : `${parentPath}/${entry}`;
        const type = entryType(childPath);
        return {
          value: `${typedDirectory}${entry}${type === "directory" ? "/" : ""}`,
          display: `${entry}${type === "directory" ? "/" : ""}`,
          directory: type === "directory"
        };
      })
      .filter((candidate) => allowedTypes.has(candidate.directory ? "directory" : "file"))
      .sort((left, right) => left.display.localeCompare(right.display));
  }

  function staticCompletionCandidates(values, prefix) {
    return values
      .filter((value) => value.startsWith(prefix.toLowerCase()))
      .map((value) => ({ value, display: value, directory: false }));
  }

  function getCompletionCandidates(context) {
    if (context.tokenIndex === 0) {
      return staticCompletionCandidates(commands, context.typedToken);
    }

    const options = {
      ls: ["-a", "-l", "-la"],
      ll: ["-a", "-l", "-la"],
      mkdir: ["-p"],
      rm: ["-f", "-r", "-rf"],
      head: ["-n"],
      tail: ["-n"],
      grep: ["-i"],
      wc: ["-l", "-w", "-c"],
      find: ["-name"]
    };
    if (context.typedToken.startsWith("-") && options[context.command]) {
      return staticCompletionCandidates(options[context.command], context.typedToken);
    }

    if (context.command === "open") {
      return staticCompletionCandidates(Object.keys(destinations), context.typedToken);
    }
    if (context.command === "man") {
      return staticCompletionCandidates(
        ["cd", "ls", "ll", "cat", "head", "tail", "tree", "find", "grep", "wc", "vim", "mkdir", "rm", "reset-fs", "matrix"],
        context.typedToken
      );
    }
    if (context.command === "matrix") {
      return staticCompletionCandidates(["on", "off", "status"], context.typedToken);
    }
    if (context.command === "sudo") {
      const sudoCandidates = context.tokenIndex === 1
        ? ["hire"]
        : context.priorTokens[1] === "hire" && context.tokenIndex === 2
          ? ["christian"]
          : [];
      return staticCompletionCandidates(sudoCandidates, context.typedToken);
    }
    if (context.command === "cd" && context.typedToken === "-") {
      return [{ value: "-", display: "-", directory: false }];
    }

    const pathCommands = new Set(["ls", "ll", "cd", "mkdir", "rm", "cat", "head", "tail", "tree", "find", "grep", "wc", "vim"]);
    if (!pathCommands.has(context.command)) return [];

    if (context.command === "find" && context.priorTokens.at(-1) === "-name") return [];
    if (context.command === "grep") {
      const grepArguments = context.priorTokens.slice(1).filter((argument) => argument !== "-i");
      if (!grepArguments.length) return [];
    }

    const allowedTypes = context.command === "cd"
      ? new Set(["directory"])
      : ["cat", "head", "tail", "grep", "wc"].includes(context.command)
        ? new Set(["file"])
        : new Set(["file", "directory"]);
    return pathCompletionCandidates(context.typedToken, allowedTypes);
  }

  function commonCompletionPrefix(candidates) {
    if (!candidates.length) return "";
    return candidates.slice(1).reduce((prefix, candidate) => {
      let index = 0;
      while (index < prefix.length && prefix[index] === candidate.value[index]) index += 1;
      return prefix.slice(0, index);
    }, candidates[0].value);
  }

  function formatCompletedToken(value, quoteCharacter) {
    const selectedQuote = quoteCharacter || (/\s/.test(value) ? "\"" : "");
    if (!selectedQuote) return value;
    return `${selectedQuote}${value}${selectedQuote}`;
  }

  function replaceCompletion(context, token, appendSpace = false, cursorBack = 0) {
    const replacement = `${token}${appendSpace ? " " : ""}`;
    terminalInput.value =
      context.value.slice(0, context.tokenStart) +
      replacement +
      context.value.slice(context.tokenEnd);
    const position = context.tokenStart + replacement.length - cursorBack;
    terminalInput.setSelectionRange(position, position);
    return `${terminalInput.value}\u0000${position}`;
  }

  function completeTerminalInput() {
    const context = completionContext();
    const candidates = getCompletionCandidates(context);
    const originalSignature = `${context.value}\u0000${context.cursor}`;

    if (!candidates.length) {
      if (tabCompletionSignature === originalSignature) {
        writeLine("No completion matches.", "muted");
        tabCompletionSignature = "";
      } else {
        tabCompletionSignature = originalSignature;
      }
      return;
    }

    if (candidates.length === 1) {
      const candidate = candidates[0];
      const completedToken = formatCompletedToken(candidate.value, context.quoteCharacter);
      const cursorBack = candidate.directory && /^(['"]).*\1$/.test(completedToken) ? 1 : 0;
      replaceCompletion(context, completedToken, !candidate.directory, cursorBack);
      tabCompletionSignature = "";
      return;
    }

    const commonPrefix = commonCompletionPrefix(candidates);
    if (commonPrefix.length > context.typedToken.length) {
      const completedToken = formatCompletedToken(commonPrefix, context.quoteCharacter);
      const cursorBack = /^(['"]).*\1$/.test(completedToken) ? 1 : 0;
      tabCompletionSignature = replaceCompletion(context, completedToken, false, cursorBack);
      return;
    }

    if (tabCompletionSignature === originalSignature) {
      writeLine(candidates.map((candidate) => candidate.display).join("  "), "muted");
      tabCompletionSignature = "";
    } else {
      tabCompletionSignature = originalSignature;
    }
  }

  function updatePrompt() {
    const path = displayPath();
    if (terminalPath) terminalPath.textContent = path;
    if (terminalTitlePath) terminalTitlePath.textContent = path;
  }

  function echoCommand(command) {
    const line = document.createElement("div");
    line.className = "terminal-line-output command-echo";
    line.innerHTML = `<span class="prompt-user">christian@portfolio</span>:<span class="prompt-path">${displayPath()}</span>$ `;
    line.appendChild(document.createTextNode(command));
    terminalOutput.appendChild(line);
  }

  function readFile(path, command) {
    const resolved = normalizePath(path);
    const type = entryType(resolved);
    if (!type) {
      writeLine(`${command}: ${path}: No such file or directory`, "error");
      return null;
    }
    if (type === "directory") {
      writeLine(`${command}: ${path}: Is a directory`, "error");
      return null;
    }
    return files[resolved];
  }

  function listDirectory(args) {
    const flags = args.filter((arg) => arg.startsWith("-")).join("");
    const target = args.find((arg) => !arg.startsWith("-")) || ".";
    const resolved = normalizePath(target);
    const type = entryType(resolved);
    if (!type) {
      writeLine(`ls: cannot access '${target}': No such file or directory`, "error");
      return;
    }
    if (type === "file") {
      writeLine(resolved.split("/").pop());
      return;
    }

    const entries = directories[resolved];
    if (flags.includes("l")) {
      const rows = entries.map((entry) => {
        const child = resolved === "/" ? `/${entry}` : `${resolved}/${entry}`;
        const directory = entryType(child) === "directory";
        return `${directory ? "d" : "-"}rw${directory ? "x" : "-"}r-xr-x  1 christian dev  ${String(directory ? 4096 : files[child].length).padStart(5, " ")}  ${entry}${directory ? "/" : ""}`;
      });
      if (flags.includes("a")) rows.unshift("drwxr-xr-x  1 christian dev   4096  ./", "drwxr-xr-x  1 christian dev   4096  ../");
      writeLine(rows.join("\n"));
    } else {
      writeLine(entries.map((entry) => {
        const child = resolved === "/" ? `/${entry}` : `${resolved}/${entry}`;
        return `${entry}${entryType(child) === "directory" ? "/" : ""}`;
      }).join("  "));
    }
  }

  function changeDirectory(target = "~") {
    const destination = target === "-" ? previousDirectory : normalizePath(target);
    const type = entryType(destination);
    if (!type) {
      writeLine(`cd: ${target}: No such file or directory`, "error");
      return;
    }
    if (type !== "directory") {
      writeLine(`cd: ${target}: Not a directory`, "error");
      return;
    }
    previousDirectory = currentDirectory;
    currentDirectory = destination;
    updatePrompt();
    if (target === "-") writeLine(displayPath());
  }

  function createVirtualDirectory(args) {
    const recursive = args.includes("-p");
    const targets = args.filter((arg) => !arg.startsWith("-"));
    if (!targets.length) {
      writeLine("mkdir: missing operand", "error");
      return;
    }

    targets.forEach((target) => {
      const resolved = normalizePath(target);
      if (entryType(resolved)) {
        if (!recursive) writeLine(`mkdir: cannot create directory '${target}': File exists`, "error");
        return;
      }

      const segments = resolved.split("/").filter(Boolean);
      const paths = recursive
        ? segments.map((_, index) => `/${segments.slice(0, index + 1).join("/")}`)
        : [resolved];

      for (const path of paths) {
        if (entryType(path) === "file") {
          writeLine(`mkdir: cannot create directory '${target}': A file blocks the path`, "error");
          return;
        }
        if (entryType(path) === "directory") continue;
        const separator = path.lastIndexOf("/");
        const parent = path.slice(0, separator) || "/";
        const name = path.slice(separator + 1);
        if (entryType(parent) !== "directory") {
          writeLine(`mkdir: cannot create directory '${target}': No such file or directory`, "error");
          return;
        }
        directories[path] = [];
        if (!directories[parent].includes(name)) directories[parent].push(name);
        createdDirectories.add(path);
        deletedPaths.delete(path);
      }
    });
    saveFilesystemState();
  }

  function removeVirtualEntries(args) {
    const flags = args.filter((arg) => arg.startsWith("-")).join("");
    const recursive = flags.includes("r") || flags.includes("R");
    const force = flags.includes("f");
    const targets = args.filter((arg) => !arg.startsWith("-"));
    const protectedPaths = new Set(["/", "/home", homeDirectory]);

    if (!targets.length) {
      writeLine("rm: missing operand", "error");
      return;
    }

    targets.forEach((target) => {
      const resolved = normalizePath(target);
      const type = entryType(resolved);
      if (!type) {
        if (!force) writeLine(`rm: cannot remove '${target}': No such file or directory`, "error");
        return;
      }
      if (protectedPaths.has(resolved)) {
        writeLine(`rm: refusing to remove protected virtual path '${target}'`, "error");
        return;
      }
      if (type === "directory" && !recursive) {
        writeLine(`rm: cannot remove '${target}': Is a directory`, "error");
        return;
      }
      if (type === "directory" && (currentDirectory === resolved || currentDirectory.startsWith(`${resolved}/`))) {
        writeLine(`rm: cannot remove '${target}': Directory is currently in use`, "error");
        return;
      }

      if (type === "file") {
        delete files[resolved];
        delete fileOverrides[resolved];
        if (Object.hasOwn(builtInFiles, resolved)) deletedPaths.add(resolved);
      } else {
        Object.keys(builtInFiles)
          .filter((path) => path.startsWith(`${resolved}/`))
          .forEach((path) => deletedPaths.add(path));
        Object.keys(baseDirectories)
          .filter((path) => path === resolved || path.startsWith(`${resolved}/`))
          .forEach((path) => deletedPaths.add(path));
        Object.keys(files)
          .filter((path) => path.startsWith(`${resolved}/`))
          .forEach((path) => {
            delete files[path];
            delete fileOverrides[path];
          });
        Object.keys(directories)
          .filter((path) => path === resolved || path.startsWith(`${resolved}/`))
          .forEach((path) => {
            delete directories[path];
            createdDirectories.delete(path);
          });
      }

      const separator = resolved.lastIndexOf("/");
      const parent = resolved.slice(0, separator) || "/";
      const name = resolved.slice(separator + 1);
      if (directories[parent]) directories[parent] = directories[parent].filter((entry) => entry !== name);
    });
    saveFilesystemState();
  }

  function printFileEdge(command, args) {
    let count = 10;
    let fileName;
    if (args[0] === "-n") {
      count = Number.parseInt(args[1], 10);
      fileName = args[2];
    } else if (/^-\d+$/.test(args[0] || "")) {
      count = Number.parseInt(args[0].slice(1), 10);
      fileName = args[1];
    } else {
      fileName = args[0];
    }
    if (!fileName || !Number.isFinite(count) || count < 0) {
      writeLine(`usage: ${command} [-n lines] <file>`, "error");
      return;
    }
    const content = readFile(fileName, command);
    if (content === null) return;
    const lines = content.split("\n");
    writeLine((command === "head" ? lines.slice(0, count) : lines.slice(-count)).join("\n"));
  }

  function printTree(target = ".") {
    const resolved = normalizePath(target);
    const type = entryType(resolved);
    if (!type) {
      writeLine(`tree: ${target}: No such file or directory`, "error");
      return;
    }
    const rows = [displayPath(resolved)];
    let directoryCount = 0;
    let fileCount = 0;

    function walk(directory, prefix) {
      const entries = directories[directory];
      entries.forEach((entry, index) => {
        const child = `${directory}/${entry}`;
        const isLast = index === entries.length - 1;
        const directoryEntry = entryType(child) === "directory";
        rows.push(`${prefix}${isLast ? "└──" : "├──"} ${entry}${directoryEntry ? "/" : ""}`);
        if (directoryEntry) {
          directoryCount += 1;
          walk(child, `${prefix}${isLast ? "    " : "│   "}`);
        } else {
          fileCount += 1;
        }
      });
    }

    if (type === "directory") walk(resolved, "");
    else fileCount = 1;
    writeLine(rows.join("\n"));
    writeLine(`${directoryCount} directories, ${fileCount} files`, "muted");
  }

  const vimState = {
    path: "",
    originalContent: "",
    mode: "normal",
    dirty: false,
    undoStack: [],
    pendingKey: ""
  };

  function setVimMessage(message = "", type = "") {
    vimMessage.textContent = message;
    vimMessage.className = `vim-message${type ? ` is-${type}` : ""}`;
  }

  function vimCursorDetails() {
    const position = vimTextarea.selectionStart;
    const before = vimTextarea.value.slice(0, position);
    const lines = before.split("\n");
    return { line: lines.length, column: lines.at(-1).length + 1 };
  }

  function refreshVimDisplay() {
    const totalLines = Math.max(1, vimTextarea.value.split("\n").length);
    vimLineNumbers.textContent = Array.from({ length: totalLines }, (_, index) => index + 1).join("\n");
    vimLineNumbers.style.transform = `translateY(${-vimTextarea.scrollTop}px)`;
    const cursor = vimCursorDetails();
    vimPosition.textContent = `${cursor.line},${cursor.column}`;
    const name = vimState.path.split("/").pop() || "[No Name]";
    vimFileLabel.textContent = `${name}${vimState.dirty ? " [+]" : ""}`;
  }

  function pushVimUndo() {
    const snapshot = {
      value: vimTextarea.value,
      position: vimTextarea.selectionStart
    };
    const previous = vimState.undoStack.at(-1);
    if (!previous || previous.value !== snapshot.value) vimState.undoStack.push(snapshot);
    if (vimState.undoStack.length > 60) vimState.undoStack.shift();
  }

  function setVimMode(mode, recordUndo = true) {
    vimState.mode = mode;
    vimState.pendingKey = "";
    vimEditor.dataset.mode = mode;
    vimModeLabel.textContent = mode.toUpperCase();
    vimCommandRow.hidden = mode !== "command";

    if (mode === "insert") {
      if (recordUndo) pushVimUndo();
      vimTextarea.readOnly = false;
      setVimMessage("-- INSERT --");
      vimTextarea.focus();
    } else if (mode === "command") {
      vimTextarea.readOnly = true;
      vimCommandInput.value = "";
      setVimMessage("Enter :w, :q, :wq, or :q!");
      vimCommandInput.focus();
    } else {
      vimTextarea.readOnly = true;
      setVimMessage("");
      vimTextarea.focus();
    }
    refreshVimDisplay();
  }

  function openVim(path) {
    if (!path) {
      writeLine("vim: missing file operand", "error");
      writeLine("usage: vim <file>", "muted");
      return;
    }
    const resolved = normalizePath(path);
    if (entryType(resolved) === "directory") {
      writeLine(`vim: ${path}: Is a directory`, "error");
      return;
    }
    const separator = resolved.lastIndexOf("/");
    const parent = resolved.slice(0, separator) || "/";
    const name = resolved.slice(separator + 1);
    if (!name || entryType(parent) !== "directory") {
      writeLine(`vim: ${path}: Parent directory does not exist`, "error");
      return;
    }

    vimState.path = resolved;
    vimState.originalContent = files[resolved] || "";
    vimState.dirty = false;
    vimState.undoStack = [];
    vimTextarea.value = vimState.originalContent;
    vimTextarea.scrollTop = 0;
    vimTextarea.setSelectionRange(0, 0);
    terminalScreen.hidden = true;
    terminalFooter.hidden = true;
    terminalQuickCommands.hidden = true;
    vimEditor.hidden = false;
    document.body.classList.add("vim-active");
    setVimMode("normal");
    setVimMessage(files[resolved] === undefined ? `"${name}" [New File]` : `"${name}" ${vimTextarea.value.split("\n").length}L`);
  }

  function closeVim(message = "") {
    vimEditor.hidden = true;
    terminalScreen.hidden = false;
    terminalFooter.hidden = false;
    terminalQuickCommands.hidden = false;
    document.body.classList.remove("vim-active");
    if (message) writeLine(message, "success");
    terminalInput.focus();
    scrollToLatest();
  }

  function saveVimFile() {
    const persisted = persistVirtualFile(vimState.path, vimTextarea.value);
    vimState.originalContent = vimTextarea.value;
    vimState.dirty = false;
    refreshVimDisplay();
    const name = vimState.path.split("/").pop();
    setVimMessage(
      persisted
        ? `"${name}" written to browser-local storage`
        : `"${name}" saved for this session; persistent browser storage is unavailable`,
      "success"
    );
  }

  function runVimCommand(rawCommand) {
    const command = rawCommand.trim().replace(/^:/, "");
    switch (command) {
      case "w":
        setVimMode("normal");
        saveVimFile();
        break;
      case "wq":
      case "x":
        saveVimFile();
        closeVim(`"${vimState.path.split("/").pop()}" saved.`);
        break;
      case "q":
        if (vimState.dirty) {
          setVimMode("normal");
          setVimMessage("E37: No write since last change (add ! to override)", "error");
        } else {
          closeVim();
        }
        break;
      case "q!":
        closeVim("Changes discarded.");
        break;
      case "help":
        setVimMode("normal");
        setVimMessage("NORMAL: i/a/o edit · h/j/k/l move · dd delete line · x delete char · u undo · : commands");
        break;
      default:
        setVimMode("normal");
        setVimMessage(`E492: Not an editor command: ${command}`, "error");
    }
  }

  function vimLineBounds(position = vimTextarea.selectionStart) {
    const value = vimTextarea.value;
    const start = value.lastIndexOf("\n", Math.max(0, position - 1)) + 1;
    const newline = value.indexOf("\n", position);
    return { start, end: newline === -1 ? value.length : newline };
  }

  function moveVimCursorHorizontal(delta) {
    const next = Math.max(0, Math.min(vimTextarea.value.length, vimTextarea.selectionStart + delta));
    vimTextarea.setSelectionRange(next, next);
    refreshVimDisplay();
  }

  function moveVimCursorVertical(delta) {
    const value = vimTextarea.value;
    const position = vimTextarea.selectionStart;
    const current = vimLineBounds(position);
    const column = position - current.start;
    let targetStart;
    let targetEnd;

    if (delta < 0) {
      if (current.start === 0) return;
      targetEnd = current.start - 1;
      targetStart = value.lastIndexOf("\n", Math.max(0, targetEnd - 1)) + 1;
    } else {
      if (current.end === value.length) return;
      targetStart = current.end + 1;
      const newline = value.indexOf("\n", targetStart);
      targetEnd = newline === -1 ? value.length : newline;
    }
    const next = Math.min(targetStart + column, targetEnd);
    vimTextarea.setSelectionRange(next, next);
    refreshVimDisplay();
  }

  function openVimLineBelow() {
    pushVimUndo();
    const bounds = vimLineBounds();
    const hasFollowingLine = bounds.end < vimTextarea.value.length;
    const insertionPoint = hasFollowingLine ? bounds.end + 1 : bounds.end;
    vimTextarea.value =
      vimTextarea.value.slice(0, insertionPoint) +
      "\n" +
      vimTextarea.value.slice(insertionPoint);
    const next = hasFollowingLine ? insertionPoint : insertionPoint + 1;
    vimTextarea.setSelectionRange(next, next);
    vimState.dirty = vimTextarea.value !== vimState.originalContent;
    setVimMode("insert", false);
  }

  function deleteVimLine() {
    pushVimUndo();
    const value = vimTextarea.value;
    const bounds = vimLineBounds();
    let start = bounds.start;
    let end = bounds.end;
    if (end < value.length) end += 1;
    else if (start > 0) start -= 1;
    vimTextarea.value = value.slice(0, start) + value.slice(end);
    const next = Math.min(start, vimTextarea.value.length);
    vimTextarea.setSelectionRange(next, next);
    vimState.dirty = vimTextarea.value !== vimState.originalContent;
    setVimMessage("1 line deleted");
    refreshVimDisplay();
  }

  function deleteVimCharacter() {
    const position = vimTextarea.selectionStart;
    if (position >= vimTextarea.value.length) return;
    pushVimUndo();
    vimTextarea.value =
      vimTextarea.value.slice(0, position) +
      vimTextarea.value.slice(position + 1);
    vimTextarea.setSelectionRange(position, position);
    vimState.dirty = vimTextarea.value !== vimState.originalContent;
    refreshVimDisplay();
  }

  function undoVimChange() {
    const snapshot = vimState.undoStack.pop();
    if (!snapshot) {
      setVimMessage("Already at oldest change");
      return;
    }
    vimTextarea.value = snapshot.value;
    const position = Math.min(snapshot.position, vimTextarea.value.length);
    vimTextarea.setSelectionRange(position, position);
    vimState.dirty = vimTextarea.value !== vimState.originalContent;
    setVimMessage("Undo complete");
    refreshVimDisplay();
  }

  function printHelp() {
    writeLine("LINUX-BASED PORTFOLIO TERMINAL", "accent");
    writeBlock(
      "This browser-based shell simulates practical Linux navigation, file management, text inspection, and editing inside a safe virtual filesystem.<br><br>" +
      "<strong>Portfolio</strong><br>" +
      "<span class='cyan'>about</span>       who I am and how I work<br>" +
      "<span class='cyan'>projects</span>    selected systems and applications<br>" +
      "<span class='cyan'>services</span>    solutions for businesses and clients<br>" +
      "<span class='cyan'>experience</span>  enterprise delivery and technical leadership<br>" +
      "<span class='cyan'>skills</span>      platform and application toolkit<br>" +
      "<span class='cyan'>contact</span>     open the project inquiry form<br><br>" +
      "<strong>Linux navigation &amp; files</strong><br>" +
      "<span class='pink'>pwd</span> / <span class='pink'>ls [-la]</span> / <span class='pink'>ll [path]</span> / <span class='pink'>cd &lt;directory&gt;</span> / <span class='pink'>mkdir [-p] &lt;directory&gt;</span><br>" +
      "<span class='pink'>vim &lt;file&gt;</span> / <span class='pink'>cat &lt;file&gt;</span> / <span class='pink'>head</span> / <span class='pink'>tail</span> / <span class='pink'>tree</span><br>" +
      "<span class='pink'>find</span> / <span class='pink'>grep</span> / <span class='pink'>wc</span> / <span class='pink'>rm &lt;file&gt;</span> / <span class='pink'>rm -rf &lt;directory&gt;</span><br><br>" +
      "<strong>Shell utilities</strong><br>" +
      "<span class='pink'>whoami</span> / <span class='pink'>history</span> / <span class='pink'>echo</span> / <span class='pink'>date</span> / <span class='pink'>clear</span> / <span class='pink'>man &lt;command&gt;</span><br>" +
      "<span class='pink'>open &lt;target&gt;</span> / <span class='pink'>reset-fs</span><br><br>" +
      "<strong>Completion</strong><br>" +
      "Press <span class='cyan'>TAB</span> to complete commands, options, files, and folders. Press it again to list multiple matches.<br><br>" +
      "<strong>Try for fun</strong><br>" +
      "<span class='pink'>neofetch</span> / <span class='pink'>matrix</span> / <span class='pink'>fortune</span> / <span class='pink'>sudo hire christian</span>"
    );
  }

  function printProjects() {
    writeLine("SELECTED WORK / 5 RESULTS", "accent");
    writeBlock(
      "<strong>01  Enterprise Delivery Automation</strong> <span class='pink'>PLATFORM ENGINEERING</span><br>" +
      "Reusable automation for faster feedback, consistent outputs, and repeatable releases.<br><br>" +
      "<strong>02  CalCounter</strong> <span class='pink'>ELECTRON / USDA API</span><br>" +
      "Local-first nutrition tracking desktop application. <a href='posts/calcounter.html'>case study &nearr;</a><br><br>" +
      "<strong>03  Code Metrics Modernization</strong> <span class='pink'>PYTHON / LINUX</span><br>" +
      "Linux migration and automated metrics workflows.<br><br>" +
      "<strong>04  CasinoBlackJack</strong> <span class='pink'>GAME DEVELOPMENT</span> &nbsp;<a href='https://rockcm.github.io/CasinoBlackJack/' target='_blank' rel='noreferrer'>open &nearr;</a><br>" +
      "<strong>05  UFC Fight Predictor</strong> <span class='pink'>FASTAPI / REACT</span> &nbsp;<a href='https://github.com/rockcm/UFCFightPredictor' target='_blank' rel='noreferrer'>source &nearr;</a>"
    );
    writeLine("Tip: use `open calcounter`, `open blackjack`, `open ufc`, or `open work`.", "muted");
  }

  function openDestination(target) {
    const key = target.toLowerCase();
    const destination = destinations[key];
    if (!destination) {
      writeLine(`open: '${target || ""}' is not a known target`, "error");
      writeLine(`Available: ${Object.keys(destinations).join(", ")}`, "muted");
      return;
    }
    writeLine(`Opening ${key}…`, "success");
    if (/^https?:/.test(destination)) {
      window.open(destination, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = destination;
    }
  }

  function executeCommand(rawCommand) {
    const trimmed = rawCommand.trim();
    echoCommand(rawCommand);
    if (!trimmed) return;

    commandHistory.push(trimmed);
    historyPosition = commandHistory.length;
    const tokens = parseShellTokens(trimmed);
    const [command, ...args] = tokens;
    const argument = args.join(" ");

    switch (command.toLowerCase()) {
      case "help":
        printHelp();
        break;
      case "about":
        writeBlock(
          "<strong>Christian Rock</strong> builds the systems that ship software and the applications that solve real business problems.<br><br>" +
          "The work spans enterprise delivery platforms, practical automation, custom business software, websites, and internal tools."
        );
        break;
      case "projects":
        printProjects();
        break;
      case "services":
        writeLine("SMALL-BUSINESS & CLIENT SERVICES", "accent");
        writeBlock(
          "<strong>01  Custom business software</strong><br>Applications and internal tools shaped around the way your business actually operates.<br><br>" +
          "<strong>02  Automation & integrations</strong><br>Connected workflows that remove repetitive work and prevent avoidable errors.<br><br>" +
          "<strong>03  Websites & digital presence</strong><br>Fast, responsive sites with a clear message and an easy customer next step."
        );
        break;
      case "skills":
        writeLine("PLATFORM & DELIVERY", "accent");
        writeLine("AWS  OpenShift  Nexus  Jenkins  Linux  Git  Docker  GitHub Actions");
        writeLine("APPLICATIONS", "accent");
        writeLine("Python  C#  .NET  JavaScript  React  Blazor  FastAPI  Electron  SQL  REST APIs");
        writeLine("ENGINEERING PRACTICE", "accent");
        writeLine("Automation  System Design  Configuration  Technical Leadership  Mentoring");
        break;
      case "experience":
        writeBlock(
          "<strong>ENTERPRISE SOFTWARE DEVELOPER</strong><br>" +
          "Designed reusable build and release automation for a large application portfolio, improving pull-request feedback, artifact consistency, configuration management, and repeatable delivery.<br><br>" +
          "Also provided technical leadership and mentoring for internal automation work."
        );
        break;
      case "contact":
        openDestination("contact");
        break;
      case "neofetch":
        writeLine(
          "      ██████╗ ██████╗      christian@portfolio\n" +
          "     ██╔════╝ ██╔══██╗     -------------------\n" +
          "     ██║      ██████╔╝     Role: Developer / Tech Lead\n" +
          "     ██║      ██╔══██╗     Focus: Delivery + Business Apps\n" +
          "     ╚██████╗ ██║  ██║     Platform: OpenShift / AWS / Linux\n" +
          "      ╚═════╝ ╚═╝  ╚═╝     Status: Available for projects",
          "accent"
        );
        break;
      case "ls":
        listDirectory(args);
        break;
      case "ll":
        listDirectory(["-la", ...args]);
        break;
      case "cd":
        changeDirectory(argument || "~");
        break;
      case "mkdir":
        createVirtualDirectory(args);
        break;
      case "rm":
        removeVirtualEntries(args);
        break;
      case "pwd":
        writeLine(currentDirectory);
        break;
      case "whoami":
        writeLine("christian — developer, automation builder, technical lead, and practical problem solver");
        break;
      case "cat":
        if (!args.length) writeLine("cat: missing file operand", "error");
        args.forEach((path) => {
          const content = readFile(path, "cat");
          if (content !== null) writeLine(content);
        });
        break;
      case "head":
      case "tail":
        printFileEdge(command.toLowerCase(), args);
        break;
      case "tree":
        printTree(argument || ".");
        break;
      case "find": {
        const nameIndex = args.indexOf("-name");
        const root = nameIndex > 0 ? args[0] : ".";
        const pattern = nameIndex >= 0 ? args[nameIndex + 1] : "*";
        const resolvedRoot = normalizePath(root);
        if (entryType(resolvedRoot) !== "directory") {
          writeLine(`find: '${root}': No such directory`, "error");
          break;
        }
        const expression = new RegExp(`^${(pattern || "*").replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".")}$`);
        const matches = Object.keys(files)
          .filter((path) => path.startsWith(`${resolvedRoot}/`) && expression.test(path.split("/").pop()))
          .map((path) => `.${path.slice(resolvedRoot.length)}`);
        writeLine(matches.join("\n") || `find: no files matched '${pattern}'`, matches.length ? "" : "muted");
        break;
      }
      case "grep": {
        const insensitive = args[0] === "-i";
        const pattern = args[insensitive ? 1 : 0];
        const fileName = args[insensitive ? 2 : 1];
        if (!pattern || !fileName) {
          writeLine("usage: grep [-i] <pattern> <file>", "error");
          break;
        }
        const content = readFile(fileName, "grep");
        if (content === null) break;
        const matches = content.split("\n").filter((line) =>
          insensitive ? line.toLowerCase().includes(pattern.toLowerCase()) : line.includes(pattern)
        );
        writeLine(matches.join("\n") || `grep: no matches for '${pattern}'`, matches.length ? "" : "muted");
        break;
      }
      case "wc": {
        const flag = args[0]?.startsWith("-") ? args.shift() : "";
        const fileName = args[0];
        if (!fileName) {
          writeLine("usage: wc [-l|-w|-c] <file>", "error");
          break;
        }
        const content = readFile(fileName, "wc");
        if (content === null) break;
        const counts = {
          lines: content.split("\n").length,
          words: content.trim() ? content.trim().split(/\s+/).length : 0,
          characters: content.length
        };
        const output = flag === "-l" ? counts.lines : flag === "-w" ? counts.words : flag === "-c" ? counts.characters : `${counts.lines} ${counts.words} ${counts.characters}`;
        writeLine(`${output} ${fileName}`);
        break;
      }
      case "man": {
        const pages = {
          cd: "cd [directory] — change the virtual working directory. Supports .., ~, absolute paths, and cd -.",
          ls: "ls [-la] [path] — list virtual files. -l uses long format; -a includes . and .. entries.",
          ll: "ll [path] — display a detailed directory listing, including hidden entries. Equivalent to ls -la.",
          cat: "cat <file> — print an entire virtual file.",
          head: "head [-n count] <file> — print the first 10 lines, or the requested count.",
          tail: "tail [-n count] <file> — print the last 10 lines, or the requested count.",
          tree: "tree [path] — recursively display the virtual directory structure.",
          find: "find [path] -name <pattern> — locate virtual files using * and ? wildcards.",
          grep: "grep [-i] <pattern> <file> — print matching lines; -i ignores case.",
          wc: "wc [-l|-w|-c] <file> — count lines, words, or characters.",
          vim: "vim <file> — create or edit a browser-local virtual file. Use i to insert and :wq to save and quit.",
          mkdir: "mkdir [-p] <directory> — create one or more browser-local virtual directories.",
          rm: "rm [-f] <file> or rm -rf <directory> — delete virtual entries. Core shell roots are protected.",
          "reset-fs": "reset-fs — discard all browser-local edits, files, folders, and deletions; restore the original portfolio filesystem.",
          matrix: "matrix [on|off|status] — control the decorative code-rain background on larger screens."
        };
        if (!argument) writeLine(`What manual page do you want?\nAvailable: ${Object.keys(pages).join(", ")}`, "muted");
        else writeLine(pages[argument.toLowerCase()] || `No manual entry for ${argument}`, pages[argument.toLowerCase()] ? "info" : "error");
        break;
      }
      case "open":
        openDestination(argument);
        break;
      case "history":
        commandHistory.forEach((entry, index) => writeLine(`${String(index + 1).padStart(3, " ")}  ${entry}`));
        break;
      case "echo":
        writeLine(argument);
        break;
      case "date":
        writeLine(new Date().toString());
        break;
      case "clear":
        terminalOutput.replaceChildren();
        break;
      case "vim":
        openVim(argument);
        break;
      case "reset-fs":
        resetVirtualFilesystem();
        currentDirectory = homeDirectory;
        previousDirectory = homeDirectory;
        updatePrompt();
        writeLine("Virtual filesystem restored to its original state.", "success");
        break;
      case "matrix":
        {
        const matrixMode = argument.toLowerCase();
        if (matrixMode === "status") {
          writeLine(`Matrix background: ${document.body.classList.contains("matrix-boost") ? "amplified" : "normal"}.`, "info");
        } else {
          const enable = matrixMode === "on" || (!matrixMode && !document.body.classList.contains("matrix-boost"));
          if (matrixMode === "off" || enable) document.body.classList.toggle("matrix-boost", enable);
          if (matrixMode && !["on", "off"].includes(matrixMode)) {
            writeLine("usage: matrix [on|off|status]", "error");
            break;
          }
          const hidden = getComputedStyle(document.getElementById("matrix-bg")).display === "none";
          writeLine(
            hidden
              ? "Matrix rain is disabled on this screen size or by reduced-motion settings."
              : `Matrix rain ${document.body.classList.contains("matrix-boost") ? "amplified" : "returned to normal"}. This only changes the decorative background.`,
            hidden ? "muted" : "success"
          );
        }
        }
        break;
      case "fortune":
        writeLine(fortunes[Math.floor(Math.random() * fortunes.length)], "success");
        break;
      case "sudo":
        if (argument.toLowerCase() === "hire christian") {
          writeLine("Permission granted. Excellent decision.", "success");
          writeLine("Run `contact` to open a secure project channel.", "accent");
        } else {
          writeLine("christian is not in the sudoers file. This incident will be documented.", "error");
        }
        break;
      case "exit":
        writeLine("Session preserved. <a href='index.html'>Return to the homepage &nearr;</a>", "success", true);
        break;
      default:
        writeLine(`${command}: command not found`, "error");
        writeLine("Type `help` for available commands.", "muted");
    }
  }

  terminalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const command = terminalInput.value;
    terminalInput.value = "";
    executeCommand(command);
    scrollToLatest();
  });

  terminalInput.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") tabCompletionSignature = "";
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (historyPosition > 0) historyPosition -= 1;
      terminalInput.value = commandHistory[historyPosition] || "";
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyPosition < commandHistory.length) historyPosition += 1;
      terminalInput.value = commandHistory[historyPosition] || "";
    } else if (event.key === "Tab") {
      event.preventDefault();
      completeTerminalInput();
    } else if (event.key.toLowerCase() === "l" && event.ctrlKey) {
      event.preventDefault();
      terminalOutput.replaceChildren();
    }
  });

  vimTextarea.addEventListener("input", () => {
    vimState.dirty = vimTextarea.value !== vimState.originalContent;
    refreshVimDisplay();
  });

  vimTextarea.addEventListener("scroll", refreshVimDisplay);
  vimTextarea.addEventListener("click", refreshVimDisplay);
  vimTextarea.addEventListener("keyup", (event) => {
    if (vimState.mode === "insert" && !["Escape", "Tab"].includes(event.key)) refreshVimDisplay();
  });

  vimTextarea.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key.toLowerCase() === "s") {
      event.preventDefault();
      saveVimFile();
      return;
    }

    if (vimState.mode === "insert") {
      if (event.key === "Escape") {
        event.preventDefault();
        setVimMode("normal");
      } else if (event.key === "Tab") {
        event.preventDefault();
        const start = vimTextarea.selectionStart;
        const end = vimTextarea.selectionEnd;
        vimTextarea.setRangeText("  ", start, end, "end");
        vimState.dirty = vimTextarea.value !== vimState.originalContent;
        refreshVimDisplay();
      }
      return;
    }

    if (vimState.mode !== "normal") return;
    const key = event.key;
    const handledKeys = [
      "i", "a", "o", "h", "j", "k", "l", "ArrowLeft", "ArrowDown", "ArrowUp",
      "ArrowRight", "d", "u", "x", ":", "0", "$", "g", "G", "Escape"
    ];
    if (handledKeys.includes(key)) event.preventDefault();

    if (key === "d") {
      if (vimState.pendingKey === "d") {
        vimState.pendingKey = "";
        deleteVimLine();
      } else {
        vimState.pendingKey = "d";
        setVimMessage("d");
      }
      return;
    }
    if (key === "g") {
      if (vimState.pendingKey === "g") {
        vimState.pendingKey = "";
        vimTextarea.setSelectionRange(0, 0);
        refreshVimDisplay();
      } else {
        vimState.pendingKey = "g";
        setVimMessage("g");
      }
      return;
    }

    vimState.pendingKey = "";
    switch (key) {
      case "i":
        setVimMode("insert");
        break;
      case "a":
        moveVimCursorHorizontal(1);
        setVimMode("insert");
        break;
      case "o":
        openVimLineBelow();
        break;
      case "h":
      case "ArrowLeft":
        moveVimCursorHorizontal(-1);
        break;
      case "l":
      case "ArrowRight":
        moveVimCursorHorizontal(1);
        break;
      case "j":
      case "ArrowDown":
        moveVimCursorVertical(1);
        break;
      case "k":
      case "ArrowUp":
        moveVimCursorVertical(-1);
        break;
      case "0": {
        const bounds = vimLineBounds();
        vimTextarea.setSelectionRange(bounds.start, bounds.start);
        refreshVimDisplay();
        break;
      }
      case "$": {
        const bounds = vimLineBounds();
        vimTextarea.setSelectionRange(bounds.end, bounds.end);
        refreshVimDisplay();
        break;
      }
      case "G":
        vimTextarea.setSelectionRange(vimTextarea.value.length, vimTextarea.value.length);
        refreshVimDisplay();
        break;
      case "u":
        undoVimChange();
        break;
      case "x":
        deleteVimCharacter();
        break;
      case ":":
        setVimMode("command");
        break;
      case "Escape":
        setVimMessage("");
        break;
    }
  });

  vimCommandForm.addEventListener("submit", (event) => {
    event.preventDefault();
    runVimCommand(vimCommandInput.value);
  });

  vimCommandInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setVimMode("normal");
    }
  });

  vimActionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      switch (button.dataset.vimAction) {
        case "escape":
          setVimMode("normal");
          break;
        case "insert":
          setVimMode("insert");
          break;
        case "command":
          setVimMode("command");
          break;
        case "undo":
          undoVimChange();
          break;
        case "save":
          saveVimFile();
          break;
        case "quit":
          runVimCommand("q");
          break;
      }
    });
  });

  terminalScreen.addEventListener("click", () => terminalInput.focus());
  quickCommands.forEach((button) => {
    button.addEventListener("click", () => {
      executeCommand(button.dataset.runCommand);
      terminalInput.focus();
    });
  });

  writeLine("Christian.dev interactive shell v1.0.0", "accent");
  writeLine("Portfolio session established. No real system commands are executed.", "muted");
  writeLine("Type `help` to begin, or choose a suggested command below.", "success");
  writeLine();
  updatePrompt();
  terminalInput.focus();
}
