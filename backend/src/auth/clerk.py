from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
import json
import requests
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os

from ..config import settings

# JWT token authentication scheme
security = HTTPBearer()

# Cache for JWKS
jwks_cache = None
jwks_cache_timestamp = 0


class ClerkUser(BaseModel):
    id: str
    email: Optional[str] = None
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    image_url: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


def get_jwks():
    """Fetch Clerk's JWKS (JSON Web Key Set)"""
    global jwks_cache, jwks_cache_timestamp
    import time
    
    # Use cached JWKS if less than 24 hours old
    current_time = time.time()
    if jwks_cache and current_time - jwks_cache_timestamp < 86400:
        return jwks_cache
    
    # Fetch the JWKS from Clerk
    clerk_api_key = os.getenv("CLERK_SECRET_KEY")
    if not clerk_api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Clerk API key not configured",
        )
    
    # The URL should use your Clerk instance ID, which is part of the publishable key
    # Format is typically: https://clerk.{instance}.{env}.accounts.dev/v1/jwks
    # Extract instance from the publishable key
    publishable_key = os.getenv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "")
    if publishable_key and publishable_key.startswith("pk_test_"):
        # The key format is pk_test_{instance}.clerk.accounts.dev
        try:
            instance_id = publishable_key.split("_")[2].split(".")[0]
            jwks_url = f"https://{instance_id}.clerk.accounts.dev/v1/jwks"
        except:
            jwks_url = "https://api.clerk.dev/v1/jwks"
    else:
        jwks_url = "https://api.clerk.dev/v1/jwks"
        
    response = requests.get(jwks_url)
    
    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch JWKS: {response.text}",
        )
    
    jwks_cache = response.json()
    jwks_cache_timestamp = current_time
    return jwks_cache


def verify_clerk_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> ClerkUser:
    """Verify the Clerk JWT token and extract user information"""
    try:
        token = credentials.credentials
        
        # Get the JWKS
        jwks = get_jwks()
        
        # Decode token header to get the key ID
        header = jwt.get_unverified_header(token)
        kid = header.get("kid")
        
        if not kid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No key ID found in token",
            )
        
        # Find the matching key from JWKS
        key = None
        for jwk in jwks.get("keys", []):
            if jwk.get("kid") == kid:
                key = jwk
                break
        
        if not key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No matching key found",
            )
        
        # Verify the token
        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            # Don't verify the audience - Clerk's JWT validation is different
            options={"verify_aud": False}
        )
        
        # Extract user data from the token payload
        user = ClerkUser(
            id=payload.get("sub"),
            email=payload.get("email", ""),
            username=payload.get("username", ""),
            first_name=payload.get("given_name", ""),
            last_name=payload.get("family_name", ""),
            image_url=payload.get("picture", ""),
            metadata=payload.get("metadata", {})
        )
        
        return user
        
    except jwt.JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Error validating credentials: {str(e)}",
        ) 