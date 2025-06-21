# QA Automation Project Template

A public test automation project showcasing Playwright, Postman, GitHub Actions, and GCP Cloud Run. Designed to demonstrate real-world QA skills for job seekers and portfolio building.

---

## 🔧 Tech Stack
- **Playwright (TypeScript)** for E2E browser testing
- **Postman** collections for API testing
- **GitHub Actions** for CI/CD
- **Google Cloud Platform (Cloud Run)** for deployment
- **Node.js + Express** mock backend

---

## 🗂️ Project Structure
```
.
├── .github/workflows         # CI/CD workflows
├── api-tests/                # Postman collections & test scripts
├── e2e-tests/                # Playwright test suite (TypeScript)
├── server/                   # Mock API + frontend
├── deploy/                   # GCP Cloud Run Dockerfile and deploy script
├── README.md
```

---

## ▶️ Getting Started

```bash
git clone https://github.com/wattersnathen/qa-tools-portal.git
cd qa-tools-portal
npm install
```

### Start the mock server
```bash
cd server
npm install
npm run dev
```

### Run Playwright tests
```bash
cd e2e-tests
npx playwright test
```

### Run Postman tests
```bash
newman run ../api-tests/collection.json
```

---

## 🚀 CI/CD with GitHub Actions

Workflows include:
- On PR: Run Playwright + Postman tests
- On main branch push: Deploy to GCP Cloud Run

---

## ☁️ Deploy to GCP

- Configure your `gcloud` project
- Build and deploy with:

```bash
cd deploy
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/qa-dashboard
```

```bash
gcloud run deploy qa-dashboard \
  --image gcr.io/YOUR_PROJECT_ID/qa-dashboard \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```


## 📌 Inspiration
This repo is intended as a technical portfolio piece. It demonstrates:
- Test automation design
- API mocking
- CI/CD integration
- Cloud deployments

---

Built by Nathen Watters · SDET · [LinkedIn](https://www.linkedin.com/in/nathenwatters/)
