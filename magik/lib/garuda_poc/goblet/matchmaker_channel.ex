defmodule GarudaPoc.Goblet.MatchmakerChannel do
  use Phoenix.Channel

  @impl true
  def join("garuda_matchmaker:" <> _room, _params, socket) do
    {:ok, %{:matchid => "sucks"}, socket}
  end
end
