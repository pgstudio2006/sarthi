# ---- APK Build Stage ----
FROM node:20-alpine AS builder

# Install Android SDK dependencies
RUN apk add --no-cache openjdk17 gradle bash

ENV ANDROID_HOME=/opt/android-sdk
ENV ANDROID_SDK_ROOT=/opt/android-sdk
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# Download Android command-line tools
RUN mkdir -p $ANDROID_HOME/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O /tmp/cmdline-tools.zip && \
    unzip -q /tmp/cmdline-tools.zip -d $ANDROID_HOME/cmdline-tools && \
    mv $ANDROID_HOME/cmdline-tools/cmdline-tools $ANDROID_HOME/cmdline-tools/latest && \
    rm /tmp/cmdline-tools.zip

# Accept licenses and install required SDK packages
RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0"

WORKDIR /app

# Copy package files and install dependencies
COPY mobile/package*.json ./
RUN npm ci

# Copy the rest of the mobile app
COPY mobile/ ./

# Set the API URL as a build arg (defaults to production)
ARG EXPO_PUBLIC_API_URL=https://sarthi-backend.coolify.app/api
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL

# Generate native Android project
RUN npx expo prebuild --platform android --no-install

# Build the APK
RUN cd android && ./gradlew assembleRelease --no-daemon --stacktrace

# ---- Serve Stage ----
FROM node:20-alpine
WORKDIR /app

RUN npm install -g serve

# Copy the built APK
COPY --from=builder /app/android/app/build/outputs/apk/release/app-release.apk /app/sarthi.apk

# Create a simple download page
RUN echo '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Sarthi APK</title><style>body{font-family:system-ui;max-width:600px;margin:80px auto;text-align:center}a{display:inline-block;padding:16px 32px;background:#535BD8;color:white;text-decoration:none;border-radius:12px;font-size:18px}</style></head><body><h1>Sarthi APK</h1><p>Click below to download the latest APK</p><a href="/sarthi.apk" download>Download Sarthi.apk</a></body></html>' > /app/index.html

EXPOSE 3000
CMD ["serve", "/app", "-l", "3000"]
