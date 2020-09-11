defmodule Garuda.HeartOfGold.RoomDb do
  @moduledoc """
    Stores the info of all the game rooms and functions to manage them
  """

  use GenServer
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end

  def save_room_state(room_pid, info) do
    GenServer.cast(__MODULE__, {:save_room, {room_pid, info}})
  end

  def delete_room(room_pid) do
    GenServer.cast(__MODULE__, {:delete_room, room_pid})
  end

  def on_channel_connection(channel_pid) do
    GenServer.cast(__MODULE__, {:channel_conn, channel_pid})
  end

  def on_channel_terminate(channel_pid) do
    GenServer.cast(__MODULE__, {:channel_discon, channel_pid})
  end

  def get_stats() do
    GenServer.call(__MODULE__, :get_stats)
  end

  @impl true
  @spec init(any) :: {:ok, %{optional(<<_::32, _::_*8>>) => %{}}}
  def init(_opts) do
    {:ok, %{"rooms" => %{}, "conn" => %{}}}
  end

  @impl true
  def handle_cast({:save_room, {room_pid, info}}, state) do
    state = put_in state["rooms"][room_pid], info
    {:noreply, state}
  end

  @impl true
  def handle_cast({:delete_room, room_pid}, state) do
    {_popped_val, state} = pop_in state["rooms"][room_pid]
    {:noreply, state}
  end

  @impl true
  def handle_cast({:channel_conn, channel_pid}, state) do
    IO.puts("on channel conn #{inspect channel_pid}")
    state = put_in state["conn"][channel_pid], %{}
    {:noreply, state}
  end

  @impl true
  def handle_cast({:channel_discon, channel_pid}, state) do
    IO.puts("on channel disconn #{inspect channel_pid}")
    {_popped_val, state} = pop_in state["conn"][channel_pid]
    {:noreply, state}
  end

  @impl true
  def handle_call(:get_stats, _from, state) do
    stats = %{
      "num_conns" => Map.keys(state["conn"]) |> Enum.count(),
      "num_rooms" => Map.keys(state["rooms"]) |> Enum.count(),
      "rooms" => state["rooms"]
    }
    {:reply, stats, state}
  end

end
