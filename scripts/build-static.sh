#!/usr/bin/env bash
# Build for static export (GitHub Pages)
# Temporarily moves "use server" action files out, builds, then restores them.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

ACTIONS_DIR="$PROJECT_DIR/src/app/server-actions"
BACKUP_DIR="$PROJECT_DIR/.server-actions-backup"

echo "Preparing static export build..."

# Back up server action files
mkdir -p "$BACKUP_DIR/safe-action" "$BACKUP_DIR/self-rolled"
mv "$ACTIONS_DIR/safe-action/actions.ts" "$BACKUP_DIR/safe-action/actions.ts"
mv "$ACTIONS_DIR/self-rolled/actions.ts" "$BACKUP_DIR/self-rolled/actions.ts"

# Create placeholder stubs (no "use server" directive)
cat > "$ACTIONS_DIR/safe-action/actions.ts" << 'EOF'
// Stub — server actions are replaced by client-side mocks in static export
export const addToCartAction = null;
export const submitContactAction = null;
EOF

cat > "$ACTIONS_DIR/self-rolled/actions.ts" << 'EOF'
// Stub — server actions are replaced by client-side mocks in static export
export const addToCartAction = null;
export const submitContactAction = null;
EOF

# Build
NEXT_PUBLIC_STATIC_EXPORT=true npx next build
BUILD_STATUS=$?

# Restore original action files
mv "$BACKUP_DIR/safe-action/actions.ts" "$ACTIONS_DIR/safe-action/actions.ts"
mv "$BACKUP_DIR/self-rolled/actions.ts" "$ACTIONS_DIR/self-rolled/actions.ts"
rm -rf "$BACKUP_DIR"

if [ $BUILD_STATUS -eq 0 ]; then
  echo ""
  echo "Static export complete! Output in 'out/' directory."
  echo "Deploy with: gh-pages, Netlify, or push to GitHub Pages."
else
  echo ""
  echo "Build failed with status $BUILD_STATUS"
  exit $BUILD_STATUS
fi
