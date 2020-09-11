defmodule Garuda.GameChannel do
  @moduledoc """
    Includes Phoenix Channels abstractions and game specific functions
  """

  @callback create(params :: map, socket :: Phoenix.Socket) :: any()
  @callback authorized?(params :: map()) :: boolean

  defmacro __using__(_opts \\ []) do
    quote do
      @behaviour unquote(__MODULE__)
      import unquote(__MODULE__)
      alias Garuda.HeartOfGold.RoomDb
      def join("room_" <> room_id , params, socket) do
        if (apply(__MODULE__, :authorized?, [params])) do
          Process.send_after(self(), {"after_join", params}, 50)
          RoomDb.on_channel_connection(socket.channel_pid)
          {:ok, apply(unquote(__MODULE__), :setup_socket_state, [room_id, socket])}
        else
          {:error, %{reason: "unauthorized"}}
        end
      end

      def handle_info({"after_join", params}, socket) do
        apply(__MODULE__, :create, [params, socket])
        {:noreply, socket}
      end

    end
  end

  def setup_socket_state(room_id, socket) do
    [room_name, match_id] = String.split(room_id, ":")
    socket = Phoenix.Socket.assign(socket, :room_name, room_name)
    Phoenix.Socket.assign(socket, :match_id, match_id)
  end
end
