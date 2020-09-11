# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

# Configures the endpoint
config :magik, MagikWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "sTCITxBEn6cWaKKA8Hw7o0YqHtx67zwp8twZ51eaDeAWTE9vec9JmbP3za5mtn7O",
  render_errors: [view: MagikWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: Magik.PubSub,
  live_view: [signing_salt: "EOYSZS26"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
