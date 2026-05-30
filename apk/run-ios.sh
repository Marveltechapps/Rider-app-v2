#!/bin/bash

# Run the Expo app in the iOS Simulator with proper fallbacks.
# Usage: ./run-ios.sh [--native]
#   Default: expo start --ios (Expo Go / dev client)
#   --native: expo run:ios (builds native app, requires prebuild)

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Project directory: script in project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="${SCRIPT_DIR}"
cd "${PROJECT_DIR}"

USE_NATIVE=false
[ "$1" = "--native" ] && USE_NATIVE=true

echo -e "${GREEN}🍎 iOS Simulator – starting...${NC}"

# --- Helpers ---
command_exists() { command -v "$1" >/dev/null 2>&1; }

# --- 1. macOS only ---
if [ "$(uname)" != "Darwin" ]; then
    echo -e "${RED}❌ iOS Simulator is only available on macOS.${NC}"
    echo -e "${YELLOW}💡 On Linux/Windows use: npx expo start --web${NC}"
    exit 1
fi

# --- 2. Project root ---
if [ ! -f "${PROJECT_DIR}/package.json" ]; then
    echo -e "${RED}❌ package.json not found. Run this script from the project root.${NC}"
    exit 1
fi

# --- 3. Node/Bun ---
check_node() {
    if command_exists bun; then
        echo -e "${GREEN}✓ Bun: $(bun --version)${NC}"
        return 0
    fi
    if command_exists node; then
        echo -e "${GREEN}✓ Node: $(node --version)${NC}"
        return 0
    fi
    echo -e "${RED}❌ No Bun or Node.js found.${NC}"
    echo -e "${YELLOW}   Install: https://nodejs.org/ or https://bun.sh/${NC}"
    return 1
}
if ! check_node; then exit 1; fi

# --- 4. Dependencies ---
verify_critical() {
    for pkg in expo react react-native; do
        [ ! -d "${PROJECT_DIR}/node_modules/${pkg}" ] && return 1
    done
    return 0
}

install_deps() {
    echo -e "${YELLOW}📦 Checking dependencies...${NC}"
    if [ -d "${PROJECT_DIR}/node_modules" ] && [ "$(ls -A "${PROJECT_DIR}/node_modules" 2>/dev/null)" ] && verify_critical; then
        echo -e "${GREEN}✓ Dependencies OK${NC}"
        return 0
    fi
    echo -e "${YELLOW}📥 Installing dependencies...${NC}"
    if command_exists bun; then
        bun install || { npm install --legacy-peer-deps || return 1; }
    else
        npm install --legacy-peer-deps || return 1
    fi
    verify_critical || { echo -e "${RED}❌ Critical packages missing after install.${NC}"; return 1; }
    echo -e "${GREEN}✓ Dependencies installed${NC}"
    return 0
}
if ! install_deps; then
    echo -e "${RED}❌ Could not install dependencies.${NC}"
    exit 1
fi

# --- 5. Xcode & Simulator ---
check_xcode() {
    if ! command_exists xcrun; then
        echo -e "${RED}❌ Xcode command-line tools not found.${NC}"
        echo -e "${YELLOW}   Run: xcode-select --install${NC}"
        return 1
    fi
    if ! xcrun simctl list devices &>/dev/null; then
        echo -e "${RED}❌ Simulator not available (xcrun simctl failed).${NC}"
        echo -e "${YELLOW}   Install Xcode from the App Store and accept the license.${NC}"
        return 1
    fi
    echo -e "${GREEN}✓ Xcode / Simulator available${NC}"
    return 0
}

boot_simulator_if_needed() {
    local booted
    booted=$(xcrun simctl list devices | grep -c "(Booted)" || true)
    if [ "${booted}" -gt 0 ]; then
        echo -e "${GREEN}✓ Simulator already booted${NC}"
        return 0
    fi
    echo -e "${YELLOW}📱 No simulator booted. Booting one...${NC}"
    local udid
    # Prefer iPhone 16 / 15 / 14 (available in recent Xcode)
    udid=$(xcrun simctl list devices available | grep -E "iPhone (16|15|14)" | head -1 | grep -oE '\([A-F0-9-]+\)' | tr -d '()')
    if [ -z "${udid}" ]; then
        udid=$(xcrun simctl list devices available | grep "iPhone" | head -1 | grep -oE '\([A-F0-9-]+\)' | tr -d '()')
    fi
    if [ -z "${udid}" ]; then
        echo -e "${YELLOW}⚠️  No iPhone simulator found. Open Xcode → Window → Devices and Simulators to add one.${NC}"
        return 1
    fi
    xcrun simctl boot "${udid}" 2>/dev/null || true
    open -a Simulator
    echo -e "${BLUE}⏳ Waiting for Simulator to be ready (15s)...${NC}"
    sleep 15
    booted=$(xcrun simctl list devices | grep -c "(Booted)" || true)
    if [ "${booted}" -gt 0 ]; then
        echo -e "${GREEN}✓ Simulator booted${NC}"
        return 0
    fi
    echo -e "${YELLOW}⚠️  Simulator may still be starting. Continuing anyway.${NC}"
    return 0
}

if ! check_xcode; then
    echo -e "${YELLOW}💡 Falling back to web. Run: npx expo start --web${NC}"
    if command_exists bun; then bunx expo start --web; else npx expo start --web; fi
    exit 0
fi

if ! boot_simulator_if_needed; then
    echo -e "${YELLOW}⚠️  Could not boot simulator. You can still start Expo and press 'i' when a simulator is ready.${NC}"
fi

# --- 6. Run ---
run_expo_ios() {
    if command_exists bun; then
        bunx expo start --ios
    else
        npx expo start --ios
    fi
}

run_expo_native_ios() {
    if command_exists bun; then
        bunx expo run:ios
    else
        npx expo run:ios
    fi
}

echo -e "${BLUE}🚀 Starting Expo for iOS...${NC}"

if [ "${USE_NATIVE}" = true ]; then
    echo -e "${YELLOW}📦 Native build (expo run:ios)...${NC}"
    if ! run_expo_native_ios; then
        echo -e "${YELLOW}⚠️  Native run failed. Trying 'expo start --ios'...${NC}"
        run_expo_ios
    fi
else
    if ! run_expo_ios; then
        echo -e "${YELLOW}⚠️  expo start --ios failed (exit $?). Trying expo run:ios...${NC}"
        if ! run_expo_native_ios; then
            echo -e "${YELLOW}⚠️  run:ios failed. Starting Expo without platform; press 'i' in the terminal for iOS.${NC}"
            if command_exists bun; then bunx expo start; else npx expo start; fi
        fi
    fi
fi
