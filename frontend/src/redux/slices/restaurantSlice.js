import { createSlice } from "@reduxjs/toolkit";
import { getRestaurants, createRestaurant, deleteRestaurant, analyzeReviews } from "../actions/restaurantAction";

const initialState = {
    restaurants : [],
    count : 0,
    loading : false,
    error : null,
    showVegOnly : false,
    pureVegRestaurantsCount : 0,
    creating: false,      
    createError: null,
    deleting: false,
    deleteError: null
}

const restaurantSlice = createSlice({
    name: "restaurants",
    initialState,
    reducers : {
        sortByRatings: (state) => {
            // Guard clause to protect against undefined arrays
            if (!Array.isArray(state.restaurants)) return;
            state.restaurants.sort((a, b) => b.ratings - a.ratings);
        },
        sortByReviews: (state) => {
            // Guard clause to protect against undefined arrays
            if (!Array.isArray(state.restaurants)) return;
            state.restaurants.sort((a, b) => b.numOfReviews - a.numOfReviews);
        },
        toggleVegOnly: (state) => {
            state.showVegOnly = !state.showVegOnly;
            state.pureVegRestaurantsCount = calculatePureVegCount(state.restaurants, state.showVegOnly);
        },
        clearError: (state) => {
            state.error = null;
        }
    },

    extraReducers : (builder) => {
        builder
        // GET RESTAURANTS
        .addCase(getRestaurants.pending, (state) => {
            state.loading = true;
        })
        .addCase(getRestaurants.fulfilled, (state, action) => {
            state.loading = false;
            // Added safe fallback operator (?.) and default values if payload structure shifts
            state.restaurants = action.payload?.restaurants || [];
            state.count = action.payload?.count || 0;
        })
        .addCase(getRestaurants.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to fetch restaurants";
        })

        // CREATE RESTAURANT
        .addCase(createRestaurant.pending, (state) => {
            state.creating = true;
            state.createError = null;
        })
        .addCase(createRestaurant.fulfilled, (state, action) => {
            state.creating = false;
            // Guard to make sure array push doesn't fail if initial loading failed
            if (!Array.isArray(state.restaurants)) {
                state.restaurants = [];
            }
            if (action.payload?.data) {
                state.restaurants.push(action.payload.data);
                state.count += 1;
            }
        })
        .addCase(createRestaurant.rejected, (state, action) => {
            state.creating = false;
            state.createError = action.payload;
        })

        // DELETE RESTAURANT
        .addCase(deleteRestaurant.pending, (state) => {
            state.deleting = true;
            state.deleteError = null;
        })
        .addCase(deleteRestaurant.fulfilled, (state, action) => {
            state.deleting = false;
            if (!Array.isArray(state.restaurants)) return;
            
            state.restaurants = state.restaurants.filter(
                (rest) => rest._id !== action.payload.id
            );
            state.count = Math.max(0, state.count - 1);
        })
        .addCase(deleteRestaurant.rejected, (state, action) => {
            state.deleting = false;
            state.deleteError = action.payload;
        })

        // ANALYZE REVIEWS
        .addCase(analyzeReviews.pending, (state) => {
            state.loading = true;
        })
        .addCase(analyzeReviews.fulfilled, (state, action) => {
            state.loading = false;
            if (!Array.isArray(state.restaurants) || !action.payload) return;

            const { restaurantId, aiData } = action.payload;
            const restaurant = state.restaurants.find(
                (r) => r._id === restaurantId
            );

            if (restaurant && aiData) {
                restaurant.reviewSentiment = aiData.sentiment;
                restaurant.reviewSummaryBullets = aiData.summaryBullets;
                restaurant.reviewTopMentions = aiData.topMentions;
            }
        })
        .addCase(analyzeReviews.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});

export const {
    sortByRatings,
    sortByReviews,
    toggleVegOnly,
    clearError
} = restaurantSlice.actions;

export default restaurantSlice.reducer;

// Helper function fixed to gracefully survive an undefined 'restaurants' argument
const calculatePureVegCount = (restaurants, showVegOnly) => {
    if (!Array.isArray(restaurants)) return 0;

    if (!showVegOnly) return restaurants.length;

    return restaurants.filter(restaurant => restaurant.isVeg).length;
};