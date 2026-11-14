import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { ArrowRight, CalendarDays, MapPin, Mountain } from "lucide-react-native";
import { CheckList, DetailScreen, FormSection, Gallery, Paragraph, Section, TitleBlock, photosOf } from "@/components/Detail";
import { CITY_OPTIONS, DateField, Input, InquiryForm, Row, SelectField, Stepper } from "@/components/Forms";
import { T } from "@/components/ui";
import { colors } from "@/lib/theme";

const departOptions = [{ label: "Departing from (optional)", value: "" }, ...CITY_OPTIONS.slice(1)];

export default function PlaceDetail() {
  return (
    <DetailScreen endpoint="sightseeing" what="place">
      {(place) => (
        <>
          <Gallery photos={photosOf(place)} Fallback={Mountain} />
          <TitleBlock
            badge={place.destination?.name}
            title={place.name}
            meta={[place.best_time && { Icon: CalendarDays, text: `Best time: ${place.best_time}` }]}
          />
          {place.short_description ? (
            <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
              <T style={{ color: colors.gray600, lineHeight: 21 }}>{place.short_description}</T>
            </View>
          ) : null}

          {place.destination && (
            <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
              <Pressable
                onPress={() => router.navigate({ pathname: "/tours", params: { destination: place.destination.slug } })}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  alignSelf: "flex-start",
                  backgroundColor: colors.green50,
                  borderRadius: 999,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                }}
              >
                <MapPin size={15} color={colors.green700} />
                <T weight="semibold" style={{ color: colors.green700, fontSize: 13 }}>
                  {place.destination.name} tours
                </T>
                <ArrowRight size={14} color={colors.green700} />
              </Pressable>
            </View>
          )}

          {place.description ? (
            <Section title="About">
              <Paragraph>{place.description}</Paragraph>
            </Section>
          ) : null}

          {place.highlights?.length > 0 && (
            <Section title="Highlights">
              <CheckList items={place.highlights} />
            </Section>
          )}

          <FormSection>
            <InquiryForm
              title={`Visit ${place.name}`}
              subtitle="Tour, hotel and transport, all arranged for you."
              itemName={place.name}
              initial={{ name: "", phone: "", travelDate: "", persons: "2", departureCity: "", message: "" }}
              buildPayload={(f) => ({
                booking_type: "place",
                item_name: place.name,
                name: f.name.trim(),
                phone: f.phone.trim(),
                destination: place.destination?.name || "",
                departure_city: f.departureCity,
                travel_date: f.travelDate || null,
                guests: Number(f.persons) || 1,
                message: f.message,
              })}
            >
              {(f, set) => (
                <>
                  <Input placeholder="Your name" value={f.name} onChangeText={set("name")} autoComplete="name" />
                  <Input placeholder="Phone / WhatsApp" value={f.phone} onChangeText={set("phone")} keyboardType="phone-pad" autoComplete="tel" />
                  <Row>
                    <DateField label="Travel date" value={f.travelDate} onChange={set("travelDate")} style={{ flex: 1 }} />
                    <Stepper label="Persons" value={f.persons} onChange={set("persons")} style={{ flex: 1 }} />
                  </Row>
                  <SelectField options={departOptions} value={f.departureCity} onChange={set("departureCity")} placeholder="Departing from (optional)" />
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
