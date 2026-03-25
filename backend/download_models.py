"""
download_models.py
------------------
Downloads all .pkl model files from Hugging Face Hub into backend/models/.
Run this once locally to upload, then Render calls it at startup via
the start command in render.yaml.

Usage:
  # 1. Upload your models (run once from your machine):
  #    python download_models.py --upload --repo your-hf-username/credit-xai-models

  # 2. Download at deploy time (Render calls this automatically):
  #    python download_models.py
"""

import os
import argparse
from pathlib import Path

MODELS_DIR = Path(__file__).parent / "models"
MODELS_DIR.mkdir(exist_ok=True)

FILES = [
    "xgboost.pkl",
    "lightgbm.pkl",
    "random_forest.pkl",
    "logistic_regression.pkl",
    "features.pkl",
    "scaler.pkl",
]


def download(repo: str):
    from huggingface_hub import hf_hub_download

    print(f"Downloading models from {repo}...")
    for fname in FILES:
        dest = MODELS_DIR / fname
        if dest.exists():
            print(f"  [skip] {fname} already exists")
            continue
        path = hf_hub_download(repo_id=repo, filename=fname, local_dir=MODELS_DIR)
        print(f"  [ok]   {fname} → {path}")
    print("All models ready.")


def upload(repo: str):
    from huggingface_hub import HfApi

    api = HfApi()
    api.create_repo(repo_id=repo, repo_type="model", exist_ok=True, private=True)
    for fname in FILES:
        src = MODELS_DIR / fname
        if not src.exists():
            print(f"  [skip] {fname} not found locally")
            continue
        api.upload_file(
            path_or_fileobj=str(src),
            path_in_repo=fname,
            repo_id=repo,
            repo_type="model",
        )
        print(f"  [ok]   uploaded {fname}")
    print(f"Done. Repo: https://huggingface.co/{repo}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--upload", action="store_true")
    parser.add_argument(
        "--repo", default=os.getenv("HF_REPO", "your-hf-username/credit-xai-models")
    )
    args = parser.parse_args()

    if args.upload:
        upload(args.repo)
    else:
        download(args.repo)
