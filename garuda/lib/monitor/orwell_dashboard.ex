defmodule Garuda.Monitor.OrwellDashboard do
  @moduledoc """
  This is the module for Orwell LiveView Dashboard
  the Dashboard shows vital information from the Game Server such as,
    Number of Connection
    Number of Rooms
    Number of user per room
    Time elasped per room
    State of each room
  Also provides actions, to inspect and to delete rooms.

  This module use Phoenix Liveview to mount a template.
  Game Data is fetched from the server, and a regular update is done with handle_info callback
  """
  use Phoenix.LiveView
  require Logger
  alias Garuda.Monitor.DashboardData
  alias Garuda.RoomManager.RoomDb
  @doc """
    The Mount function gathers information from Game Server and creates liveview template
    This function also sends an :update event to self, after 10 seconds
    The update is then handled in a handle_info
    """
  def mount(_params, _session, socket ) do

    Logger.info "==============Running MOUNT ==================="

    #Sending event to self to poll gameserver data
    Process.send_after(self(), :update, 10_000)

    # Get data from Game Manager
    game_manager_data = RoomDb.get_stats()

    #assigning number of room, connections, and a list of room info to socket
    #selected_room to show inspect section
    {:ok, assign(socket, :connections, game_manager_data["num_conns"] ) |>
          assign(:num_rooms, game_manager_data["num_rooms"]) |>
          assign(:list_rooms, game_manager_data["rooms"] |> makeListRooms) |>
          assign(:selected_room, :none) |>
          assign(:room_state, "")}
          # assign(:room_state, OrwellWeb.DashboardData.getRoomstate("pid 112") |> stateToString)
  end


  @doc """
    Handles the inspect click events from template
    It sets the selected_room value in template and
    returns room state of selected_room
    """
  def handle_event("inspect", params, socket) do

    Logger.info "=======INSPECT======== #{inspect(params)}"
    Logger.info "#{inspect(socket.assigns)}"
    #####
    ## Find pid from room name
    #####

    ##set :selected room as the one from event

    # String.to_atom(params["id"])
    game_room_id = params["name"] <> ":" <> params["id"]
    socket = assign(socket, :selected_room, params["id"])
    Logger.info "#{inspect(socket.assigns)}"

    ## Also assign the state of that room
    socket = assign(socket, :room_state, DashboardData.getRoomstate(game_room_id) |> stateToString )
    Logger.info "#{inspect(socket.assigns)}"

    {:noreply, socket}
  end

  def handle_event("dispose", params, socket) do
    Logger.info "===================DISPOSE================"
    Logger.info "dispose room ..... #{inspect(params["id"])}"
    Logger.info "to be done...."

    {:noreply, socket}
  end

  @doc """
  This should handle the update event for polling.
  This function gather latest data from gameserver and updates it to template
  and also send a update event to self
  """
  def handle_info(:update, socket) do
    #send event to self, to continously poll the game server data
    Process.send_after(self(), :update, 10_000)

    game_manager_data = RoomDb.get_stats()
    Logger.info("=================UPDATE============")
    Logger.info("#{inspect(socket.assigns)}")

    {:noreply, assign(socket, :connections, game_manager_data["num_conns"] ) |>
    assign(:num_rooms, game_manager_data["num_rooms"]) |>
    assign(:list_rooms, game_manager_data["rooms"] |> makeListRooms)}
  end

  # defp getTimeDiff( room_map ) do
  #   seconds = :os.system_time(:milli_seconds) - room_map["time"] |> div(1000)
  #   room_map Map.update!("time", &(getTimeDiffString(seconds, "*", "seconds")) )
  # end

  # defp getTimeDiffString(diff, timestr, units ) do
  #   case units do
  #     "seconds" ->
  #         str = String.replace_leading(timestr, "*", "*"<>Integer.to_string(rem(diff, 60))<>" seconds" )
  #         getTimeDiffString( div(diff, 60), str, "minutes" )
  #     "minutes" ->
  #         str = "*"<>Integer.to_string(rem(diff, 60))<>" minutes"
  #     _ ->
  #           IO.puts "not seconds"
  #     end
  # end

  defp makeListRooms( room_map ) do
    Map.keys( room_map ) |>
    Enum.map( fn x -> room_map[x] |> Map.put("pid", x) end )
  end

  defp stateToString(statemap) do
    Map.keys(statemap) |>
    Enum.map( fn x -> " #{x} => #{statemap[x]} " end) |>
    Enum.join(" ,\n")
  end
end
