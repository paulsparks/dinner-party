# Dinner Party

## Getting Started with Development

### Prerequisites

One of the following environment configurations is necessary:

- Nix-based (Preferred)
    - [Nix Package Manager](https://nixos.org/download/)
    - [Devenv](https://devenv.sh/getting-started/)
    - [Direnv](https://direnv.net/docs/installation.html) (Recommended, but not required)
- Docker-based (Container w/ Nix installed)
    - Docker ([Linux](https://docs.docker.com/engine/install/), [WSL/Mac](https://docs.rancherdesktop.io/getting-started/installation/))

### Environment Activation

See [Prerequisites](#prerequisites) for the necessary system dependencies.

If you're using a **docker-based** environment, everything is defined in
`.devcontainer/devcontainer.json`. Most IDEs support this standard and can
launch the devcontainer. If your IDE does not support this standard, then
[Dev Container CLI](https://github.com/devcontainers/cli) can be used. [^1]

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
