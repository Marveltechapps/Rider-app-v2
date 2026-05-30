#!/bin/bash

# Run the Expo app in the Android emulator with proper fallbacks.
# Usage: ./run-android.sh [--native]
#   Default: expo start --android (Expo Go / dev client)
#   --native: expo run:android (builds native app, requires prebuild)

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

echo -e "${GREEN}🤖 Android Emulator – starting...${NC}"

# --- Helpers ---
command_exists() { command -v "$1" >/dev/null 2>&1; }

# --- 1. Project root ---
if [ ! -f "${PROJECT_DIR}/package.json" ]; then
    echo -e "${RED}❌ package.json not found. Run this script from the project root.${NC}"
    exit 1
fi

# --- 2. Node/Bun ---
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

# --- 3. Dependencies ---
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

# --- 4. Android SDK ---
setup_android_sdk() {
    if [ -n "$ANDROID_HOME" ] && [ -d "$ANDROID_HOME" ]; then
        export ANDROID_HOME
        echo -e "${GREEN}✓ Android SDK: $ANDROID_HOME${NC}"
        return 0
    fi
    local sdk_paths=(
        "$HOME/Library/Android/sdk"
        "$HOME/Android/Sdk"
        "/opt/android-sdk"
        "/usr/local/android-sdk"
    )
    for sdk_path in "${sdk_paths[@]}"; do
        if [ -d "$sdk_path" ]; then
            export ANDROID_HOME="$sdk_path"
            echo -e "${GREEN}✓ Android SDK: $ANDROID_HOME${NC}"
            return 0
        fi
    done
    echo -e "${RED}❌ Android SDK not found.${NC}"
    echo -e "${YELLOW}   Set ANDROID_HOME or install Android Studio.${NC}"
    return 1
}

# --- 5. ADB / Emulator ---
check_android_emulator() {
    if ! command_exists adb; then
        [ -n "$ANDROID_HOME" ] && export PATH="$ANDROID_HOME/platform-tools:$PATH"
        command_exists adb || return 1
    fi
    if adb devices 2>/dev/null | grep -q "emulator.*device"; then
        echo -e "${GREEN}✓ Android emulator detected${NC}"
        return 0
    fi
    return 1
}

start_android_emulator() {
    echo -e "${YELLOW}📱 No emulator running. Starting one...${NC}"
    local emulator_path=""
    if [ -n "$ANDROID_HOME" ]; then
        emulator_path="$ANDROID_HOME/emulator"
    else
        emulator_path="$HOME/Library/Android/sdk/emulator"
        [ ! -d "$emulator_path" ] && emulator_path="$HOME/Android/Sdk/emulator"
    fi
    local emulator_bin="$emulator_path/emulator"
    if [ ! -f "$emulator_bin" ]; then
        echo -e "${RED}❌ Emulator binary not found at $emulator_bin${NC}"
        echo -e "${YELLOW}   Install Android Studio and create an AVD.${NC}"
        return 1
    fi
    export PATH="$emulator_path:$PATH"
    local avd_list
    avd_list=$("$emulator_bin" -list-avds 2>&1) || true
    if [ -z "$avd_list" ]; then
        echo -e "${RED}❌ No AVDs found. Create one in Android Studio (AVD Manager).${NC}"
        return 1
    fi
    local first_avd
    first_avd=$(echo "$avd_list" | head -n 1)
    echo -e "${BLUE}   Booting AVD: $first_avd${NC}"
    "$emulator_bin" -avd "$first_avd" >/dev/null 2>&1 &
    echo -e "${BLUE}⏳ Waiting for emulator to be ready (up to 90s)...${NC}"
    local max_attempts=18
    local attempt=0
    while [ $attempt -lt $max_attempts ]; do
        sleep 5
        if check_android_emulator; then
            echo -e "${GREEN}✓ Emulator ready${NC}"
            return 0
        fi
        attempt=$((attempt + 1))
        echo -e "${BLUE}   Waiting... ($attempt/$max_attempts)${NC}"
    done
    echo -e "${YELLOW}⚠️  Emulator may still be booting. Expo will start; press 'a' when device is ready.${NC}"
    return 0
}

if ! setup_android_sdk; then
    echo -e "${YELLOW}💡 Falling back to web. Run: npx expo start --web${NC}"
    if command_exists bun; then bunx expo start --web; else npx expo start --web; fi
    exit 0
fi

# Ensure adb is on PATH
[ -n "$ANDROID_HOME" ] && export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"

EMULATOR_WAS_STARTED_BY_US=false
if ! check_android_emulator; then
    if start_android_emulator; then
        EMULATOR_WAS_STARTED_BY_US=true
    else
        echo -e "${YELLOW}⚠️  Could not start emulator. You can start Expo and press 'a' when a device is ready.${NC}"
    fi
fi

# --- 6. Run ---
# Use port 8082 to avoid conflict with another Expo/Metro (e.g. iOS run on 8081)
EXPO_PORT="${EXPO_PORT:-8082}"

run_expo_android() {
    # When we just started the emulator, don't pass --android: Expo would try to launch
    # the same AVD again and can conflict. User can press 'a' once device is ready.
    if [ "$EMULATOR_WAS_STARTED_BY_US" = true ] && ! check_android_emulator; then
        echo -e "${BLUE}   Start Expo first; press 'a' in the terminal when the emulator is ready.${NC}"
        if command_exists bun; then
            bunx expo start --port "$EXPO_PORT"
        else
            npx expo start --port "$EXPO_PORT"
        fi
        return
    fi
    if command_exists bun; then
        bunx expo start --android --port "$EXPO_PORT"
    else
        npx expo start --android --port "$EXPO_PORT"
    fi
}

run_expo_native_android() {
    if command_exists bun; then
        bunx expo run:android --port "$EXPO_PORT"
    else
        npx expo run:android --port "$EXPO_PORT"
    fi
}

echo -e "${BLUE}🚀 Starting Expo for Android...${NC}"

if [ "${USE_NATIVE}" = true ]; then
    echo -e "${YELLOW}📦 Native build (expo run:android)...${NC}"
    if ! run_expo_native_android; then
        echo -e "${YELLOW}⚠️  Native run failed. Trying 'expo start --android'...${NC}"
        run_expo_android
    fi
else
    if ! run_expo_android; then
        echo -e "${YELLOW}⚠️  expo start --android failed. Trying expo run:android...${NC}"
        if ! run_expo_native_android; then
            echo -e "${YELLOW}⚠️  run:android failed. Starting Expo; press 'a' for Android when device is ready.${NC}"
            if command_exists bun; then bunx expo start --port "$EXPO_PORT"; else npx expo start --port "$EXPO_PORT"; fi
        fi
    fi
fi
