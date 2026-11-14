import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import AppHeader from "@/components/AppHeader";
import { CITY_OPTIONS, DateField, Input, InquiryForm, Row, SelectField, Stepper } from "@/components/Forms";
import { PageHero, T } from "@/components/ui";
import { colors } from "@/lib/theme";
import { useDestinations } from "@/lib/data";

const steps = [
  { title: "Tell us your plan", text: "Share your destination, dates and budget." },
  { title: "We build your trip", text: "Hotels, transport and sightseeing, all arranged for you." },
  { title: "Get your quote", text: "We contact you on WhatsApp or phone with the final plan." },
];

const empty = {
  name: "",
  phone: "",
  email: "",
  destination: "",
  departure_city: "",
  travel_date: "",
  days: "5",
  guests: "2",
  budget: "",
  message: "",
};

export default function MakeMyTripScreen() {
  const destinations = useDestinations();
  const destinationOptions = [{ label: "Not sure yet", value: "" }, ...destinations.map((d) => ({ label: d.name, value: d.name }))];

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppHeader back cta={false} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={{ paddingBottom: 48 }} keyboardShouldPersistTaps="handled">
          <PageHero title="Make" highlight="My Trip" text="Tell us what you have in mind and we will design a private tour around it." />

          {/* How it works */}
          <View style={styles.steps}>
            {steps.map((s, i) => (
              <View key={s.title} style={styles.step}>
                <View style={styles.stepNo}>
                  <T weight="bold" style={{ color: colors.white }}>
                    {i + 1}
                  </T>
                </View>
                <View style={{ flex: 1 }}>
                  <T weight="semibold">{s.title}</T>
                  <T style={{ color: colors.gray500, fontSize: 13 }}>{s.text}</T>
                </View>
              </View>
            ))}
          </View>

          <View style={{ paddingHorizontal: 16 }}>
            <InquiryForm
              itemName=""
              submitLabel="Send trip request"
              initial={empty}
              buildPayload={(f) => ({
                booking_type: "trip",
                name: f.name.trim(),
                phone: f.phone.trim(),
                email: f.email.trim(),
                destination: f.destination,
                departure_city: f.departure_city,
                travel_date: f.travel_date || null,
                days: f.days ? Number(f.days) : null,
                guests: Number(f.guests) || 1,
                budget: f.budget ? Number(f.budget.replace(/\D/g, "")) : null,
                message: f.message,
              })}
            >
              {(f, set) => (
                <>
                  <Input label="Your name *" placeholder="Full name" value={f.name} onChangeText={set("name")} autoComplete="name" />
                  <Input label="Phone / WhatsApp *" placeholder="03XX XXXXXXX" value={f.phone} onChangeText={set("phone")} keyboardType="phone-pad" autoComplete="tel" />
                  <Input
                    label="Email (optional)"
                    placeholder="you@example.com"
                    value={f.email}
                    onChangeText={set("email")}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                  <SelectField label="Where do you want to go?" options={destinationOptions} value={f.destination} onChange={set("destination")} placeholder="Not sure yet" />
                  <Row>
                    <SelectField label="Departing from" options={CITY_OPTIONS} value={f.departure_city} onChange={set("departure_city")} placeholder="Select city" />
                    <DateField label="Travel date" value={f.travel_date} onChange={set("travel_date")} style={{ flex: 1 }} />
                  </Row>
                  <Row>
                    <Stepper label="Number of days" value={f.days} onChange={set("days")} max={30} style={{ flex: 1 }} />
                    <Stepper label="Travelers" value={f.guests} onChange={set("guests")} style={{ flex: 1 }} />
                  </Row>
                  <Input label="Budget per person in Rs (optional)" placeholder="e.g. 40000" value={f.budget} onChangeText={set("budget")} keyboardType="number-pad" />
                  <Input
                    label="Anything else we should know?"
                    placeholder="Honeymoon, family trip, hotel preferences, places you want to see…"
                    value={f.message}
                    onChangeText={set("message")}
                    multiline
                  />
                </>
              )}
            </InquiryForm>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  steps: {
    margin: 16,
    padding: 18,
    gap: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  step: { flexDirection: "row", gap: 14, alignItems: "center" },
  stepNo: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.green600,
    alignItems: "center",
    justifyContent: "center",
  },
});
