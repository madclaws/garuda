# Garuda prototype 1

## Running

    cd dummy
    mix deps.get
    cd assets && npm install
    cd ..
    iex -S mix phx.server

## Development and testing library

 - Create a new feature/bug fix branch from develop branch
 - clone it and make changes.
 - push it to feature/bug fix branch
 
 In mix.exs
 

    defp deps do
	 [
	   {:garuda, git:  "https://github.com/madclaws/garuda.git", branch:  "feature/bug fix branch"},
     ]

change use the branch of garuda lib, which we want to test.