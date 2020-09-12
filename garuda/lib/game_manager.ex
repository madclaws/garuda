defmodule Garuda.GameManager do
  @moduledoc """
    Entry point supervisor of Garuda
  """
  alias Garuda.RoomManager.RoomSupervisor
  # alias GarudaPoc.Goblet.MatchmakerSupervisor
  # alias GarudaPoc.Orwell.MonitorSupervisor

  use Supervisor
  def start_link(init_arg) do
    Supervisor.start_link(__MODULE__, init_arg, name: __MODULE__)
  end

  def init(_init_arg) do
    children = [
      Supervisor.child_spec(RoomSupervisor, type: :supervisor),
      {Registry, keys: :unique, name: GarudaRegistry}
    ]
    Supervisor.init(children, strategy: :one_for_one)
  end

end
