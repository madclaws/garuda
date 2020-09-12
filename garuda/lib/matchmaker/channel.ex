defmodule Garuda.Matchmaker.Channel do
  @moduledoc """
    Handles the matchmaking event from the client.
  """
  use Phoenix.Channel

  @impl true
  def join("garuda_matchmaker:" <> _room, _params, socket) do
    {:ok, %{:matchid => "sucks"}, socket}
  end
end
