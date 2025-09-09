# Merge Conflict Resolution Guide
## Collaborative AI Platform

### 🚨 Quick Reference

#### **When Conflicts Occur:**
```bash
# Check status
git status

# See conflicts
git diff --name-only --diff-filter=U

# Resolve conflicts
./scripts/resolve-conflicts.sh
```

#### **Common Conflict Scenarios:**

1. **Frontend Component Conflicts**
   - Multiple developers modify same React component
   - Import statement conflicts
   - State management conflicts

2. **Backend API Conflicts**
   - Route definition conflicts
   - Middleware order conflicts
   - Database schema conflicts

3. **Configuration Conflicts**
   - Package.json dependency conflicts
   - Environment variable conflicts
   - Build configuration conflicts

### 🔧 Resolution Strategies

#### **Strategy 1: Manual Resolution (Recommended)**
```bash
# 1. Identify conflicts
git status

# 2. Open conflicted files
code src/App.jsx  # VS Code shows conflict UI

# 3. Resolve by choosing:
#    - Accept Current Change
#    - Accept Incoming Change  
#    - Accept Both Changes
#    - Manual combination

# 4. Stage resolved files
git add src/App.jsx

# 5. Complete merge
git commit -m "Resolve merge conflict in App.jsx"
```

#### **Strategy 2: Using Git Merge Tool**
```bash
# Configure VS Code as merge tool
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

# Launch merge tool
git mergetool
```

#### **Strategy 3: Rebase Instead of Merge**
```bash
# Cleaner history, but more complex
git rebase origin/main

# Resolve conflicts during rebase
# Then continue
git rebase --continue
```

### 📋 Step-by-Step Process

#### **Step 1: Preparation**
```bash
# Always start with clean working directory
git status

# If you have uncommitted changes, stash them
git stash

# Pull latest changes
git pull origin main
```

#### **Step 2: Identify Conflicts**
```bash
# Check for conflicts
git status

# See which files have conflicts
git diff --name-only --diff-filter=U
```

#### **Step 3: Resolve Each File**

**For React/JSX files:**
```javascript
// Look for conflict markers:
<<<<<<< HEAD
// Your changes
const [state, setState] = useState();
=======
// Their changes
const [state, setState] = useState(initialValue);
>>>>>>> feature-branch

// Resolve by choosing or combining:
const [state, setState] = useState(initialValue);
```

**For CSS files:**
```css
/* Conflict markers: */
<<<<<<< HEAD
.sidebar { width: 320px; }
=======
.sidebar { width: 384px; }
>>>>>>> feature-branch

/* Resolve: */
.sidebar { width: 384px; } /* Keep the wider sidebar */
```

**For JSON files (package.json):**
```json
{
  "dependencies": {
    "react": "^19.1.1",
    "express": "^5.1.0",
    "uuid": "^9.0.1"
  }
}
// Usually safe to merge both dependency lists
```

#### **Step 4: Test Resolution**
```bash
# Install dependencies if package.json changed
npm install

# Run tests
npm test

# Build project
npm run build

# Start development server
npm run dev
```

#### **Step 5: Complete Merge**
```bash
# Stage all resolved files
git add .

# Commit the merge
git commit -m "Resolve merge conflicts

- Combined user authentication and project management features
- Updated sidebar width to 384px
- Merged package.json dependencies
- Tested all functionality"
```

### 🛠️ Tools and Commands

#### **Git Commands**
```bash
# Check conflict status
git status

# See detailed conflicts
git diff

# Abort merge (start over)
git merge --abort

# Continue after resolving
git add .
git commit

# Use merge tool
git mergetool

# Rebase instead of merge
git rebase origin/main
```

#### **VS Code Integration**
- **Conflict Resolution UI**: Automatically shows when conflicts detected
- **Side-by-side View**: Compare changes easily
- **Accept/Reject Buttons**: Quick resolution options
- **Syntax Highlighting**: Better visibility of conflict markers

#### **Command Line Tools**
```bash
# Our custom conflict resolution script
./scripts/resolve-conflicts.sh

# Check for conflicts
git diff --check

# See merge base
git merge-base HEAD origin/main
```

### 🚨 Emergency Procedures

#### **If Resolution Gets Too Complex:**
```bash
# Abort the merge
git merge --abort

# Try rebase instead
git rebase origin/main

# Or reset to clean state
git reset --hard origin/main
git pull origin main
```

#### **If You Accidentally Commit Conflicts:**
```bash
# Undo last commit (if not pushed)
git reset --soft HEAD~1

# Or amend the commit
git commit --amend
```

### 📚 Best Practices

#### **Prevention:**
1. **Regular Syncing**: Pull changes frequently
2. **Feature Branches**: Work in isolated branches
3. **Small Commits**: Make focused, atomic commits
4. **Communication**: Coordinate with team members

#### **During Resolution:**
1. **Understand Changes**: Read both versions carefully
2. **Test Thoroughly**: Always test after resolution
3. **Document Decisions**: Explain resolution in commit message
4. **Get Review**: Have team member review complex resolutions

#### **After Resolution:**
1. **Run Full Test Suite**: Ensure nothing is broken
2. **Deploy to Staging**: Test in staging environment
3. **Monitor**: Watch for issues in production
4. **Learn**: Document lessons for future conflicts

### 🔍 Common Conflict Patterns in Our Project

#### **Frontend Conflicts:**
- **Component State**: Multiple developers adding state
- **Styling**: Tailwind class conflicts
- **Routing**: Navigation structure changes
- **API Integration**: Different API endpoints

#### **Backend Conflicts:**
- **Route Definitions**: API endpoint conflicts
- **Middleware**: Authentication/authorization order
- **Database Models**: Schema changes
- **Environment Variables**: Configuration conflicts

#### **Configuration Conflicts:**
- **Dependencies**: Package version conflicts
- **Build Tools**: Vite/Webpack configuration
- **Environment**: Development vs production settings

### 📞 Getting Help

#### **Team Communication:**
- **Slack/Discord**: Ask team members about their changes
- **Pull Request Comments**: Discuss conflicts in PR
- **Code Review**: Get second opinion on resolution

#### **Documentation:**
- **Git Documentation**: `git help merge`
- **VS Code Docs**: Conflict resolution features
- **Project README**: Team-specific guidelines

### 🎯 Quick Checklist

- [ ] Identify all conflicted files
- [ ] Understand what each change does
- [ ] Choose resolution strategy
- [ ] Resolve conflicts manually
- [ ] Test the resolution
- [ ] Stage resolved files
- [ ] Commit with descriptive message
- [ ] Push changes
- [ ] Monitor for issues

Remember: **When in doubt, ask for help!** It's better to get a second opinion than to break the build.
