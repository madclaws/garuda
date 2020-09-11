defmodule MagikWeb.ClickerChannel do

  use Phoenix.Channel
  use Garuda.GameChannel

  alias Garuda.GameRoom
  alias Magik.ClickRoom

  @impl Garuda.GameChannel
  def create(_params, socket) do
    IO.puts("Fucker joined Clicker")
    GameRoom.createRoom(ClickRoom, socket.assigns.match_id)
  end

  @impl Garuda.GameChannel
  def authorized?(_params) do
    true
  end

  @impl true
  def handle_in("click", _message, socket) do
    IO.puts("clicking")
    ClickRoom.on_click(:xyz)
    {:noreply, socket}
  end

  @impl true
  def terminate(_reason, socket) do
    Garuda.HeartOfGold.RoomDb.on_channel_terminate(socket.channel_pid)
  end

end
