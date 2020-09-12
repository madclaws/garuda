defmodule GarudaPoc.GameRoom do
  @moduledoc """
    Behaviours and functions for implementing core game logic rooms
  """
  alias Garuda.RoomManager.RoomSheduler
  def createRoom(module_name, name) do
    RoomSheduler.create_room(module_name, name, [])
  end
end
