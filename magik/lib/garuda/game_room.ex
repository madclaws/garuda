defmodule Garuda.GameRoom do
  @moduledoc """
    Behaviours and functions for implementing core game logic rooms
  """
  alias Garuda.HeartOfGold.RoomSheduler
  def createRoom(module_name, name) do
    RoomSheduler.create_room(module_name, name, [])
  end
end
