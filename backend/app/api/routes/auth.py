from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from ...config import get_settings
from ...database import get_db
from ...models.user import User
from ...schemas.user import UserOut
from ...auth import create_access_token, get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()


class GoogleTokenRequest(BaseModel):
    token: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


@router.post("/google", response_model=AuthResponse)
async def google_auth(body: GoogleTokenRequest, db: Session = Depends(get_db)):
    try:
        idinfo = id_token.verify_oauth2_token(
            body.token,
            google_requests.Request(),
            settings.google_client_id
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid Google token: {e}")

    google_id = idinfo["sub"]
    email = idinfo["email"]
    name = idinfo.get("name", email)
    avatar_url = idinfo.get("picture")

    user = db.query(User).filter(User.google_id == google_id).first()
    if not user:
        user = db.query(User).filter(User.email == email).first()
        if user:
            user.google_id = google_id
            user.avatar_url = avatar_url
        else:
            user = User(
                email=email,
                name=name,
                avatar_url=avatar_url,
                google_id=google_id,
            )
            db.add(user)
    else:
        user.name = name
        user.avatar_url = avatar_url

    db.commit()
    db.refresh(user)

    access_token = create_access_token(data={"sub": str(user.id)})
    return AuthResponse(access_token=access_token, user=UserOut.from_orm(user))


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
