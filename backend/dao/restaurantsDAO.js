let restaurants;

export default class RestaurantsDAO {
    // initial connection to the database
    /**
     * method to establish initial connection to the database "restaurants"
     * @param {*} conn 
     * @returns 
     */
    static async injectDB(conn) {
        // if restaurant exists returns nothing
        if (restaurants){
            return
        }
        try {
            // connect to the collection restaurants in sample_restaurant
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants");
        } catch (error) {
            console.error(`Unable to establish a collection handle in restaurantsDAO: ${error}` )
        }
    }

    /**
     * @param filters object with filter parameters
     * @param page page number of the returned list of restaurant
     * @param restaurantsPerPage number of restaurants returned on each page
     * @returns object which contains an array of restaurants and the number of restaurants in that array
     */
    static async getRestaurants({
        filters = null,
        page = 0,
        restaurantsPerPage = 20,
    } = {}) {
        let query;
        if (filters) {
            if ("name" in filters) {
                // text search query, need to set up in MongoDB Atlas
                query = {$text: {$search: filters["name"]}}
            } else if ("cuisine" in filters) {
                query = {"cuisine": {$eq: filters["cuisine"]}}
            } else if ("zipcode" in filters) {
                query = {"address.zipcode": {$eq: filters["zipcode"]}}
            }
        }

        let cursor;

        try {
            cursor = await restaurants.find(query);
        } catch (error) {
            console.error(`Unable to issue find command, ${error}`);
            return {restaurantsList: [], totalNumRestaurants: 0}
        }

        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page);

        try {
            const restaurantsList = await displayCursor.toArray();
            const totalNumRestaurants = await restaurants.countDocuments(query);

            return {restaurantsList, totalNumRestaurants}
        } catch (error) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${error}`);
            return {restaurantsList: [], totalNumRestaurants: 0}
        }
    }
}