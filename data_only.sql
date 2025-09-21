COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
COPY public."Category" (id, slug, title, image) FROM stdin;
COPY public."Comment" (id, "createdAt", content, "postSlug", "userEmail") FROM stdin;
COPY public."Email" (id, "createdAt", email) FROM stdin;
COPY public."Post" (id, "createdAt", title, slug, content, image, "nbView", "nbComments", "userName", "catSlug", "userEmail", "userImage", release, team, "catTitle", artist, links, "trackList") FROM stdin;
COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
COPY public."User" (id, name, email, "emailVerified", image, role) FROM stdin;
COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
