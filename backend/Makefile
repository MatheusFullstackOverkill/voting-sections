run_api:
	go run .

generate_keys:
	test -f private.pem || openssl genrsa -out private.pem 4096
	test -f public.pem || openssl rsa -in private.pem -outform PEM -pubout -out public.pem