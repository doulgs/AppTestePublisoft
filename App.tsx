import { StatusBar } from "expo-status-bar";
import { RootStack } from "./src/routes/RootStack";

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <RootStack />
    </>
  );
}
