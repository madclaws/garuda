defmodule GarudaPoc.HeartOfGold.RoomSheduler do
  @moduledoc """
    Manages all the game rooms that are created.
    Will be the bridge between the rooms and other core components
    such as Orwell and Goblet.
  """

  use GenServer
  alias GarudaPoc.HeartOfGold.RoomDb
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end

  def get_supervisor() do
    GenServer.call(__MODULE__, :get_supervisor)
  end

  def create_room(module, name, opts) do
    GenServer.call(__MODULE__, {:create_room, module, name, opts})
  end


  @impl true
  def init(_opts) do
    # TODO => Make the state a struct please
    {:ok, %{
      cur_dyn_sup_list: [],
      cur_load_limit: 5,
      dyn_sup_list: [],
      rooms: %{}
    }, {:continue, :initialize}}
  end

  @impl true
  def handle_continue(:initialize, state) do
    {:noreply, shedule_dyn_supervisor(state)}
  end

  @impl true
  def handle_call(:get_supervisor, _from, state) do
    state = get_dyn_sup(state)
    {:reply, List.first(state.cur_dyn_sup_list), state}
  end

  @impl true
  def handle_call({:create_room, module, room_name, opts}, _from, state) do
    {result, state} = create_game_room(module, room_name, opts, state)
    {:reply, result, state}
  end

  @impl true
  def handle_info({:DOWN, ref, :process, object, reason}, state) do
    IO.puts("#{inspect ref}")
    IO.puts("#{inspect object}")
    IO.puts("#{inspect reason}")
    RoomDb.delete_room(object)
    {:noreply, state}
  end

  @impl true
  def handle_info({:room_started, pid}, state) do
    IO.puts("room started #{inspect pid}")
    room_name = Keyword.get(Process.info(pid), :registered_name)
    add_room_to_state(pid, room_name)
    {:noreply, state}
  end

  defp get_dyn_sup_list() do
      Supervisor.which_children(GarudaPoc.HeartOfGold.RoomSupervisor)
      |> Enum.filter(fn {_name, _pid, type, _module} -> type == :supervisor end)
      |> Enum.map(fn {name, _pid, _type, _module} -> name end)
  end

  defp shedule_dyn_supervisor(state) do
    dyn_sup_list =  get_dyn_sup_list()
    %{state | dyn_sup_list: dyn_sup_list, cur_dyn_sup_list: dyn_sup_list}
  end

  # TODO => Returning state is not good, have to change.
  defp get_dyn_sup(state) do
    get_next_dyn_sup(state.cur_dyn_sup_list, state) # load balancing
  end

  defp get_next_dyn_sup([], %{cur_load_limit: load_limit} = state) do
    dyn_sup_list = state.dyn_sup_list # Reset with initial sup list, with increased load.
    %{state | cur_dyn_sup_list: dyn_sup_list, cur_load_limit: load_limit + 5}
  end

  defp get_next_dyn_sup([h | t] = cur_dyn_sup_list, state) do
    %{active: child_count} = DynamicSupervisor.count_children(h)
    if (child_count < state.cur_load_limit) do
      %{state | cur_dyn_sup_list: cur_dyn_sup_list}
    else
      get_next_dyn_sup(t, state)
    end
  end

  defp create_game_room(module, name, opts, state) do
    state = get_dyn_sup(state)
    result = DynamicSupervisor.start_child(List.first(state.cur_dyn_sup_list), {module, name: name, opts: opts})
    case result do
      {:ok, _child} -> IO.puts("Room #{name} created")
                      # add_room_to_state(child, name)
                      {:ok, state}
      {:error, {:already_started, _child}} -> IO.puts("Already created")
                                              {:ok, state}
      {:error, error} -> IO.puts("Failed due to #{inspect error}")
                         {{:error, error}, state}
      _ -> IO.puts("Error")
            {:error, state}
    end
  end

  defp add_room_to_state(room_pid, room_name) do
    ref = Process.monitor(room_pid)
    RoomDb.save_room_state(room_pid, %{"ref" => ref, "room_name" => room_name, "time" =>  :os.system_time(:milli_seconds)
    })
  end

end
