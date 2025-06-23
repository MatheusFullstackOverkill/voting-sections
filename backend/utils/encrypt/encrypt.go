package encrypt

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"os"
)

func Encrypt(plaintext string) ([]byte, error) {
	publicKeyPEM, err := os.ReadFile("public.pem")
	if err != nil {
		return []byte{}, err
	}
	publicKeyBlock, _ := pem.Decode(publicKeyPEM)
	publicKey, err := x509.ParsePKIXPublicKey(publicKeyBlock.Bytes)
	if err != nil {
		return []byte{}, err
	}

	plaintextbyte := []byte(plaintext)
	ciphertext, err := rsa.EncryptPKCS1v15(rand.Reader, publicKey.(*rsa.PublicKey), plaintextbyte)
	if err != nil {
		return []byte{}, err
	}

	return ciphertext, nil
}

func Decrypt(ciphertext string) (string, error) {
	privateKeyPEM, err := os.ReadFile("private.pem")
	if err != nil {
		return "", err
	}
	privateKeyBlock, _ := pem.Decode(privateKeyPEM)
	privateKey, err := x509.ParsePKCS1PrivateKey(privateKeyBlock.Bytes)
	if err != nil {
		return "", err
	}

	data, err := base64.StdEncoding.DecodeString(ciphertext)
	if err != nil {
		return "", err
	}

	plaintext, err := rsa.DecryptPKCS1v15(rand.Reader, privateKey, []byte(data))
	if err != nil {
		return "", err
	}

	return string(plaintext), nil
}
