# Fetch-Me-A-Pet (takehome proj.)

Welcome to Fetch Me a Pet! 

Overkill, but a fun little project

Showing client vs SSR approaches.

Persistent state, etc.

Lots of Zod.

## Tech
- [Astro](https://docs.astro.build/en/getting-started/)
- [HTMX](https://htmx.org)
- [Tanstack Router](https://tanstack.com/router/)
- [Nanostores](https://github.com/nanostores/nanostores)
- [Zod](https://zod.dev)
- [Tailwind](https://tailwindcss.com)
- [Cloudflare KV](https://developers.cloudflare.com/kv/)

## Prerequisites

Before you begin, ensure you have the following:
- Node.js (version 14 or later)
- A package manager (npm, yarn, pnpm, or bun)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/alorslouis/fetch-me-a-pet.git
   cd fetch-me-a-pet
   ```

2. Install dependencies:

   Choose your preferred package manager:

   - Using bun (recommended):
     ```
     bun install
     ```

   - Using npm:
     ```
     npm install
     ```

   - Using yarn:
     ```
     yarn
     ```

   - Using pnpm:
     ```
     pnpm install
     ```

3. Set up Cloudflare Workers:
   - Ensure you have a Cloudflare account. Astro will use Cloudflare's platformProxy, so you'll have full functionality in local.
   - Configure your `wrangler.toml` file with your account details and KV namespace (if looking to deploy; will work locally with existing wrangler.toml).

4. Start the development server:

   - Using bun:
     ```
     bun dev
     ```

   - Using npm:
     ```
     npm dev
     ```

   - Using yarn:
     ```
     yarn dev
     ```

   - Using pnpm:
     ```
     pnpm dev
     ```

5. Open your browser and navigate to `localhost:4321` to view the application.

## Building for Production

To build the application for production:

- Using bun:
  ```
  bun run build
  ```

- Using npm:
  ```
  npm run build
  ```

- Using yarn:
  ```
  yarn build
  ```

- Using pnpm:
  ```
  pnpm build
  ```

## Deploying to Cloudflare

After building, you can deploy your application to Cloudflare Workers:

1. Ensure your `wrangler.toml` is correctly configured.
> :memo: **Note:** Cloudflare KV will run locally (and persist) with the existing binding. change if wanting to deploy.
2. Run the following command:
   ```
   bun run deploy
   ```
   Or replace `bun` with your preferred package manager.

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun run dev`             | Starts local dev server at `localhost:4321`      |
| `bun run build`           | Build your production site to `./dist/`          |
| `bun run preview`         | Preview your build locally, before deploying     |
| `bun run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun run astro -- --help` | Get help using the Astro CLI                     |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

Do what you want with this! IDC.
