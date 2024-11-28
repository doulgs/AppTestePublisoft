import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Home } from "../app/Home";
import { PrintManager } from "../app/PrintManager";
import { ApiManager } from "../app/ApiManager";

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: "center",
          headerTintColor: "#FFF",
          headerStyle: { backgroundColor: "#000" },
        }}
      >
        <Stack.Screen name="Home" component={Home} options={{ headerTitle: "Aplicativo de Teste" }} />
        <Stack.Screen name="PrintManager" component={PrintManager} options={{ headerTitle: "Testes de Impressão" }} />
        <Stack.Screen name="ApiManager" component={ApiManager} options={{ headerTitle: "Testes de EndPoint" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export { RootStack };
