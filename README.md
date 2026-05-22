# Network Movers Frontend

This Angular project is mapped to the following branch/environment flow:

- `feature/*` → Local Dev
- `develop` → Internal QA
- `release/*` → Pre-Production
- `staging` → UAT / Client Testing
- `main` → Production

Remote repository:

`https://github.com/uzair2299/-network-movers-frondend.git`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start local dev server:

```bash
npm start
```

## Git branches

- Use `feature/<name>` for new feature work.
- Merge `feature/*` into `develop` for QA.
- Create `release/*` branches from `develop` for staging prep.
- Use `main` as the production branch.
