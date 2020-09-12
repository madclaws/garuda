defmodule Magik.ClickRoom do

  use GenServer, restart: :transient

  alias GarudaPoc.HeartOfGold.RoomSheduler
  def start_link(name: name, opts: opts) do
    result = GenServer.start_link(__MODULE__, opts, name: String.to_atom(name))
    case result do
      {:ok, child} -> Process.send_after(RoomSheduler, {:room_started, child}, 10)
      _ -> true
    end
    result
  end

  def on_click(pid) do
    GenServer.cast(pid, "click")
  end

  @impl true
  def init(_opts) do
    IO.puts("Inited Clicker room")
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
  def handle_info({"tick", 60}, state) do
    IO.puts("Gameover #{inspect state}")
    # MagikWeb.Endpoint.broadcast!("room_clicker:" <> state["id"], "over", %{click: state["clicks"]})
    # {:stop, {:shutdown, "Room closing due to gameover"}, state}
    {:noreply, state}
  end

  @impl true
  def handle_info({"tick", _ticker}, %{"ticks" => num_ticks} = state) do
    state = %{state | "ticks" => num_ticks + 1}
    Process.send_after(self(), {"tick", num_ticks + 1}, 1000)
    {:noreply, state}
  end

  @impl true
  def terminate(reason, state) do

  end
end
