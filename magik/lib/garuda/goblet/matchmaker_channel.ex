defmodule Garuda.Goblet.MatchmakerChannel do
  use Phoenix.Channel

  def join("garuda_matchmaker:" <> _id, _params, socket) do
    {:ok, socket}
  end
end
