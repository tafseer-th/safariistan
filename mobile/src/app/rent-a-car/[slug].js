import { StyleSheet, View } from "react-native";
import { Car, Cog, Snowflake, UserCheck, Users } from "lucide-react-native";
import { driverLabel } from "@/components/Cards";
import { CheckList, DetailScreen, FormSection, Gallery, Paragraph, Section, TitleBlock, photosOf } from "@/components/Detail";
import { DateField, Input, InquiryForm, Row, Stepper } from "@/components/Forms";
import { T } from "@/components/ui";
import { colors } from "@/lib/theme";

function Spec({ Icon, label, value }) {
  return (
    <View style={styles.spec}>
      <Icon size={20} color={colors.green600} />
      <T style={{ fontSize: 11, color: colors.gray500, marginTop: 6 }}>{label}</T>
      <T weight="semibold" style={{ fontSize: 13 }} numberOfLines={1}>
        {value}
      </T>
    </View>
  );
}

export default function VehicleDetail() {
  return (
    <DetailScreen endpoint="vehicles" what="vehicle">
      {(v) => (
        <>
          <Gallery photos={photosOf(v)} Fallback={Car} />
          <TitleBlock
            badge={v.vehicle_type_display}
            title={v.name}
            priceLabel="Per day"
            price={v.discounted_price}
            original={v.price_per_day}
            discount={v.discount_percent}
          />

          <View style={styles.specs}>
            <Spec Icon={Users} label="Seats" value={v.seats} />
            <Spec Icon={Cog} label="Gearbox" value={v.transmission_display} />
            <Spec Icon={Snowflake} label="AC" value={v.has_ac ? "Yes" : "No"} />
            <Spec Icon={UserCheck} label="Driver" value={driverLabel(v.driver_option)} />
          </View>

          {v.description ? (
            <Section title="About this vehicle">
              <Paragraph>{v.description}</Paragraph>
            </Section>
          ) : null}

          {v.features?.length > 0 && (
            <Section title="Features">
              <CheckList items={v.features} />
            </Section>
          )}

          <FormSection>
            <InquiryForm
              title="Rent this vehicle"
              subtitle="Send your details and we will share the rate."
              itemName={v.name}
              initial={{ name: "", phone: "", pickupDate: "", days: "1", pickupLocation: "", destination: "", message: "" }}
              buildPayload={(f) => ({
                booking_type: "vehicle",
                item_name: v.name,
                name: f.name.trim(),
                phone: f.phone.trim(),
                departure_city: f.pickupLocation, // pickup location
                destination: f.destination,
                travel_date: f.pickupDate || null,
                days: f.days ? Number(f.days) : null,
                message: f.message,
              })}
            >
              {(f, set) => (
                <>
                  <Input placeholder="Your name" value={f.name} onChangeText={set("name")} autoComplete="name" />
                  <Input placeholder="Phone / WhatsApp" value={f.phone} onChangeText={set("phone")} keyboardType="phone-pad" autoComplete="tel" />
                  <Row>
                    <DateField label="Pickup date" value={f.pickupDate} onChange={set("pickupDate")} style={{ flex: 1 }} />
                    <Stepper label="Days" value={f.days} onChange={set("days")} max={60} style={{ flex: 1 }} />
                  </Row>
                  <Input maxLength={60} placeholder="Pickup location (e.g. Islamabad)" value={f.pickupLocation} onChangeText={set("pickupLocation")} />
                  <Input maxLength={120} placeholder="Destination (e.g. Hunza)" value={f.destination} onChangeText={set("destination")} />
                  <Input placeholder="Message (optional)" value={f.message} onChangeText={set("message")} multiline />
                </>
              )}
            </InquiryForm>
          </FormSection>
        </>
      )}
    </DetailScreen>
  );
}

const styles = StyleSheet.create({
  specs: { flexDirection: "row", gap: 8, paddingHorizontal: 16, marginTop: 20 },
  spec: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
});
