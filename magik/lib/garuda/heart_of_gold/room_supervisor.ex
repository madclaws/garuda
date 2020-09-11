defmodule Garuda.HeartOfGold.RoomSupervisor do
  @moduledoc """
    Creates and supervises all the dynamic supervisors, which in turn
    supervises the actual game rooms.
  """

  use Supervisor
  alias Garuda.HeartOfGold.RoomSheduler
  alias Garuda.HeartOfGold.RoomDb

  @max_dynamic_supervisor 5

  def start_link(opts \\ []) do
    Supervisor.start_link(__MODULE__, opts, name: __MODULE__)
  end

  @impl true
  def init(_opts) do
    children = createDynamicSupervisorsList() ++ [{RoomSheduler, [@max_dynamic_supervisor]}]
    ++ [{RoomDb, []}]
    Supervisor.init(children, strategy: :one_for_one)
  end

  # Creates dynamic supervisor according to the config
  defp createDynamicSupervisorsList() do
    for count <- 1..@max_dynamic_supervisor do
      {DynamicSupervisor, strategy: :one_for_one, name: :"dynamic_sup_#{count}"}
    end
  end


end
