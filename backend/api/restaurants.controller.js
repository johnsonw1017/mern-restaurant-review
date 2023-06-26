import RestaurantsDAO from "../dao/restaurantsDAO.js";

export default class RestaurantsController {
    static async apiGetRestaurants(request, response, next) {
        const restaurantsPerPage = request.query.restaurantsPerPage ? parseInt(request.query.restaurantsPerPage, 10) : 20;
        const page = request.query.page ? parseInt(request.query.page, 10) : 0;

        let filters = {};
        if (request.query.cuisine){
            filters.cuisine = request.query.cuisine;
        } else if (request.query.zipcode) {
            filters.zipcode = request.query.zipcode;
        } else if (request.query.name) {
            filters.name = request.query.name;
        }

        const { restaurantsList, totalNumRestaurants } = await RestaurantsDAO.getRestaurants({
            filters,
            page,
            restaurantsPerPage,
        });

        let result = {
            restaurants: restaurantsList,
            page: page,
            filters: filters,
            entries_per_page: restaurantsPerPage,
            total_results: totalNumRestaurants,
        };

        response.json(result);
    }

    static async apiGetRestaurantById(request, response, next) {
        try {
            let id = request.params.id || {};
            let restaurant = await RestaurantsDAO.getRestaurantById(id);
            if (!restaurant) {
                response.status(404).json({error: "Note found"});
                return
            }
            response.json(restaurant);
        } catch (error) {
            console.log(`api, ${error}`);
            response.status(500).json({error: error});
        }
    }

    static async apiGetRestaurantCuisines(request, response, next) {
        try {
            let cuisines = await RestaurantsDAO.getCuisines();
            response.json(cuisines);
        } catch (error) {
            console.log(`api, ${error}`);
            response.status(500).json({error: error});
        }
    }
}