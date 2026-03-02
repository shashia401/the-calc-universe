const { Octokit } = require("@octokit/rest");
const fs = require("fs");
const path = require("path");

async function main() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? "depl " + process.env.WEB_REPL_RENEWAL
    : null;

  const connectionSettings = await fetch(
    "https://" + hostname + "/api/v2/connection?include_secrets=true&connector_names=github",
    { headers: { Accept: "application/json", "X-Replit-Token": xReplitToken } }
  ).then((r) => r.json()).then((d) => d.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings?.settings?.oauth?.credentials?.access_token;
  const octokit = new Octokit({ auth: accessToken });
  const owner = "shashia401";
  const repo = "the-calc-universe";

  // Collect all files (respecting .gitignore-like patterns)
  const ignoreDirs = new Set(["node_modules", ".git", "dist", ".cache", ".local", ".config", ".upm", "__pycache__", ".replit.nix"]);
  const ignoreFiles = new Set([".replit"]);

  function collectFiles(dir, prefix = "") {
    let files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = prefix ? prefix + "/" + entry.name : entry.name;
      if (entry.isDirectory()) {
        if (ignoreDirs.has(entry.name) || entry.name.startsWith(".")) continue;
        files = files.concat(collectFiles(fullPath, relPath));
      } else {
        if (ignoreFiles.has(entry.name)) continue;
        if (entry.name.endsWith(".lock")) continue;
        files.push({ path: relPath, fullPath });
      }
    }
    return files;
  }

  const files = collectFiles("/home/runner/workspace");
  console.log(`Found ${files.length} files to push`);

  // Create blobs for all files
  const treeItems = [];
  let count = 0;
  for (const file of files) {
    try {
      const content = fs.readFileSync(file.fullPath);
      const isBinary = content.includes(0x00);
      
      const { data: blob } = await octokit.rest.git.createBlob({
        owner, repo,
        content: content.toString(isBinary ? "base64" : "utf-8"),
        encoding: isBinary ? "base64" : "utf-8",
      });
      
      treeItems.push({
        path: file.path,
        mode: "100644",
        type: "blob",
        sha: blob.sha,
      });
      count++;
      if (count % 50 === 0) console.log(`  Uploaded ${count}/${files.length} files...`);
    } catch (err) {
      console.error(`  Error uploading ${file.path}: ${err.message}`);
    }
  }
  console.log(`Uploaded ${count} blobs`);

  // Create tree
  const { data: tree } = await octokit.rest.git.createTree({
    owner, repo,
    tree: treeItems,
  });
  console.log(`Created tree: ${tree.sha}`);

  // Create commit
  const { data: commit } = await octokit.rest.git.createCommit({
    owner, repo,
    message: "Initial commit: The Calc Universe - 89+ free online calculators\n\nFull-featured calculator platform with 89 calculators across 6 categories:\n- Math, Health & Fitness, Financial, Conversion, Date & Time, Education\n- 100% client-side React + TypeScript SPA\n- SEO optimized with structured data, sitemap, Open Graph tags\n- Dark/light mode, responsive design, Framer Motion animations",
    tree: tree.sha,
  });
  console.log(`Created commit: ${commit.sha}`);

  // Update main branch ref
  try {
    await octokit.rest.git.updateRef({
      owner, repo,
      ref: "heads/main",
      sha: commit.sha,
      force: true,
    });
    console.log("Updated main branch");
  } catch (err) {
    // If main doesn't exist, try creating it
    try {
      await octokit.rest.git.createRef({
        owner, repo,
        ref: "refs/heads/main",
        sha: commit.sha,
      });
      console.log("Created main branch");
    } catch (err2) {
      console.error("Failed to create/update ref:", err2.message);
    }
  }

  console.log(`\nDone! View at: https://github.com/${owner}/${repo}`);
}

main().catch((e) => console.error("Fatal:", e.message));
