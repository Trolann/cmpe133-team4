# Example BingeAuthResponse from auth API's
```python
BingeAuthResponse(
    id="51e0d4a2-6f0a-xxx-8b21-6c4c12345",
    email="user@email.com",
    last_sign_in_at=datetime.datetime(
        2023, 9, 17, 18, 4, 22, 209748, tzinfo=TzInfo(UTC)
    ),
    role="authenticated",
    updated_at=datetime.datetime(2023, 9, 17, 18, 4, 22, 211281, tzinfo=TzInfo(UTC)),
    access_token="eyJhbGciOiJIUzI1NiIsImtpZCI6IjMybkZXJzIjpb ... 5w8U3m5CFE",
    refresh_token="CwMmc ... UkXuw",
    token_type="bearer",
    expires_at_epoch=1694977462,
)
```

# Example objects from auth responses
```python
    try:
        auth_resp = new_user_by_email(email=os.getenv("UTILITY_ACCT"), password=os.getenv("UTILITY_PASS"))
    except Exception as e:
        print(f"Error creating user: {e}")
        auth_resp = sign_in_by_email(email=os.getenv("UTILITY_ACCT"), password=os.getenv("UTILITY_PASS"))

    user, session = auth_resp
    user = user[1]
    session = session[1]
```

```python
User(
    id="51eieio3-6f0a-43c3-1234-abcde3d71234",
    app_metadata={"provider": "email", "providers": ["email"]},
    user_metadata={},
    aud="authenticated",
    confirmation_sent_at=None,
    recovery_sent_at=None,
    email_change_sent_at=None,
    new_email=None,
    invited_at=None,
    action_link=None,
    email="utility@binge.app",
    phone="",
    created_at=datetime.datetime(2023, 9, 12, 22, 39, 18, 977516, tzinfo=TzInfo(UTC)),
    confirmed_at=datetime.datetime(2023, 9, 12, 22, 39, 18, 985708, tzinfo=TzInfo(UTC)),
    email_confirmed_at=datetime.datetime(
        2023, 9, 12, 22, 39, 18, 985708, tzinfo=TzInfo(UTC)
    ),
    phone_confirmed_at=None,
    last_sign_in_at=datetime.datetime(
        2023, 9, 17, 17, 33, 58, 296820, tzinfo=TzInfo(UTC)
    ),
    role="authenticated",
    updated_at=datetime.datetime(2023, 9, 17, 17, 33, 58, 299033, tzinfo=TzInfo(UTC)),
    identities=[
        UserIdentity(
            id="51eieio3-6f0a-43c3-1234-abcde3d71234",
            user_id="51eieio3-6f0a-43c3-1234-abcde3d71234",
            identity_data={
                "email": "utility@binge.app",
                "sub": "51eieio3-6f0a-43c3-1234-abcde3d71234",
            },
            provider="email",
            created_at=datetime.datetime(
                2023, 9, 12, 22, 39, 18, 983987, tzinfo=TzInfo(UTC)
            ),
            last_sign_in_at=datetime.datetime(
                2023, 9, 12, 22, 39, 18, 983951, tzinfo=TzInfo(UTC)
            ),
            updated_at=datetime.datetime(
                2023, 9, 12, 22, 39, 18, 983987, tzinfo=TzInfo(UTC)
            ),
        )
    ],
    factors=None,
)
Session(
    provider_token=None,
    provider_refresh_token=None,
    access_token="eyJhbGciOiJIUz ... kxNZsGBhSIxWsjjczoJ9S4PjzK8zyF8",
    refresh_token="ozv5 ... Z7GA",
    expires_in=3600,
    expires_at=1694975638,
    token_type="bearer",
    user=User(
        id="51eieio3-6f0a-43c3-1234-abcde3d71234",
        app_metadata={"provider": "email", "providers": ["email"]},
        user_metadata={},
        aud="authenticated",
        confirmation_sent_at=None,
        recovery_sent_at=None,
        email_change_sent_at=None,
        new_email=None,
        invited_at=None,
        action_link=None,
        email="utility@binge.app",
        phone="",
        created_at=datetime.datetime(
            2023, 9, 12, 22, 39, 18, 977516, tzinfo=TzInfo(UTC)
        ),
        confirmed_at=datetime.datetime(
            2023, 9, 12, 22, 39, 18, 985708, tzinfo=TzInfo(UTC)
        ),
        email_confirmed_at=datetime.datetime(
            2023, 9, 12, 22, 39, 18, 985708, tzinfo=TzInfo(UTC)
        ),
        phone_confirmed_at=None,
        last_sign_in_at=datetime.datetime(
            2023, 9, 17, 17, 33, 58, 296820, tzinfo=TzInfo(UTC)
        ),
        role="authenticated",
        updated_at=datetime.datetime(
            2023, 9, 17, 17, 33, 58, 299033, tzinfo=TzInfo(UTC)
        ),
        identities=[
            UserIdentity(
                id="51eieio3-6f0a-43c3-1234-abcde3d71234",
                user_id="51eieio3-6f0a-43c3-1234-abcde3d71234",
                identity_data={
                    "email": "utility@binge.app",
                    "sub": "51eieio3-6f0a-43c3-1234-abcde3d71234",
                },
                provider="email",
                created_at=datetime.datetime(
                    2023, 9, 12, 22, 39, 18, 983987, tzinfo=TzInfo(UTC)
                ),
                last_sign_in_at=datetime.datetime(
                    2023, 9, 12, 22, 39, 18, 983951, tzinfo=TzInfo(UTC)
                ),
                updated_at=datetime.datetime(
                    2023, 9, 12, 22, 39, 18, 983987, tzinfo=TzInfo(UTC)
                ),
            )
        ],
        factors=None,
    ),
)

```