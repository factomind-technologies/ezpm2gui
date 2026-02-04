#!/bin/bash
set -e

echo "================================================================================"
echo "Installing client dependencies..."
cd src/client
pnpm install

echo "================================================================================"
echo "Building client..."
pnpm run build

echo "================================================================================"
echo "Installing server dependencies..."
cd ../..
pnpm install

echo "================================================================================"
echo "Building server..."
pnpm run build

echo ""
echo "======================================"
echo "Installation complete!"
echo ""
echo "To start the application, run:"
echo "pnpm start"
echo "======================================="
