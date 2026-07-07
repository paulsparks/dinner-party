{
  pkgs,
  lib,
  config,
  ...
}:

{
  dotenv.disableHint = true;

  packages = with pkgs; [
    secretspec
    prisma-engines_6
    biome
  ];

  env = {
    PRISMA_SCHEMA_ENGINE_BINARY =
      "${pkgs.prisma-engines_6}/bin/schema-engine";

    PRISMA_QUERY_ENGINE_BINARY =
      "${pkgs.prisma-engines_6}/bin/query-engine";

    PRISMA_FMT_BINARY =
      "${pkgs.prisma-engines_6}/bin/prisma-fmt";

    BIOME_BINARY = "${pkgs.biome}/bin/biome";
  };

  languages.javascript = {
    enable = true;
    pnpm = {
      enable = true;
      install.enable = true;
    };
  };

  languages.typescript = {
    enable = true;
    lsp.enable = true;
  };

  services.postgres = {
    enable = true;
    initialDatabases = [
      {
        name = "postgres";
        user = "postgres";
        pass = "db-pass";
      }
    ];
    initialScript = ''
      -- Give postgres access to create databases (useful for Prisma Shadow DB stuff)
      ALTER USER "postgres" CREATEDB;
      GRANT CREATE ON SCHEMA public TO "postgres";
    '';
    listen_addresses = "0.0.0.0";
    port = 5432;
  };

  scripts.motd = {
    exec = ''
      echo "----------------------------------------"
      echo "              DINNER PARTY              "
      echo "                                        "
      echo "Provided Services:                      "
      echo " - Postgres (localhost:5432)            "
      echo "                                        "
      echo "Helper Scripts:                         "
      ${pkgs.gnused}/bin/sed -e 's| |••|g' -e 's|=| |' <<EOF | ${pkgs.util-linuxMinimal}/bin/column -t | ${pkgs.gnused}/bin/sed -e 's|^| - |' -e 's|••| |g'
      ${lib.generators.toKeyValue { } (lib.mapAttrs (name: value: value.description) config.scripts)}
      EOF
      echo "                                        "
      echo "To get started, run 'devenv up -d' to   "
      echo "start the provided services. Then, run  "
      echo "'pnpm-s run dev' to start the server.   "
      echo "----------------------------------------"
    '';
    description = "Writes the start message with useful instructions";
  };

  scripts.pnpm-s = {
    exec = "secretspec run -- pnpm $@";
    description = "Runs pnpm with secrets injected (via secretspec)";
  };

  enterShell = ''
    motd
  '';
}