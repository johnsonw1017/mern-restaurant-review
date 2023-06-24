import ReviewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {
    static async apiPostReview(request, response, next) {
        try {
            const restaurantId = request.body.restaurant_id;
            const review = request.body.text;
            const userInfo = {
                name: request.body.name,
                _id: request.body.user_id
            }
            const date = new Date();

            const reviewResponse = await ReviewsDAO.addReview(
                restaurantId,
                userInfo,
                review,
                date,
            )

            response.json({status: "success"})
        } catch (error) {
            response.status(500).json({error: error.message})
        }
    }

    static async apiUpdateReview(request, response, next) {
        try {
            const reviewId = request.body.review_id;
            const text = request.body.text;
            const date = new Date();

            const reviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                request.body.user_id,
                text,
                date,
            )

            var { error } = reviewResponse;

            if (error) {
                response.status(400).json({error})
            }

            if (reviewResponse.modifiedCount === 0) {
                throw new Error("Unable to update review - user may not be original poster")
            }

            response.json({status: "success"})
        } catch (error) {
            response.status(500).json({error: error.message})
        }
    }

    static async apiDeleteReview(request, response, next) {
        try {
            const reviewId = request.query.id;
            const userId = request.body.user_id;
            console.log(reviewId);

            const reviewResponse = await ReviewsDAO.deleteReview(
                reviewId,
                userId
            )

            response.json({status: "success"})
        } catch (error) {
            response.status(500).json({error: error.message})
        }
    }
}