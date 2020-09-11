defmodule Garuda.HeartOfGold.GameManager do
  @moduledoc """
    This is heart of gold, supervises all process.
  """

  alias Garuda.HeartOfGold.RoomSupervisor
  use Supervisor

  def start_link(init_arg) do
    Supervisor.start_link(__MODULE__, init_arg, name: __MODULE__)
  end

  def init(_init_arg) do
    children = [
      # {DynamicSupervisor, strategy: :one_for_one, name: ClickerSupervisor},
      Supervisor.child_spec(RoomSupervisor, type: :supervisor),
    ]
    Supervisor.init(children, strategy: :one_for_one)
  end

  # def createChildRoom(room_module, name) do
  #   result = DynamicSupervisor.start_child(ClickerSupervisor, {room_module, name: name})
  #   case result do
  #     {:ok, _child} -> IO.puts("Clickeer room #{name} created")
  #     {:error, {:already_started, _child}} -> IO.puts("Failed to create Clicker room #{name} due to already started}")
  #     {:error, error} -> IO.puts("Failed due to #{inspect error}")
  #     _ -> IO.puts("Ignore")
  #   end
  # end

end
