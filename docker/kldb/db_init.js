db.createUser(
    {
        user: "kl",
        pwd: "foo",
        roles: [
            {
                role: "readWrite",
                db: "dev"
            }
        ]
    }
);