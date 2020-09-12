defmodule MagikWeb.ClickerChannel do

  use Phoenix.Channel
  use Garuda.Framework.GameChannel
  alias Magik.ClickRoom

  @impl true
  def on_join(_params, _socket) do
    IO.puts("Fucker joined Clicker")
  end

  @impl true
  def authorized?(_params) do
    true
  end

  @impl true
  def handle_in("click", _message, socket) do
    IO.puts("clicking")
    ClickRoom.on_click(id(socket))
    {:noreply, socket}
  end

  @impl true
  def on_leave(reason, _socket) do
    IO.puts("Leaving clicker channel due to #{inspect reason}, bye")
  end

end
