from fastapi import Depends, HTTPException, Security
from fastapi.security import OAuth2PasswordBearer
import os
from jose import JWTError, jwt


JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTS = 30

oauth2_sceme = OAuth2PasswordBearer(tokenUrl="/edit-profile")


def jwt_authentication(token: str = Depends(oauth2_sceme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])

        user_uuid = payload.get("sub")
        if user_uuid is None:
            raise credentials_exception
        print("jwt authentication successful")
    except JWTError:
        raise credentials_exception
    return user_uuid
