#!/bin/bash

# Merge Conflict Resolution Helper Script
# For Collaborative AI Platform

echo "🔧 Merge Conflict Resolution Helper"
echo "=================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository!"
    exit 1
fi

# Check for merge conflicts
CONFLICTS=$(git diff --name-only --diff-filter=U)

if [ -z "$CONFLICTS" ]; then
    echo "✅ No merge conflicts detected!"
    exit 0
fi

echo "⚠️  Merge conflicts detected in:"
echo "$CONFLICTS"
echo ""

# Function to resolve specific file types
resolve_file() {
    local file="$1"
    local extension="${file##*.}"
    
    case "$extension" in
        "js"|"jsx")
            echo "📝 Resolving JavaScript/React file: $file"
            # Add specific JS/React conflict resolution logic
            ;;
        "css")
            echo "🎨 Resolving CSS file: $file"
            # Add CSS conflict resolution logic
            ;;
        "json")
            echo "📋 Resolving JSON file: $file"
            # Add JSON conflict resolution logic
            ;;
        *)
            echo "📄 Resolving generic file: $file"
            ;;
    esac
}

# Process each conflicted file
echo "🔍 Analyzing conflicts..."
for file in $CONFLICTS; do
    resolve_file "$file"
done

echo ""
echo "📋 Next steps:"
echo "1. Open each conflicted file in your editor"
echo "2. Look for conflict markers: <<<<<<< ======= >>>>>>>"
echo "3. Choose which changes to keep or combine them"
echo "4. Remove conflict markers"
echo "5. Test your changes"
echo "6. Run: git add <resolved-files>"
echo "7. Run: git commit"
echo ""
echo "🛠️  Available tools:"
echo "- VS Code: code . (opens with conflict resolution UI)"
echo "- Git merge tool: git mergetool"
echo "- Manual editing: Remove conflict markers manually"
echo ""
echo "🧪 After resolution, run:"
echo "npm test && npm run build && npm run dev"
