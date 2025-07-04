/**
 * This file is responsible for the dashboard screen of NutriCast.
 * It will include:
 * - a circular progress bar of the calories consumed today by default with the amount of calories consumed from food and burned from exercise.
 * - goals for the day like number of steps and calories burned from exercise where the user can set their own personalized goals.
 * - a line chart of the user's weight and number of steps over days.
 * 
 * GOALS:
 * - Implement the circular progress bar to show calories consumed in the day. (In Progress)
 * - Implement the daily goals.
 * - Implement the line chart to show the user's weight.
 * 
 * TODO:
 * - Implement the circular progress bar to show calories consumed in the day.
 *      - When a user makes an account from firebase, it also adds the user's account information to mongoDB.
 *      - Make a page where the user can add food manually and log food manually.
 * 
 * COMPLETED:
 * 
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useAuth } from '../auth-context';
import backend from '../backend';
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
