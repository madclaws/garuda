defmodule TictactoePhxWeb.TictactoeChannel do

  use Garuda.GameChannel
  require Logger

  alias TictactoePhx.TictactoeRoom

  @impl true
  def on_join(_params, _socket) do
    IO.puts("Player Joined")
  end

  @impl true
  def authorized?(_params) do
    true
  end

  @impl true
  def handle_in("add_player", message, socket) do
    Logger.info("adding player -- #{inspect(message)}")
    player_id = message["player_id"]
    TictactoeRoom.add_player(id(socket), player_id)
    {:noreply, socket}
  end

  @impl true
  def handle_in("move", message, socket) do
    Logger.info("#{inspect(message)}")
    index = message["index"]
    TictactoeRoom.move(id(socket), index)
    {:noreply, socket}
  end

  @impl true
  def on_leave(reason, _socket) do
    IO.puts("Leaving ttt channel due to #{inspect reason}, bye")
  end

end
