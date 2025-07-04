/**
 * This file is responsible for the dashboard screen of NutriCast.
 * It will include:
 * - a circular progress bar of the calories consumed today by default with the amount of calories consumed from food and burned from exercise.
 * - goals for the day like number of steps and calories burned from exercise where the user can set their own personalized goals.
 * - a line chart of the user's weight and number of steps over days.
 * 
 * GOALS:
 * - Implement the circular progress bar to show calories consumed in the day. (Completed)
 * - Implement the daily goals. (In progress)
 * - Implement the line chart to show the user's weight.
 * 
 * TODO:
 * 
 * 
 * COMPLETED:
 * - UI for the circular progress bar showing calories consumed today.
 * - Created Food model to represent food items in NutriCast and connected SpringBoot to MongoDB.
 * - Created User model to represent users in NutriCast and connected it to MongoDB.
 * - Create a FoodLog model to represent the user's logged foods so that we can store when and how many servings the user has consumed.
 * - Update user model to include List<FoodLog> instead of List<String> for food logs.
 * - Create a FoodLogRepository to handle CRUD operations for food logs and findByUserFoodLogsForToday method.
 * - Create a NutritionService to handle the business logic of calculating calories consumed and burned.
 * - Changed the attributes of the Food and FoodLog model.
 * - Test new Food and FoodLog model to make sure it works with mongoDB.
 * - Create a CalorieController to handle the API endpoints for getting the user's daily calories consumed.
 * - Use axios to call the CalorieController API endpoint to get the user's daily calories consumed and show it on the dashboard.
 * - Connect backend to get the user's daily calorie goal, calories consumed.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import CircularProgress from 'react-native-circular-progress-indicator';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useAuth } from '../auth-context';
import backend from '../backend';
import Animated from 'react-native-reanimated';
import { Circle } from 'react-native-svg';

export default function Dashboard() {
    const { user, logout } = useAuth(); // Get the authenticated user from the auth context
    const [calorieGoal, setCalorieGoal] = useState(0); // User's goal for daily calorie intake
    const [caloriesConsumed, setCaloriesConsumed] = useState(0); // User's calories consumed today
    const [caloriesBurned, setCaloriesBurned] = useState(0); // User's calories burned from exercise today
    const caloriesRemaining = calorieGoal - caloriesConsumed + caloriesBurned; // User's remaining calories for the day
    const netCalories = caloriesConsumed - caloriesBurned; // User's net calorie intake
    const percentOfCalorieGoal = calorieGoal > 0 ? Math.min(Math.max(netCalories/calorieGoal * 100, 0), 100) : 0; // User's percentage of completion to the calorie goal

    useEffect(() => {
        // Get the user's calories logged today
        backend.get(`/api/users/${user?.email}/nutrition/calories/today`)
            .then(response => setCaloriesConsumed(response.data))
            .catch(error => {
                console.error(error);
            })

        // Get the user's calorie goal
        backend.get(`/api/users/${user?.email}/nutrition/calories/goal`)
            .then(response => setCalorieGoal(response.data))
            .catch(error => {
                console.error(error);
            })
    });

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}> {user?.email}'s NutriCast Dashboard</Text>
            <div style={{paddingTop: 10}}>
                <Text style={styles.heading1Text}>Today</Text>
                <Card mode='elevated'>
                    <Card.Title title='Calories' subtitle='Remaining = Goal - Consumed + Burned'/>
                    <Card.Content style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <div style={{padding: 10}}>
                            <AnimatedCircularProgress
                                size={150}
                                width={5}
                                fill={percentOfCalorieGoal}
                                tintColor="LimeGreen"
                                backgroundColor="grey"
                                rotation={0}
                                renderCap={({ center }) => <Circle cx={center.x} cy={center.y} r="5" fill="LimeGreen"/>}
                                padding={5}>
                                {
                                    () => (
                                        <Text style={{textAlign: 'center'}}>{caloriesRemaining}{"\n"}Remaining</Text>
                                    )
                                }
                            </AnimatedCircularProgress>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <Text>Goal: {calorieGoal}</Text>
                            <Text>Consumed: {caloriesConsumed}</Text>
                            <Text>Burned: {caloriesBurned}</Text>
                        </div>
                    </Card.Content>
                </Card>
            </div>    
        </View>
    );
}
        
// Style sheet for the dashboard screen.
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20
    },
    titleText: {
        fontSize: 26,
        fontWeight: 'bold'
    },
    heading1Text: {
        fontSize: 20,
        fontWeight: 'bold'
    }
})
