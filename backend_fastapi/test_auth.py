import pytest
from datetime import timedelta
from jose import JWTError

from auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_token,
    SECRET_KEY,
    ALGORITHM
)

# generowanie i dekodowanie tokenów
def test_create_and_decode_token():
    data = {"sub": "user1"}
    token = create_access_token(data)
    assert isinstance(token, str)

    decoded = decode_token(token)
    assert decoded["sub"] == "user1"
    assert "exp" in decoded

# wygasanie tokenu
def test_expired_token():
    data = {"sub": "user2"}
    token = create_access_token(data, expires_delta=timedelta(seconds=-1))

    with pytest.raises(JWTError):
        decode_token(token)

# token z nieprawidłowym podpisem
def test_invalid_token_signature():
    data = {"sub": "user3"}
    token = create_access_token(data)

    invalid_token = token[:-1] + ("a" if token[-1] != "a" else "b")

    with pytest.raises(JWTError):
        decode_token(invalid_token)
