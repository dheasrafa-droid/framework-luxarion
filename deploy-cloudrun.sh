#!/bin/bash
# ==============================================================================
# Luxarion Engine - Standalone Google Cloud Run Deployment Script
# ==============================================================================

set -e

# Configuration Defaults
SERVICE_NAME="luxarion-engine"
REGION="${GCP_REGION:-asia-southeast1}"
PORT="8080"
MEMORY="512Mi"
CPU="1"
MIN_INSTANCES="1"

echo "========================================================"
echo "🚀 Deploying ${SERVICE_NAME} to Google Cloud Run"
echo "========================================================"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: Google Cloud SDK (gcloud) is not installed."
    echo "   Please install gcloud: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get Current GCP Project
PROJECT_ID=$(gcloud config get-value project 2> /dev/null)

if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "(unset)" ]; then
    echo "⚠️  No active Google Cloud Project found."
    read -p "Enter your Google Cloud Project ID: " PROJECT_ID
    gcloud config set project "$PROJECT_ID"
fi

echo "📌 Target Project: $PROJECT_ID"
echo "📌 Target Region : $REGION"
echo "📌 Service Name  : $SERVICE_NAME"
echo ""

# Enable necessary Google Cloud Services
echo "🔧 Ensuring required GCP APIs are enabled..."
gcloud services enable cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com

# Build Container using Google Cloud Build
IMAGE_TAG="gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest"
echo "📦 Building container image: ${IMAGE_TAG}..."
gcloud builds submit --tag "$IMAGE_TAG"

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run service..."
gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE_TAG" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --port "$PORT" \
  --memory "$MEMORY" \
  --cpu "$CPU" \
  --min-instances "$MIN_INSTANCES"

echo ""
echo "========================================================"
echo "✅ Deployment Successful!"
echo "Your app is now live and running on your own Cloud Run!"
echo "========================================================"
