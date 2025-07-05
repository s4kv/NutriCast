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
 *      - User can change their calorie goal
 *      - Make a page where the user can add food manually and log food manually.
 * 
 * COMPLETED:
 * - When a user makes an account from firebase, it also adds the user's account information to mongoDB.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useAuth } from '../auth-context';
import backend from '../backend';
import { Circle } from 'react-native-svg';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';

export default function Dashboard() {
    const router = useRouter();
    const { user, logout } = useAuth(); // Get the authenticated user from the auth context
    const [calorieGoal, setCalorieGoal] = useState(0); // User's goal for daily calorie intake
    const [caloriesConsumed, setCaloriesConsumed] = useState(0); // User's calories consumed today
    const [caloriesBurned, setCaloriesBurned] = useState(0); // User's calories burned from exercise today
    const caloriesRemaining = calorieGoal - caloriesConsumed + caloriesBurned; // User's remaining calories for the day
    const netCalories = caloriesConsumed - caloriesBurned; // User's net calorie intake
    const percentOfCalorieGoal = calorieGoal > 0 ? Math.min(Math.max(netCalories/calorieGoal * 100, 0), 100) : 0; // User's percentage of completion to the calorie goal

    const redirectToEditCaloriesCard = () => {
        router.push('/Nutrition/edit-calories-card');
    }

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
                    <div style={styles.flexRowBaseline}>
                        <Card.Title title='Calories'/>
                        <div style={{marginLeft: 'auto', paddingRight: 16}}>
                            <Button onPress={redirectToEditCaloriesCard}><FontAwesome5 name='edit'/> Edit</Button>
                        </div>
                    </div>
                    <Card.Content style={styles.flexColumn}>
                        <div style={styles.circularProgress}>
                            <AnimatedCircularProgress
                                size={200}
                                width={10}
                                fill={percentOfCalorieGoal}
                                tintColor="LimeGreen"
                                backgroundColor="grey"
                                rotation={0}
                                renderCap={({ center }) => <Circle cx={center.x} cy={center.y} r="5" fill="LimeGreen"/>}
                                padding={5}>
                                {
                                    () => (
                                        <div style={styles.flexColumnCenter}>
                                            <Text style={styles.heading1Text}>{caloriesRemaining}</Text>
                                            <Text>Remaining</Text>
                                        </div>
                                    )
                                }
                            </AnimatedCircularProgress>
                        </div>
                        <div style={styles.flexSpaceEvenly}>
                            <div style={styles.flexColumnCenter}>
                                <Text style={styles.heading3Text}>Goal:</Text>
                                <Text style={styles.heading1Text}>{calorieGoal} 🎯</Text>
                            </div>
                            <div style={styles.flexColumnCenter}>
                                <Text style={styles.heading3Text}>Consumed:</Text>
                                <Text style={styles.heading1Text}>{caloriesConsumed} 🍽️</Text>
                            </div>
                            <div style={styles.flexColumnCenter}>
                                <Text style={styles.heading3Text}>Burned:</Text>
                                <Text style={styles.heading1Text}>{caloriesBurned} 🔥</Text>
                            </div>
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
    circularProgress: {
       paddingLeft: 50, 
       paddingRight: 50, 
       paddingBottom: 10, 
       margin: 'auto'
    },
    titleText: {
        fontSize: 26,
        fontWeight: 'bold'
    },
    heading1Text: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    heading2Text: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    heading3Text: {
        fontSize: 14
    },
    flexColumn: {
        display: 'flex',
        flexDirection: 'column'
    },
    flexColumnCenter: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row'
    },
    flexRowBaseline: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline'
    },
    flexSpaceEvenly: {
        display: 'flex',
        justifyContent: 'space-evenly'
    }
})
