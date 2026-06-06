# Dinner Party

## Getting Started with Development

### Prerequisites

The following environment configuration is necessary:

- Nix-based
    - [Nix Package Manager](https://nixos.org/download/)
    - [Devenv](https://devenv.sh/getting-started/)
    - [Direnv](https://direnv.net/docs/installation.html) (Recommended, but not required)

### Environment Activation

See [Prerequisites](#prerequisites) for the necessary system dependencies.

Once you are in an environment with Nix and devenv installed, you can run
`devenv shell` to activate the environment. Direnv will do this automatically
if it is installed (you may need to run `direnv allow` the first time).

### Starting Services

The application needs some background services (like Postgres) to operate fully.
These can be started by running `devenv up -d` to start the *services* in a
detached state. These can be stopped by running `devenv processes down`.

Next configure `secretspec` by running `secretspec config init` and selected both `env` and `development` as the profile using the interactive prompt. Then run the following `secretspec config provider add env "env://"` and `secretspec config provider add dotenv "dotenv://"`.

Once you have the necessary background services running and secretspec configured, the application can be started in development mode by applying database migrations with `pnpm-s run db:migrate` and then running `pnpm-s run dev`. Note that the `pnpm-s` command is the same as the normal `pnpm` command, but with secrets injected into its environment via `secretspec`. Only commands that need secrets should be run with `secretspec run -- <cmd>` and/or `pnpm-s`.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

[^1]: If you are using the Nix-based environment, you don't need to use the devcontainer.
