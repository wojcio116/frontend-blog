# Frontend Blog - Wojciech Nizborski

Personal frontend project and blog built with React 19, TypeScript, React Router 7, and Tailwind CSS 4.

## Backend API
The backend repository for this project is located at: https://github.com/wojcio116/backend-blog (Issue #170).

## Configuration (API Address)
The backend API address is configured through the `VITE_API_URL` environment variable (defaults to `http://localhost`) and is never hardcoded in UI components.

To change the API address without modifying source code:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Set `VITE_API_URL` in `.env` (or pass it as an environment variable when running or building the app):
   ```env
   VITE_API_URL=http://localhost:3000
   ```

## Prerequisites
- Node.js 24+
- Yarn 1.22

## Getting Started
1. Clone: `git clone https://github.com/wojcio116/frontend-blog.git && cd frontend-blog`
2. Install: `yarn install`
3. Configure env: `cp .env.example .env`
4. Run dev server: `yarn dev` (`http://localhost:5173`)

## Scripts
- `yarn dev` - start local development server
- `yarn build` - build production bundle
- `yarn lint` - run Biome linter
- `yarn test:coverage` - run unit tests with coverage report
- `yarn e2e` - run Playwright end-to-end tests
- `yarn storybook` - start Storybook on port 6006