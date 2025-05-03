import express from "express";
import path from "path";

const router = express.Router();

// router.use(userRouter);

router.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../../client/dist/index.html"))
})

export default router;