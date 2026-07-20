import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const userId = req.user?._id

    const isSubscribed = await Subscription.findOne({
        subscriber: userId,
        channel: channelId
    })

    if (isSubscribed) {
        await Subscription.findByIdAndDelete(isSubscribed._id)

        return res
            .status(200)
            .json(new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully"))
    }

    await Subscription.create({
        subscriber: userId,
        channel: channelId
    })

    return res
        .status(200)
        .json(new ApiResponse(200, { subscribed: true }, "Subscribed successfully"))
});