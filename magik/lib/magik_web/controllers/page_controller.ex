defmodule MagikWeb.PageController do
  use MagikWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
