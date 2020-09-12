defmodule Magik.ClickRoom do

  use Garuda.GameRoom

  def on_click(pid) do
    GenServer.cast(pid, "click")
  end

  def on_leave(pid) do
    GenServer.cast(pid, "leave")
  end

  @impl true
  def init(opts) do
    IO.puts("Inited Clicker room => #{inspect opts}")
    Process.send_after(self(), {"tick", 0}, 1000)
    {:ok, %{"clicks" => 0, "ticks" => 0}}
  end

  @impl true
  def handle_cast("click", %{"ticks" => 10} = state) do
    {:noreply, state}
  end

  @impl true
  def handle_cast("click", %{"clicks" => num_click} = state) do
    {:noreply, %{state | "clicks" => num_click + 1}}
  end

  @impl true
  def handle_info({"tick", 10}, state) do
    IO.puts("Gameover #{inspect state}")
    MagikWeb.Endpoint.broadcast!(get_channel(), "over", %{click: state["clicks"]})
    {:stop, {:shutdown, "Room closing due to gameover"}, state}
    # {:noreply, state}
  end

  @impl true
  def handle_info({"tick", _ticker}, %{"ticks" => num_ticks} = state) do
    state = %{state | "ticks" => num_ticks + 1}
    Process.send_after(self(), {"tick", num_ticks + 1}, 1000)
    {:noreply, state}
  end


end
