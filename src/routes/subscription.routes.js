import { Router } from 'express';
import {toggleSubscription,getUserChannelSubscribers, getSubscribedChannels} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); 

// URL: /api/v1/subscriptions/c/:channelId
router.route("/c/:channelId").post(toggleSubscription);

// URL: /api/v1/subscriptions/u/:channelId
router.route("/u/:channelId").get(getUserChannelSubscribers);

// URL: /api/v1/subscriptions/user
router.route("/user").get(getSubscribedChannels);

export default router;