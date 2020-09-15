defmodule TictactoePhx.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Telemetry supervisor
      TictactoePhxWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: TictactoePhx.PubSub},
      # Start the Endpoint (http/https)
      TictactoePhxWeb.Endpoint,
      Garuda.GameManager
      # Start a worker by calling: TictactoePhx.Worker.start_link(arg)
      # {TictactoePhx.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: TictactoePhx.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    TictactoePhxWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
