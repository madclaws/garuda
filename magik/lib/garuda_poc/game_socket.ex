defmodule GarudaPoc.GameSocket do
  @moduledoc """
    Module to be used inside user_socket.ex for game socket behaviours
  """

  defmacro __using__(_opts \\ []) do
    quote do
      import unquote(__MODULE__)
      Phoenix.Socket.channel "garuda_matchmaker:*", GarudaPoc.Goblet.MatchmakerChannel
    end
  end

  defmacro game_channel(channel_name, channel_module) do
    quote do
      Phoenix.Socket.channel "room_" <> unquote(channel_name) <> ":*", unquote(channel_module)
    end
  end
end
