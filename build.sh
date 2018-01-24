GOOS=windows GOARCH=amd64 go build -o bin_for_win *.go 

GOOS=darwin GOARCH=amd64 go build -o bin_for_mac *.go 

GOOS=linux  GOARCH=amd64 go build -o bin_for_linux *.go