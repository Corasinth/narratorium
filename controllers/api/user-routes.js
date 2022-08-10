const router = require("express").Router();
const { User, Story, Submission } = require("../../models");
const { Op } = require("sequelize");

// "/api/users/" GET all users
router.get("/", async (req, res) => {
    try {
        const userData = await User.findAll({
            include: [{ model: Submission }]
        });
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json(error);
    }
});

// "/api/users/:id" GET one user by id
router.get("/:id", async (req, res) => {
    try {
        const userData = await User.findByPk(req.params.id, {
            include: [{ model: Submission }]
        });
        if (!userData) {
            res.status(400).json({ message: "No user found with this id" });
        } else {
            res.status(200).json(userData);
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// "/api/users/" POST a new user
router.post("/", async (req, res) => {
    try {
        const userData = await User.create(req.body);

        // Login by saving user_id and loggedIn to session storage
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.loggedIn = true;
            res.status(200).json({ user: userData, message: 'You are now logged in!' });
        });
    } catch (error) {
        res.status(500).json(error);
    }
});


// "/api/users/" DELETE a user by id
router.delete("/:id", async (req, res) => {
    try {
        const userData = await User.destroy({
            where: {
                id: req.params.id
            }
        });
        if (!userData) {
            res.status(404).json({ message: "No user found with this id" });
        } else {
            res.status(200).json(userData);
        }
    } catch (error) {
        res.status(500).json(error);
    }
});


// "/api/users/login" post login user
router.post("/login", async (req, res) => {
    try {
        // Find a user by username OR email
        const userData = await User.findOne({
            where: {
                [Op.or]: [{ email: req.body.username_email }, { username: req.body.username_email }]
            }
        });

        // Error handling which sends appropriate messages to client
        if (!userData) {
            res.status(404).json({ message: "No user found with this username/email address" });
            return;
        } else {
            const isValidPassword = userData.checkPassword(req.body.password);

            if (!isValidPassword) {
                res.status(404).json({ message: "Incorrect password" });
                return;
            } else {
                req.session.save(() => {
                    req.session.user_id = userData.id;
                    req.session.loggedIn = true;
                    res.status(200).json({ user: userData, message: 'You are now logged in!' });
                });
            }
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// "/api/users/logout" post logout user
router.post("/logout", (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(200).end();
        });
    }
    else {
        res.status(404).end();
    }
});

module.exports = router;