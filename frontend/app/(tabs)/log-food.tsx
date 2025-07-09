import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { Card } from "react-native-paper";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function LogFood() {
    const [searchFoods, setSearchFoods] = useState(''); // Search bar where users search for foods to log
    const [foods, setFoods] = useState([]) // List of foods that the user adds

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>Log Food</Text>
            <div style={{paddingTop: 10, width: '25%'}}>
                <Card mode="elevated">
                    <Card.Content style={styles.flexColumn}>
                        <div style={styles.searchBar}>
                            <div style={styles.customTextInput}>
                                <FontAwesome5 name='search' style={{fontSize: 16}}/>
                                <TextInput
                                    placeholder={'Search for a food'}
                                    value={searchFoods}
                                    onChangeText={(text) => {
                                            setSearchFoods(text);
                                            // Call backend api to get list of foods that match the text.
                                        }
                                    }
                                    style={[styles.textInput, styles.heading3Text]}
                                />
                            </div>
                        </div>
                        <div>
                            <div style={styles.foodsContent}>
                                {foods.length == 0 ? 
                                    <View>
                                        <Text style={styles.heading2Text}>Foods</Text>
                                    </View>
                                    :
                                    <View style={styles.flexRowBaseline}>
                                        <Text style={styles.heading2Text}>Foods</Text>
                                        <div style={{marginLeft: 'auto', paddingLeft: 16}}>
                                            <Button title='Add Food'/>
                                        </div>
                                    </View>
                                }
                            </div>
                            <div>
                                {/* Iterate through a list of Foods where we get it from the backend and show it all here. */}
                                {foods.length == 0 ? 
                                    <View>
                                        <div style={styles.flexColumnCenter}>
                                            <Text>See no foods? Add one!</Text>
                                            <Button title='Add Food'/>
                                        </div>
                                    </View>
                                    :
                                    <View>
                                        <div style={styles.flexColumn}>
                                            <Text>Log a Food!</Text>
                                        </div>
                                    </View>
                                }
                            </div>
                        </div>
                    </Card.Content>
                </Card>
            </div>
        </View>
    )
}

const styles = StyleSheet.create({
    // General styling for all tabs
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
    },

    // Specific styling for the tab
    textInput: {
        width: '95%',
        padding: 10,
        outlineWidth: 0,
    },
    customTextInput: {
        borderStyle: 'solid',
        borderRadius: 20,
        borderWidth: 0,
        backgroundColor: 'lightgrey',
        paddingLeft: 10,
        width: '100%'
    },
    searchBar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline',
        paddingBottom: 10,
        borderStyle: 'solid',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 1,
    },
    emptyFoodsContent: {
        
    },
    foodsContent: {
        paddingTop: 10,
        paddingBottom: 10
    }
})