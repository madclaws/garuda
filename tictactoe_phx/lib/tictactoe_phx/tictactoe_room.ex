defmodule TictactoePhx.TictactoeRoom do
  alias TictactoePhx.TictactoeRoom
  use Garuda.GameRoom
  require Logger

  defstruct(
    board: [0,0,0,0,0,0,0,0,0],
    turn: nil,
    move_count: 0,
    match_id: nil,
    gameover: {false, nil},
    player_list: []
  )

  ##CLIENT API################################
  def show_game_state(match_pid) do
    GenServer.call(match_pid, "show_game_state")
  end

  def add_player(match_pid, user_id) do
    GenServer.call(match_pid, {"add_player", user_id})
  end

  def move(match_pid, index) do
    GenServer.call(match_pid, {"move", index})
  end

  #SERVER API################################
  @impl true
  def init(match_id) do
    {:ok, set_match_id(match_id)}
  end

  @impl true
  def handle_call("show_game_state", _from, game_state) do
    {:reply, show_current_game_state(game_state), game_state}
  end

  @impl true
  def handle_call({"add_player", user_id}, _from, game_state) do
    game_state = game_state |> add_player_to_game(user_id)
    {:reply, game_state, game_state}
  end

  @impl true
  def handle_call({"move", index}, _from, game_state) do
    game_state = game_state |> place_mark(index)
    {:reply, game_state, game_state}
  end

    #HELPER FUNCTIONS################################
    defp set_match_id(match_id) do
      TictactoeRoom.__struct__()
      |> set_match_id_in_gamestate(match_id)
    end

    defp set_match_id_in_gamestate(game_state, match_id) do
      %{game_state | match_id: match_id}
    end

    defp show_current_game_state(game_state) do
      game_state
    end

    defp add_player_to_game(game_state, user_id) do
      update_player_list(game_state.player_list, game_state, user_id)
    end

    defp update_player_list([], game_state, user_id) do
      %{game_state | player_list: [user_id], turn: user_id}
    end

    defp update_player_list([player1], game_state, user_id) do
      TictactoePhxWeb.Endpoint.broadcast!(get_channel(), "start", %{players: [player1, user_id]})
      %{game_state | player_list: [player1, user_id]}
    end

    defp update_player_list([_player2, _player1], game_state, _user_id) do
      game_state
    end

    defp place_mark(game_state, index), do: place_mark(game_state, index, game_state.gameover)
    defp place_mark(game_state, index, {false, _}) do
      user_id = game_state.turn
      new_board = game_state.board |> List.update_at(index, fn _ -> user_id end)
      game_state =
      %{game_state |
        board: new_board,
        turn: get_other_player(game_state.player_list, user_id),
        move_count: game_state.move_count+1
      }

      game_state =
      cond do
        is_gameover?(game_state.board, user_id) -> %{game_state | gameover: {true, user_id}}
        is_draw?(game_state.move_count) -> %{game_state | gameover: {true, nil}}
        true -> game_state
      end
      TictactoePhxWeb.Endpoint.broadcast!(get_channel(), "moved", %{player_id: user_id, index: index, gameover: gameover_data(game_state.gameover)})
      game_state
    end
    defp place_mark(game_state, _index, {true, _}), do: game_state

    defp get_other_player([player_a, player_b], player_a), do: player_b
    defp get_other_player([player_a, player_b], player_b), do: player_a

    defp is_gameover?([x,x,x,_,_,_,_,_,_], x) ,do: true
    defp is_gameover?([_,_,_,x,x,x,_,_,_], x) ,do: true
    defp is_gameover?([_,_,_,_,_,_,x,x,x], x) ,do: true
    defp is_gameover?([x,_,_,x,_,_,x,_,_], x) ,do: true
    defp is_gameover?([_,x,_,_,x,_,_,x,_], x) ,do: true
    defp is_gameover?([_,_,x,_,_,x,_,_,x], x) ,do: true
    defp is_gameover?([x,_,_,_,x,_,_,_,x], x) ,do: true
    defp is_gameover?([_,_,x,_,x,_,x,_,_], x) ,do: true
    defp is_gameover?(_board, _user_id) ,do: false

    defp is_draw?(move_count), do: move_count==9

    defp gameover_data({game_status, user_id}), do: [game_status, user_id]
end
