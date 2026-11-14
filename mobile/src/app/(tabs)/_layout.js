import { Tabs } from "expo-router";
import { Car, Compass, Home, Hotel, Mountain } from "lucide-react-native";
import { colors, fonts } from "@/lib/theme";

// Bottom tabs = the website's main menu.
const tabs = [
  { name: "index", title: "Home", Icon: Home },
  { name: "tours", title: "Tours", Icon: Compass },
  { name: "hotels", title: "Hotels", Icon: Hotel },
  { name: "sightseeing", title: "Sightseeing", Icon: Mountain },
  { name: "rent-a-car", title: "Rent a Car", Icon: Car },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green600,
        tabBarInactiveTintColor: colors.gray500,
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11 },
        tabBarStyle: { borderTopColor: colors.gray100 },
      }}
    >
      {tabs.map(({ name, title, Icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{ title, tabBarIcon: ({ color, size }) => <Icon color={color} size={size - 2} /> }}
        />
      ))}
    </Tabs>
  );
}
