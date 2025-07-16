import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { Card } from "react-native-paper";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import backend from "../../services/backend";
import { useAuth } from "../../services/auth-context";

interface Food {
  id: String;
  userId: String;
  name: String;
  type: FoodType;
  servingSize: number;
  servingUnit: String;
  macros: FoodMacros;
}

interface FoodMacros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol: number;
}

enum FoodType {
  ITEM,
  MEAL,
}

export default function LogFood() {
  const { user, logout } = useAuth();
  const router = useRouter(); // To redirect to other tabs
  const [search, setSearch] = useState(""); // What the user searches for
  const [foods, setFoods] = useState<Food[]>([]); // List of foods that the user adds

  const redirectToAddFoodTab = () => {
    router.push("/food/add-food");
  };

  const redirectToAddFoodLogTab = (foodId: String) => {
    router.push({
      pathname: "/food/add-food-log",
      params: { foodId: String(foodId) },
    });
  };

  // Get the user's added foods by the name on the search bar.
  // TODO: Right now, the search bar is case-sensitive to search for the added foods by the user.
  // TODO: So, we need to implement the backend where it can get the user's added foods without
  // TODO: searching for the food with the exact name. It should be able to get "Chicken Breast"
  // TODO: if the user searches "Chicken" in the search bar.
  const searchFoods = async (text: String) => {
    try {
      console.log(`/api/users/${user?.email}/foods/${text}`);
      const response = await backend.get(
        `/api/users/${user?.email}/foods/${text}`,
      );
      console.log("Got Foods Successfully: " + response.data);
      setFoods(response.data);
    } catch (exception: any) {
      console.log("Error getting Foods from backend: " + exception);
    }
  };

  useEffect(() => {
    // Gets the all of the user's added foods by default.
    backend
      .get(`/api/users/${user?.email}/foods/all`)
      .then((response) => setFoods(response.data))
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.titleText}>Log Food</Text>
        <View style={{ width: "100%" }}>
          <Card mode="elevated">
            <Card.Content style={styles.flexColumn}>
              <View style={styles.searchBar}>
                <View style={styles.customTextInput}>
                  <FontAwesome5 name="search" style={{ fontSize: 16 }} />
                  <TextInput
                    placeholder={"Search for a food"}
                    value={search}
                    onChangeText={(text) => {
                      // Call backend api to get list of foods that match the text.
                      setSearch(text);
                      text == "" ? searchFoods("all") : searchFoods(text);
                    }}
                    style={[styles.textInput, styles.heading3Text]}
                  />
                </View>
              </View>
              <View>
                <View style={styles.foodsContent}>
                  {foods.length == 0 ? (
                    <View>
                      <Text style={styles.heading2Text}>Foods</Text>
                    </View>
                  ) : (
                    <View style={styles.flexRowBaseline}>
                      <Text style={styles.heading2Text}>Foods</Text>
                      <View style={{ marginLeft: "auto", paddingLeft: 16 }}>
                        <Button title="Add Food" onPress={redirectToAddFoodTab} />
                      </View>
                    </View>
                  )}
                </View>
                <View>
                  {/* Iterate through a list of Foods where we get it from the backend and show it all here. */}
                  {foods.length == 0 ? (
                    <View>
                      <View style={styles.flexColumnCenter}>
                        <Text>See no foods? Add one!</Text>
                        <Button title="Add Food" onPress={redirectToAddFoodTab} />
                      </View>
                    </View>
                  ) : (
                    <View>
                      <View style={styles.flexColumn}>
                        {foods.map((food, idx) => (
                          <View key={idx} style={styles.foodContainer}>
                            <View style={styles.food}>
                              <View style={styles.flexRowCenter}>
                                <View style={styles.flexColumn}>
                                  <Text style={styles.heading2Text}>
                                    {food.name}
                                  </Text>
                                  <Text>
                                    {food.type}, {food.macros.calories} calories,{" "}
                                    {food.servingSize} {food.servingUnit}
                                  </Text>
                                </View>
                                <View style={{ marginLeft: "auto" }}>
                                  <Button
                                    title="Log Food"
                                    onPress={() =>
                                      redirectToAddFoodLogTab(food.id)
                                    }
                                  />
                                </View>
                              </View>
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // General styling for all tabs
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
  },
  titleText: {
    fontSize: 26,
    fontWeight: "bold",
  },
  heading1Text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  heading2Text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  heading3Text: {
    fontSize: 14,
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
  },
  flexColumnCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
  },
  flexRowBaseline: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
  },
  flexRowCenter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  flexSpaceEvenly: {
    display: "flex",
    justifyContent: "space-evenly",
  },

  // Specific styling for the tab
  textInput: {
    width: "95%",
    padding: 10,
    outlineWidth: 0,
  },
  customTextInput: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    borderStyle: "solid",
    borderRadius: 20,
    borderWidth: 0,
    backgroundColor: "lightgrey",
    paddingLeft: 10,
    width: "100%",
  },
  searchBar: {
    borderStyle: "solid",
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  emptyFoodsContent: {},
  foodsContent: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  food: {
    backgroundColor: "lightgrey",
    padding: 10,
    borderStyle: "solid",
    borderRadius: 10,
    borderWidth: 0,
  },
  foodContainer: {
    padding: 5,
  },
});
