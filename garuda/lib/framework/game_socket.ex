defmodule Garuda.Framework.GameSocket do
  @moduledoc """
    Injects specific game behaviours in user_socket.ex
  """

  defmacro __using__(_opts \\ []) do
    quote do
      import unquote(__MODULE__)
      Phoenix.Socket.channel "garuda_matchmaker:*", Garuda.Matchmaker.Channel
    end
  end

  @doc """
    Defines a game channel

    Expects a user specified game room name and associated module
  """
  defmacro game_channel(channel_name, channel_module) do
    quote do
      Phoenix.Socket.channel "room_" <> unquote(channel_name) <> ":*", unquote(channel_module)
    end
  end

end
