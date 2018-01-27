GOOS=windows GOARCH=amd64 go build -o ./bin/bin_for_win.exe ./dev/*.go 

GOOS=darwin GOARCH=amd64 go build -o ./bin/bin_for_mac ./dev/*.go 

GOOS=linux  GOARCH=amd64 go build -o ./bin/bin_for_linux ./dev/*.go